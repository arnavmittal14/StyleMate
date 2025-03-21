# views.py

import base64
import json
import os
from io import BytesIO

from closet.models import Closet, ClothingItem
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth import login as auth_login
from django.core.files.storage import default_storage
from django.http import JsonResponse, HttpResponse, Http404, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
from rembg import remove
from savedoutfit.models import OutfitSet, SavedOutfit

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

        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)

        user = authenticate(email=email, password=password)
        if user is not None:
            auth_login(request, user)
            request.session.save()
            return JsonResponse({'message': 'Login successful', 'user_id': user.user_id}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
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
        profile_photo_url = data.get('profile_photo_url')
        gender = data.get('gender')
        gender_other = data.get('gender_other')

        if not all([first_name, last_name, email, password1, password2, gender]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

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
            auth_login(request, user)
            request.session.save()
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

        return JsonResponse({'message': 'User created successfully', 'userId': user.user_id}, status=201)
    return JsonResponse({'error': 'Only POST method allowed'}, status=405)


@csrf_exempt
def add_to_closet(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    content_type = request.content_type

    if content_type.startswith("multipart/form-data"):
        data = request.POST
        photo = request.FILES.get("photo")
    elif content_type.startswith("application/json"):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        photo = None
    else:
        return JsonResponse({"error": "Unsupported content type"}, status=400)

    item_name = data.get("item_name")
    user_id = data.get("user_id")
    if not item_name or not user_id:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    description = data.get("description")
    category_id = data.get("category_id")
    color = data.get("color")
    brand = data.get("brand")

    image_url = data.get("image_url", None)

    if photo:
        try:
            if not photo.name.lower().endswith((".jpg", ".jpeg", ".png")):
                return JsonResponse({"error": "Unsupported file type."}, status=400)

            input_image = Image.open(photo)
            if input_image.mode != "RGB":
                input_image = input_image.convert("RGB")

            output_image = remove(input_image)
            output_io = BytesIO()
            output_image.save(output_io, format="PNG")
            processed_bytes = output_io.getvalue()

            filename = f"{item_name.replace(' ', '_').lower()}_{user_id}.png"
            file_path = os.path.join("closet", filename)

            with default_storage.open(file_path, "wb") as out_file:
                out_file.write(processed_bytes)

            image_url = request.build_absolute_uri(f"/media/{file_path}")

        except Exception as e:
            return JsonResponse({"error": f"Error processing image: {str(e)}"}, status=400)

    clothing_item, created = ClothingItem.objects.get_or_create(
        item_name=item_name,
        defaults={
            "description": description,
            "category_id": category_id,
            "color": color,
            "brand": brand,
            "image_url": image_url,
        },
    )

    if not created and image_url:
        clothing_item.image_url = image_url
        clothing_item.save()

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    closet_entry, _ = Closet.objects.get_or_create(user=user, item=clothing_item)

    return JsonResponse({
        "message": "Clothing item added to closet",
        "closet_id": closet_entry.closet_id,
        "item_id": clothing_item.item_id,
        "image_url": clothing_item.image_url,
    }, status=201)


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
            'category_id': item.category_id,
            'color': item.color,
            'brand': item.brand,
            'image_url': request.build_absolute_uri(item.image_url) if item.image_url else None,
            'created_at': item.created_at,
        })

    return JsonResponse({'closet': data}, status=200)


@csrf_exempt
def get_saved_outfits(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)

    user_id = request.GET.get('user_id')

    if user_id:
        try:
            user = User.objects.get(pk=user_id)
            saved_outfits = SavedOutfit.objects.filter(user=user)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        saved_outfits = SavedOutfit.objects.all()

    data = []
    for saved in saved_outfits:
        outfit = saved.outfit

        def get_clothing_item(item_id):
            if item_id:
                try:
                    item = ClothingItem.objects.get(pk=item_id)
                    return {
                        "item_id": item.item_id,
                        "item_name": item.item_name,
                        "image_url": request.build_absolute_uri(item.image_url) if item.image_url else None
                    }
                except ClothingItem.DoesNotExist:
                    return None
            return None

        outfit_data = {
            'saved_outfit_id': saved.saved_outfit_id,
            'user_id': saved.user.pk,
            'outfit_id': outfit.outfit_id,
            'outfit_name': outfit.outfit_name,
            'current_weather': outfit.current_weather,
            'items': {
                "Head Accessory": get_clothing_item(outfit.head_accessory_item_id),
                "Top": get_clothing_item(outfit.top_item_id),
                "Outerwear": get_clothing_item(outfit.outerwear_item_id),
                "Bottom": get_clothing_item(outfit.bottom_item_id),
                "Footwear": get_clothing_item(outfit.footwear_item_id),
            }
        }

        data.append(outfit_data)

    return JsonResponse({'saved_outfits': data}, status=200)
