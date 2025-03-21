from django.shortcuts import render
import google.generativeai as genai
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from .models import OutfitSuggestion
from closet.models import Closet, ClothingItem
from savedoutfit.models import OutfitSet, SavedOutfit
import json
from collections import defaultdict
import re

User = get_user_model()

# Initialize Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


@api_view(["POST"])
@csrf_exempt  # ✅ Disable CSRF protection (only for debugging)
@permission_classes([AllowAny])  # ✅ Allow all users to access this API
def generate_outfit(request):
    print("🔹 Incoming Headers:", request.headers)
    print("🔹 Incoming Data:", request.data)

    # Check if Django recognizes authentication
    print("🔹 Django Thinks User Is:", request.user)

    if request.user.is_authenticated:
        print(f"🔹 Authenticated as: {request.user.email}")
    else:
        print("❌ WARNING: User is Anonymous (Not Authenticated)")
    
    data = request.data
    occasion = data.get("occasion", "").strip()
    user_id = data.get("user_id")

    if not occasion:
        return Response({"error": "Please provide an occasion."}, status=400)
    if not user_id:
        return Response({"error": "User ID is required."}, status=400)

    # Ensure user_id is an integer
    try:
        user_id = int(user_id)
    except ValueError:
        return Response({"error": "Invalid user_id. Must be an integer."}, status=400)

    # Fetch user
    try:
        user = User.objects.get(user_id=user_id)
        print(f"🔹 Found User: {user.email}")
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

    # Fetch user's closet items
    user_closet_items = Closet.objects.filter(user_id=user.user_id).select_related("item")
    if not user_closet_items.exists():
        return Response({"error": "No clothing items found in your closet."}, status=400)

    # Store category keys as **integers** for consistent lookup
    category_map = defaultdict(list)
    for entry in user_closet_items:
        clothing_item = entry.item
        category_key = int(clothing_item.category_id)  # Ensure category key is an integer
        category_map[category_key].append({
            "item_id": clothing_item.item_id,
            "item_name": clothing_item.item_name,
            "image_url": request.build_absolute_uri(clothing_item.image_url) if clothing_item.image_url else None,
        })

    formatted_clothing_options = {
        1: category_map.get(1, []),  # Head Accessory
        2: category_map.get(2, []),  # Top
        3: category_map.get(3, []),  # Outerwear
        4: category_map.get(4, []),  # Bottom
        5: category_map.get(5, []),  # Footwear
    }

    print(f"🔹 Available Clothing Choices for LLM: {json.dumps(formatted_clothing_options, indent=2)}")

    # ✅ Ensure LLM only selects from available closet items
    prompt = f"""
    You are a personal stylist. The user has these clothing options:

    {json.dumps(formatted_clothing_options, indent=2)}

    The user wants an outfit for this occasion: **{occasion}**.

    🚨 **Rules:**
    - Pick ONLY from the given clothing items.
    - Do NOT create new items.
    - If no suitable item exists for a category, return `"None"`.
    - Always return **ONLY JSON**. No extra words.

    📌 **JSON Response Format:**
    ```json
    {{
        "1": {{"item_id": 123, "item_name": "Selected Hat"}}, 
        "2": {{"item_id": 456, "item_name": "Selected Shirt"}},
        "3": {{"item_id": 789, "item_name": "Selected Jacket"}},
        "4": {{"item_id": 321, "item_name": "Selected Pants"}},
        "5": {{"item_id": 654, "item_name": "Selected Shoes"}}
    }}
    ```
    """

    print("🔹 Sending Prompt to LLM...")

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        raw_response = response.text
        print(f"🔹 Raw Response from LLM: {raw_response}")

        # Extract JSON
        json_match = re.search(r"\{[\s\S]*\}", raw_response)
        if not json_match:
            return Response({"error": "LLM response is not JSON formatted."}, status=500)

        cleaned_response = json_match.group().strip()
        cleaned_response = re.sub(r"```(json)?", "", cleaned_response).strip()

        outfit_suggestion = json.loads(cleaned_response)

        # ✅ Fix: Ensure correct integer category lookup
        final_outfit = {}
        for category, details in outfit_suggestion.items():
            category = int(category)  # Convert key to integer for lookup
            if not details or "item_id" not in details:
                final_outfit[category] = {"item": "None", "image": None, "item_id": None}
                continue

            item_id = details["item_id"]
            matched_item = next(
                (item for item in category_map.get(category, []) if item["item_id"] == item_id),
                None
            )

            if matched_item:
                final_outfit[category] = {
                    "item": matched_item["item_name"],
                    "image": matched_item["image_url"],  # ✅ Ensure correct image path
                    "item_id": matched_item["item_id"]
                }
            else:
                final_outfit[category] = {"item": "None", "image": None, "item_id": None}

        print(f"🔹 Final Corrected Outfit Suggestion: {final_outfit}")

    except Exception as e:
        print(f"❌ Error: {e}")
        return Response({"error": f"LLM request failed: {str(e)}"}, status=500)

    # ✅ Save suggestion in DB
    OutfitSuggestion.objects.create(suggestion=json.dumps(final_outfit))

    return Response({
        "outfit": final_outfit,
        "user_id": user_id,
        "outfit_name": f"{occasion} Outfit"
    })
