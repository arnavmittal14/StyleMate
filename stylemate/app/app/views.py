import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import get_user_model
User = get_user_model()
from closet.models import ClothingItem, Closet
from savedoutfit.models import SavedOutfit, OutfitSet


@csrf_exempt
def homepage(request):
    # Simple JSON response for the homepage.
    return JsonResponse({'message': 'Hello world! This is Home'})

@csrf_exempt
def about(request):
    # Simple JSON response for the about page.
    return JsonResponse({'message': 'This is about'})

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)

        user = authenticate(username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return JsonResponse({'message': 'Login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        username = data.get('username')
        email = data.get('email')
        password1 = data.get('password1')
        password2 = data.get('password2')

        if not all([username, email, password1, password2]):
            return JsonResponse({'error': 'All fields are required'}, status=400)

        if password1 != password2:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        User = get_user_model()
        try:
            user = User.objects.create_user(username=username, email=email, password=password1)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        return JsonResponse({'message': 'User created successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

@csrf_exempt
def add_to_closet(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    # Required fields: item_name and user_id
    item_name = data.get('item_name')
    user_id = data.get('user_id')
    if not item_name or not user_id:
        return JsonResponse({'error': 'Missing required fields: item_name and user_id'}, status=400)
    
    # Optional fields
    description = data.get('description')
    subcategory_id = data.get('subcategory_id')
    color = data.get('color')
    brand = data.get('brand')
    image_url = data.get('image_url')
    
    # Use get_or_create for the ClothingItem record
    clothing_item, item_created = ClothingItem.objects.get_or_create(
        item_name=item_name,
        description=description,
        subcategory_id=subcategory_id,
        color=color,
        brand=brand,
        image_url=image_url
    )
    
    # Get the user
    User = get_user_model()
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    # Use get_or_create for the Closet record linking the item to the user
    closet_entry, closet_created = Closet.objects.get_or_create(
        user=user,
        item=clothing_item
    )
    
    return JsonResponse({
        'message': 'Clothing item added to closet',
        'closet_id': closet_entry.closet_id,
        'item_id': clothing_item.item_id
    }, status=201)


@csrf_exempt
def add_saved_outfit(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    # Required: user_id and outfit_name (for the outfit set)
    user_id = data.get('user_id')
    outfit_name = data.get('outfit_name', 'My Outfit')
    if not user_id:
        return JsonResponse({'error': 'Missing required field: user_id'}, status=400)
    
    User = get_user_model()
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    def get_clothing_item(item_key):
        item_id = data.get(item_key)
        if item_id:
            try:
                return ClothingItem.objects.get(pk=item_id)
            except ClothingItem.DoesNotExist:
                return None
        return None

    head_item = get_clothing_item('head_accessory_item_id')
    top_item = get_clothing_item('top_item_id')
    outer_item = get_clothing_item('outerwear_item_id')
    bottom_item = get_clothing_item('bottom_item_id')
    footwear_item = get_clothing_item('footwear_item_id')
    current_weather = data.get('current_weather')

    # Check if an outfit set with the same combination already exists for this user.
    # Note: Since some fields may be None, the filtering must handle that.
    existing_outfit = OutfitSet.objects.filter(
        user=user,
        outfit_name=outfit_name,  # Include outfit name if desired in your uniqueness check.
        head_accessory_item=head_item,
        top_item=top_item,
        outerwear_item=outer_item,
        bottom_item=bottom_item,
        footwear_item=footwear_item,
        current_weather=current_weather
    ).first()
    
    if existing_outfit:
        # Option: Return the existing outfit rather than creating a new one.
        return JsonResponse({
            'message': 'Duplicate outfit found',
            'saved_outfit_id': existing_outfit.outfit_id  # or however you wish to reference it
        }, status=200)
    
    # No duplicate found; create a new OutfitSet record
    outfit_set = OutfitSet.objects.create(
        user=user,
        outfit_name=outfit_name,
        head_accessory_item=head_item,
        top_item=top_item,
        outerwear_item=outer_item,
        bottom_item=bottom_item,
        footwear_item=footwear_item,
        current_weather=current_weather
    )
    
    # Create the SavedOutfit record referencing the outfit set
    saved_outfit = SavedOutfit.objects.create(
        user=user,
        outfit=outfit_set
    )
    
    return JsonResponse({
        'message': 'Saved outfit created successfully',
        'saved_outfit_id': saved_outfit.saved_outfit_id,
        'outfit_id': outfit_set.outfit_id
    }, status=201)
