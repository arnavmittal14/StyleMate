import os
import json
from io import BytesIO

from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.http import JsonResponse, HttpResponseBadRequest
from django.core.files.storage import FileSystemStorage

# Image processing imports
from rembg import remove
from PIL import Image

# Import models from your apps
from closet.models import ClothingItem, Closet
from savedoutfit.models import SavedOutfit, OutfitSet

User = get_user_model()

@csrf_exempt
def homepage(request):
    return JsonResponse({'message': 'Hello world! This is Home'})

@csrf_exempt
def about(request):
    return JsonResponse({'message': 'This is about'})

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
        # Use email (instead of username) for login.
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        user = authenticate(email=email, password=password)
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
        
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password1 = data.get('password1')
        password2 = data.get('password2')
        profile_photo_url = data.get('profile_photo_url')  # Optional
        gender = data.get('gender')  # Required
        gender_other = data.get('gender_other')
        
        # Ensure required fields are provided.
        if not all([first_name, last_name, email, password1, password2, gender]):
            return JsonResponse({'error': 'First name, last name, email, password, and gender are required'}, status=400)
        
        if password1 != password2:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)
        
        try:
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password1,
                profile_photo_url=profile_photo_url,
                gender=gender,
                gender_other=gender_other
            )
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
        return JsonResponse({'message': 'User created successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

@csrf_exempt
def add_to_closet(request):
    # Support both JSON and multipart form-data
    if request.FILES:
        # Multipart form-data request: use request.POST and request.FILES
        data = request.POST
        photo = request.FILES.get('photo')
    else:
        # JSON request: parse JSON data and no file is uploaded
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        photo = None

    # Required fields
    item_name = data.get('item_name')
    user_id = data.get('user_id')
    if not item_name or not user_id:
        return JsonResponse({'error': 'Missing required fields: item_name and user_id'}, status=400)
    
    description   = data.get('description')
    subcategory_id = data.get('subcategory_id')
    color         = data.get('color')
    brand         = data.get('brand')

    image_url = None

    # If a file was uploaded, process it to remove the background
    if photo:
        # Validate file extension and MIME type
        if not photo.name.lower().endswith(('.jpg', '.jpeg', '.png')):
            return JsonResponse({'error': 'Unsupported file type. Only JPG and PNG are allowed.'}, status=400)
        if photo.content_type not in ['image/jpeg', 'image/png']:
            return JsonResponse({'error': 'Unsupported file type.'}, status=400)
        
        try:
            input_image = Image.open(photo)
        except Exception:
            return JsonResponse({'error': 'Invalid image file'}, status=400)
        
        # Remove background using rembg
        output_image = remove(input_image)
        
        # Save output image as PNG in memory using BytesIO
        output_io = BytesIO()
        output_image.save(output_io, format='PNG')
        output_io.seek(0)
        
        # Use original file's base name with .png extension
        base_name = os.path.splitext(photo.name)[0]
        filename = f"{base_name}.png"
        
        # Save the processed image using FileSystemStorage
        fs = FileSystemStorage()
        file_path = fs.save(f"processed/{filename}", ContentFile(output_io.read()))
        image_url = fs.url(file_path)
    else:
        # Otherwise, check for an image_url in the JSON data
        image_url = data.get('image_url')
    
    # Create or get the clothing item using the provided details and the processed image URL.
    clothing_item, created = ClothingItem.objects.get_or_create(
        item_name=item_name,
        description=description,
        subcategory_id=subcategory_id,
        color=color,
        brand=brand,
        image_url=image_url
    )
    
    # Get the user (ensure the user exists)
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    # Link the clothing item with the user's closet.
    closet_entry, created = Closet.objects.get_or_create(user=user, item=clothing_item)
    
    return JsonResponse({
        'message': 'Clothing item added to closet',
        'closet_id': closet_entry.closet_id,
        'item_id': clothing_item.item_id,
        'image_url': clothing_item.image_url
    }, status=201)

@csrf_exempt
def add_saved_outfit(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    user_id = data.get('user_id')
    outfit_name = data.get('outfit_name', 'My Outfit')
    if not user_id:
        return JsonResponse({'error': 'Missing required field: user_id'}, status=400)
    
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
    
    existing_outfit = OutfitSet.objects.filter(
        user=user,
        outfit_name=outfit_name,
        head_accessory_item=head_item,
        top_item=top_item,
        outerwear_item=outer_item,
        bottom_item=bottom_item,
        footwear_item=footwear_item,
        current_weather=current_weather
    ).first()
    
    if existing_outfit:
        return JsonResponse({
            'message': 'Duplicate outfit found',
            'saved_outfit_id': existing_outfit.outfit_id
        }, status=200)
    
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
    
    saved_outfit = SavedOutfit.objects.create(user=user, outfit=outfit_set)
    
    return JsonResponse({
        'message': 'Saved outfit created successfully',
        'saved_outfit_id': saved_outfit.saved_outfit_id,
        'outfit_id': outfit_set.outfit_id
    }, status=201)

@csrf_exempt
def get_saved_outfits(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)
    
    user_id = request.GET.get('user_id')
    if user_id:
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        saved_outfits = SavedOutfit.objects.filter(user=user)
    else:
        saved_outfits = SavedOutfit.objects.all()
    
    data = []
    for saved in saved_outfits:
        outfit = saved.outfit
        data.append({
            'saved_outfit_id': saved.saved_outfit_id,
            'user_id': saved.user.pk,
            'outfit_id': outfit.outfit_id,
            'outfit_name': outfit.outfit_name,
            'head_accessory_item_id': outfit.head_accessory_item_id,
            'top_item_id': outfit.top_item_id,
            'outerwear_item_id': outfit.outerwear_item_id,
            'bottom_item_id': outfit.bottom_item_id,
            'footwear_item_id': outfit.footwear_item_id,
            'current_weather': outfit.current_weather,
        })
    
    return JsonResponse({'saved_outfits': data}, status=200)

@csrf_exempt
def get_closet(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)
    
    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'user_id parameter required'}, status=400)
    
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    closet_entries = Closet.objects.filter(user=user)
    data = []
    for entry in closet_entries:
        item = entry.item
        data.append({
            'closet_id': entry.closet_id,
            'item_id': item.item_id,
            'item_name': item.item_name,
            'description': item.description,
            'subcategory_id': item.subcategory_id,
            'color': item.color,
            'brand': item.brand,
            'image_url': item.image_url,
            'created_at': item.created_at,
        })
    
    return JsonResponse({'closet': data}, status=200)

@csrf_exempt
def get_users(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)
    
    user_id = request.GET.get('user_id')
    if user_id:
        try:
            users = [User.objects.get(pk=user_id)]
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        users = User.objects.all()
    
    data = []
    for user in users:
        data.append({
            'user_id': user.pk,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'profile_photo_url': user.profile_photo_url,
            'gender': user.gender,
            'gender_other': user.gender_other,
            'last_login': user.last_login,
        })
    
    return JsonResponse({'users': data}, status=200)

@csrf_exempt
def upload_and_process_photo(request):
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST method allowed.")

    if 'photo' not in request.FILES:
        return HttpResponseBadRequest("No photo file uploaded.")

    photo = request.FILES['photo']
    
    # Validate file type by extension and MIME type.
    if not photo.name.lower().endswith(('.jpg', '.jpeg', '.png')):
        return HttpResponseBadRequest("Unsupported file type. Only JPG and PNG are allowed.")
    if photo.content_type not in ['image/jpeg', 'image/png']:
        return HttpResponseBadRequest("Unsupported file type.")

    # Open the uploaded image using Pillow.
    try:
        input_image = Image.open(photo)
    except Exception:
        return HttpResponseBadRequest("Invalid image file.")

    # Remove the background using rembg.
    output_image = remove(input_image)

    # Save the output image as PNG to an in-memory file.
    output_io = BytesIO()
    output_image.save(output_io, format='PNG')
    output_io.seek(0)

    # Use the original filename's base, but change the extension to .png.
    base_name = os.path.splitext(photo.name)[0]
    filename = f"{base_name}.png"

    # Save the processed image using Django's FileSystemStorage (which uses MEDIA_ROOT).
    fs = FileSystemStorage()
    # Save under the "processed/" subfolder.
    file_path = fs.save(f"processed/{filename}", ContentFile(output_io.read()))
    file_url = fs.url(file_path)

    return JsonResponse({
        'message': 'Photo processed successfully',
        'processed_image_url': file_url
    })

@csrf_exempt
def current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User not authenticated'}, status=401)
    
    user = request.user
    data = {
        'user_id': user.user_id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'gender': user.gender,
        'profile_photo_url': user.profile_photo_url or "/profile.png",
    }
    return JsonResponse({'user': data})


@csrf_exempt
def guest_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    gender = data.get('gender')
    if not gender:
        return JsonResponse({'error': 'Gender is required'}, status=400)
    
    # Choose a guest account based on the provided gender.
    # Adjust the email and password to match your guest accounts.
    if gender.lower() == 'male':
        guest_email = "guest_male@example.com"
        guest_password = "guestpassword"
    elif gender.lower() == 'female':
        guest_email = "guest_female@example.com"
        guest_password = "guestpassword"
    elif gender.lower() == 'other':
        guest_email = "guest_mixed@example.com"
        guest_password = "guestpassword"

    user = authenticate(email=guest_email, password=guest_password)
    if user is not None:
        auth_login(request, user)
        return JsonResponse({'message': 'Guest login successful', 'user_id': user.user_id})
    else:
        return JsonResponse({'error': 'Guest login failed'}, status=401)