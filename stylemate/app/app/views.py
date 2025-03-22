import base64
import json
import os
from io import BytesIO

# Import models from your apps
from closet.models import Closet, ClothingItem
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth import login as auth_login
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage, default_storage
from django.http import Http404, HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image

# Image processing imports
from rembg import remove
from savedoutfit.models import OutfitSet, SavedOutfit

User = get_user_model()


@csrf_exempt
def homepage(request):
    return JsonResponse({"message": "Hello world! This is Home"})


@csrf_exempt
def about(request):
    return JsonResponse({"message": "This is about"})


@csrf_exempt
def api_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        # Use email (instead of username) for login.
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return JsonResponse(
                {"error": "Email and password are required"}, status=400
            )

        user = authenticate(email=email, password=password)
        if user is not None:
            auth_login(request, user)
            request.session.save()
            return JsonResponse({"message": "Login successful"}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    else:
        return JsonResponse({"error": "Only POST method allowed"}, status=405)


@csrf_exempt
def api_register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        password1 = data.get("password1")
        password2 = data.get("password2")
        profile_photo_url = data.get("profile_photo_url")  # Optional
        gender = data.get("gender")  # Required
        gender_other = data.get("gender_other")

        # Ensure required fields are provided.
        if not all([first_name, last_name, email, password1, password2, gender]):
            return JsonResponse(
                {
                    "error": "First name, last name, email, password, and gender are required"
                },
                status=400,
            )

        if password1 != password2:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        try:
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password1,
                profile_photo_url=profile_photo_url,
                gender=gender,
                gender_other=gender_other,
            )

            auth_login(request, user)
            request.session.save()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

        return JsonResponse(
            {"message": "User created successfully", "userId": user.user_id}, status=201
        )
    else:
        return JsonResponse({"error": "Only POST method allowed"}, status=405)


@csrf_exempt
def add_to_closet(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    content_type = request.content_type

    if content_type.startswith("multipart/form-data"):
        data = request.POST
        photo = request.FILES.get("photo")  # Get uploaded photo file
    elif content_type.startswith("application/json"):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        photo = None
    else:
        return JsonResponse({"error": "Unsupported content type"}, status=400)

    # Required fields
    item_name = data.get("item_name")
    user_id = data.get("user_id")
    if not item_name or not user_id:
        return JsonResponse(
            {"error": "Missing required fields: item_name and user_id"}, status=400
        )

    description = data.get("description")
    category_id = data.get("category_id")
    color = data.get("color")
    brand = data.get("brand")

    # Save Image if provided
    # Default to None if no image is uploaded
    image_url = data.get("image_url", None)

    if photo:
        try:
            # Validate file type
            if not photo.name.lower().endswith((".jpg", ".jpeg", ".png")):
                return JsonResponse(
                    {"error": "Unsupported file type. Only JPG and PNG are allowed."},
                    status=400,
                )

            # Open image
            input_image = Image.open(photo)

            # Ensure image is in correct mode
            if input_image.mode != "RGB":
                input_image = input_image.convert("RGB")

            # Apply background removal
            output_image = input_image

            # Convert to PNG bytes
            output_io = BytesIO()
            output_image.save(output_io, format="PNG")
            processed_bytes = output_io.getvalue()

            # Generate unique filename
            filename = f"{item_name.replace(' ', '_').lower()}_{user_id}.png"
            # Store under media/closet/
            file_path = os.path.join("closet", filename)

            # Save the processed image
            with default_storage.open(file_path, "wb") as out_file:
                out_file.write(processed_bytes)

            image_url = f"/media/{file_path}"  # URL to access image

        except Exception as e:
            return JsonResponse(
                {"error": f"Error lsprocessing image: {str(e)}"}, status=400
            )

    # Create ClothingItem instance
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
        clothing_item.image_url = image_url  # Update image if item exists
        clothing_item.save()

    # Retrieve User
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # Link ClothingItem to User's Closet
    closet_entry, _ = Closet.objects.get_or_create(user=user, item=clothing_item)

    return JsonResponse(
        {
            "message": "Clothing item added to closet",
            "closet_id": closet_entry.closet_id,
            "item_id": clothing_item.item_id,
            "image_url": image_url,  # Return the image URL
        },
        status=201,
    )


@csrf_exempt
def add_saved_outfit(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user_id = data.get("user_id")
    outfit_name = data.get("outfit_name", "My Outfit")
    if not user_id:
        return JsonResponse({"error": "Missing required field: user_id"}, status=400)

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    def get_clothing_item(item_key):
        item_id = data.get(item_key)
        if item_id:
            try:
                return ClothingItem.objects.get(pk=item_id)
            except ClothingItem.DoesNotExist:
                return None
        return None

    head_item = get_clothing_item("head_accessory_item_id")
    top_item = get_clothing_item("top_item_id")
    outer_item = get_clothing_item("outerwear_item_id")
    bottom_item = get_clothing_item("bottom_item_id")
    footwear_item = get_clothing_item("footwear_item_id")
    current_weather = data.get("current_weather")

    existing_outfit = OutfitSet.objects.filter(
        user=user,
        outfit_name=outfit_name,
        head_accessory_item=head_item,
        top_item=top_item,
        outerwear_item=outer_item,
        bottom_item=bottom_item,
        footwear_item=footwear_item,
        current_weather=current_weather,
    ).first()

    if existing_outfit:
        return JsonResponse(
            {
                "message": "Duplicate outfit found",
                "saved_outfit_id": existing_outfit.outfit_id,
            },
            status=200,
        )

    outfit_set = OutfitSet.objects.create(
        user=user,
        outfit_name=outfit_name,
        head_accessory_item=head_item,
        top_item=top_item,
        outerwear_item=outer_item,
        bottom_item=bottom_item,
        footwear_item=footwear_item,
        current_weather=current_weather,
    )

    saved_outfit = SavedOutfit.objects.create(user=user, outfit=outfit_set)

    return JsonResponse(
        {
            "message": "Saved outfit created successfully",
            "saved_outfit_id": saved_outfit.saved_outfit_id,
            "outfit_id": outfit_set.outfit_id,
        },
        status=201,
    )


@csrf_exempt
def get_saved_outfits(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method allowed"}, status=405)

    user_id = request.GET.get("user_id")

    if user_id:
        try:
            user = User.objects.get(pk=user_id)
            saved_outfits = SavedOutfit.objects.filter(user=user)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    else:
        saved_outfits = SavedOutfit.objects.all()

    data = []
    for saved in saved_outfits:
        outfit = saved.outfit

        def get_clothing_item(item_id):
            if item_id:
                try:
                    item = ClothingItem.objects.get(pk=item_id)
                    image_url = item.image_url or ""
                    if image_url and not str(image_url).startswith("http"):
                        image_url = f"{LIVE_BASE_URL}{image_url}"

                    return {
                        "item_id": item.item_id,
                        "item_name": item.item_name,
                        "image_url": image_url,
                    }
                except ClothingItem.DoesNotExist:
                    return None
            return None

        outfit_data = {
            "saved_outfit_id": saved.saved_outfit_id,
            "user_id": saved.user.pk,
            "outfit_id": outfit.outfit_id,
            "outfit_name": outfit.outfit_name,
            "current_weather": outfit.current_weather,
            "items": {
                "Head Accessory": get_clothing_item(outfit.head_accessory_item_id),
                "Top": get_clothing_item(outfit.top_item_id),
                "Outerwear": get_clothing_item(outfit.outerwear_item_id),
                "Bottom": get_clothing_item(outfit.bottom_item_id),
                "Footwear": get_clothing_item(outfit.footwear_item_id),
            },
        }
        data.append(outfit_data)

    return JsonResponse({"saved_outfits": data}, status=200)


User = get_user_model()


@csrf_exempt
@csrf_exempt
def get_closet(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method allowed"}, status=405)

    user_id = request.GET.get("user_id")
    if not user_id:
        return JsonResponse({"error": "user_id parameter required"}, status=400)

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # ✅ Hardcoded live Choreo base URL with correct prefix
    BASE_URL = "https://26f6fa57-a5b6-4f2c-936e-3e0cb15a69ba-dev.e1-us-east-azure.choreoapis.dev/stylemate/app/v1.0"

    closet_entries = Closet.objects.filter(user=user)
    data = []

    for entry in closet_entries:
        item = entry.item

        image_url = item.image_url
        if image_url and not str(image_url).startswith("http"):
            # 🔥 Fix: Insert full path including /stylemate/app/v1.0/
            image_url = f"{BASE_URL}{image_url}"

        data.append(
            {
                "closet_id": entry.closet_id,
                "item_id": item.item_id,
                "item_name": item.item_name,
                "description": item.description,
                "category_id": item.category_id,
                "color": item.color,
                "brand": item.brand,
                "image_url": image_url,
                "created_at": item.created_at,
            }
        )

    return JsonResponse({"closet": data}, status=200)


@csrf_exempt
def delete_from_closet(request):
    if request.method != "DELETE":
        return JsonResponse({"error": "Only DELETE method allowed"}, status=405)

    user_id = request.GET.get("user_id", None)
    if not user_id:
        return JsonResponse({"error": "user_id parameter required"}, status=400)

    body = json.loads(request.body)
    item_id = body.get("item_id")
    closet_id = body.get("closet_id")

    try:
        item = ClothingItem.objects.get(pk=item_id)
        try:
            closet_entry = Closet.objects.get(closet_id=closet_id, item=item)
            closet_entry.delete()
            item.delete()
            return JsonResponse(
                {"message": f"Item {item_id} has been deleted successfully"}, status=200
            )
        except Closet.DoesNotExist:
            return JsonResponse({"error": "Closet item not found"}, status=404)
    except ClothingItem.DoesNotExist:
        return JsonResponse({"error": "Item not found"}, status=404)


@csrf_exempt
def get_users(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method allowed"}, status=405)

    user_id = request.GET.get("user_id")
    if user_id:
        try:
            users = [User.objects.get(pk=user_id)]
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
    else:
        users = User.objects.all()

    data = []
    for user in users:
        data.append(
            {
                "user_id": user.pk,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "profile_photo_url": user.profile_photo_url,
                "gender": user.gender,
                "gender_other": user.gender_other,
                "last_login": user.last_login,
            }
        )

    return JsonResponse({"users": data}, status=200)


@csrf_exempt
def upload_and_process_photo(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST method allowed.")

    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    if "photo" not in request.FILES:
        return HttpResponseBadRequest("No photo file uploaded.")

    photo = request.FILES["photo"]

    # Validate file type by extension and MIME type
    if not photo.name.lower().endswith((".jpg", ".jpeg", ".png")):
        return HttpResponseBadRequest(
            "Unsupported file type. Only JPG and PNG are allowed."
        )
    if photo.content_type not in ["image/jpeg", "image/png"]:
        return HttpResponseBadRequest("Unsupported file type.")

    try:
        input_image = Image.open(photo)
    except Exception:
        return HttpResponseBadRequest("Invalid image file.")

    # Remove background using rembg
    output_image = input_image

    # Convert to PNG in-memory
    output_io = BytesIO()
    output_image.save(output_io, format="PNG")
    processed_bytes = output_io.getvalue()  # raw bytes of the PNG

    # Store the bytes in the user's profile_photo_data field
    user = request.user
    user.profile_photo_url = processed_bytes
    user.save()

    return JsonResponse(
        {
            "message": "Photo processed and stored in DB",
        }
    )


LIVE_BASE_URL = "https://26f6fa57-a5b6-4f2c-936e-3e0cb15a69ba-dev.e1-us-east-azure.choreoapis.dev/stylemate/app/v1.0"

@csrf_exempt
def current_user(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    user = request.user
    if hasattr(user, "profile_photo_url") and user.profile_photo_url:
        photo_url = f"{LIVE_BASE_URL}/api/profile_photo/{user.user_id}/"
    else:
        photo_url = f"{LIVE_BASE_URL}/profile.png"

    data = {
        "user_id": user.user_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "gender": user.gender,
        "profile_photo_url": photo_url,
    }
    return JsonResponse({"user": data})


@csrf_exempt
def guest_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    gender = data.get("gender")
    if not gender:
        return JsonResponse({"error": "Gender is required"}, status=400)

    # Choose a guest account based on the provided gender.
    # Adjust the email and password to match your guest accounts.
    if gender.lower() == "male":
        guest_email = "guest_male@example.com"
        guest_password = "guestpassword"
    elif gender.lower() == "female":
        guest_email = "guest_female@example.com"
        guest_password = "guestpassword"
    elif gender.lower() == "other":
        guest_email = "guest_mixed@example.com"
        guest_password = "guestpassword"

    user = authenticate(email=guest_email, password=guest_password)
    if user is not None:
        auth_login(request, user)
        return JsonResponse(
            {"message": "Guest login successful", "user_id": user.user_id}
        )
    else:
        return JsonResponse({"error": "Guest login failed"}, status=401)


def serve_profile_photo(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404("User not found")

    if not hasattr(user, "profile_photo_url") or not user.profile_photo_url:
        raise Http404("No profile photo")

    return HttpResponse(user.profile_photo_url, content_type="image/png")


def serve_clothing_item(request, item_id):
    try:
        item = ClothingItem.objects.get(pk=item_id)
    except ClothingItem.DoesNotExist:
        raise Http404("Clothing item not found")

    if not item.image_url:
        raise Http404("No image available")

    # Convert to bytes in case it is a memoryview
    image_data = bytes(item.image_url)
    response = HttpResponse(image_data, content_type="image/png")
    response["Content-Length"] = len(image_data)
    return response


@csrf_exempt
def update_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not authenticated"}, status=401)

    user = request.user

    # Get text fields from request.POST (for multipart form-data)
    first_name = request.POST.get("first_name", user.first_name)
    last_name = request.POST.get("last_name", user.last_name)
    email = request.POST.get("email", user.email)
    gender = request.POST.get("gender", user.gender)
    if gender:
        gender = gender.lower()  # Convert to lowercase to match model choices

    # Handle profile photo file
    profile_photo = request.FILES.get("profile_photo")
    if profile_photo:
        # Validate file type
        if not profile_photo.name.lower().endswith((".jpg", ".jpeg", ".png")):
            return HttpResponseBadRequest(
                "Unsupported file type. Only JPG and PNG are allowed."
            )
        if profile_photo.content_type not in ["image/jpeg", "image/png"]:
            return HttpResponseBadRequest("Unsupported file type.")

        try:
            input_image = Image.open(profile_photo)
        except Exception:
            return HttpResponseBadRequest("Invalid image file.")

        # Patch for Pillow if Image.Resampling is missing
        if not hasattr(Image, "Resampling"):
            Image.Resampling = Image
            Image.Resampling.LANCZOS = Image.LANCZOS

        try:
            # Remove background using rembg
            output_image = input_image
        except Exception as e:
            return JsonResponse({"error": f"Error processing image: {e}"}, status=400)

        # Convert the processed image to PNG bytes
        output_io = BytesIO()
        output_image.save(output_io, format="PNG")
        processed_bytes = output_io.getvalue()
        user.profile_photo_url = processed_bytes

    # Update user fields
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    user.gender = gender

    try:
        user.save()
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"message": "User updated successfully"})
