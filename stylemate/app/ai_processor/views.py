from django.shortcuts import render
import google.generativeai as genai
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
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
def generate_outfit(request):
    print("🔹 Incoming Request Data:", request.data)

    data = request.data
    occasion = data.get("occasion", "").strip()
    user_id = data.get("user_id")

    if not occasion:
        return Response({"error": "Please provide an occasion."}, status=400)
    if not user_id:
        return Response({"error": "User ID is required."}, status=400)

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

    category_map = defaultdict(list)
    for entry in user_closet_items:
        clothing_item = entry.item
        category_map[str(clothing_item.category_id)].append({
            "item_id": clothing_item.item_id,
            "item_name": clothing_item.item_name,
            "image_url": request.build_absolute_uri(clothing_item.image_url) if clothing_item.image_url else None,  # ✅ Use absolute URI
        })

    print(f"🔹 Grouped Clothing Items by Category: {json.dumps(category_map, indent=2)}")

    # Prepare input for LLM
    clothing_description = "\n".join(
        [f"{entry.item.item_name} ({entry.item.color} Category {entry.item.category_id} by {entry.item.brand})"
         for entry in user_closet_items]
    )

    print(f"🔹 Clothing Description for LLM:\n{clothing_description}")

    prompt = f"""
    You are a fashion assistant. The user has the following clothing items:
    {clothing_description}

    The user wants an outfit for the following occasion: {occasion}.

    Return ONLY JSON with the format:
    ```json
    {{
        "Head Accessory": {{"item": "Hat"}},
        "Top": {{"item": "Black Tee"}},
        "Outerwear": {{"item": "Leather Jacket"}},
        "Bottom": {{"item": "Jeans"}},
        "Footwear": {{"item": "Airforces"}}
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

        # ✅ Find Matching Clothing Items in Closet
        final_outfit = {}
        for category, details in outfit_suggestion.items():
            if details is None:
                final_outfit[category] = {"item": "None", "image": None, "item_id": None}
                continue

            item_name = details.get("item", "None")
            matched_item = next((entry.item for entry in user_closet_items if entry.item.item_name.lower() == item_name.lower()), None)

            if matched_item:
                final_outfit[category] = {
                    "item": matched_item.item_name,
                    "image": request.build_absolute_uri(matched_item.image_url) if matched_item.image_url else None,  # ✅ Ensure correct absolute URI
                    "item_id": matched_item.item_id
                }
            else:
                final_outfit[category] = {"item": "None", "image": None, "item_id": None}

        print(f"🔹 Final Corrected Outfit Suggestion: {final_outfit}")

    except Exception as e:
        return Response({"error": f"LLM request failed: {str(e)}"}, status=500)

    # ✅ Save suggestion in DB
    OutfitSuggestion.objects.create(suggestion=json.dumps(final_outfit))

    return Response({
        "outfit": final_outfit,
        "user_id": user_id,
        "outfit_name": f"Generated Outfit ({occasion})"
    })
