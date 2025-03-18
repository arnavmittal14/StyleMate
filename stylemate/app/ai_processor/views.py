from django.shortcuts import render
import google.generativeai as genai
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from .models import OutfitSuggestion
from closet.models import Closet, ClothingItem
import json
from collections import defaultdict
import re

User = get_user_model()  # Dynamically fetch User model


# Initialize Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

@api_view(["POST"])
def generate_outfit(request):
    print("🔹 Incoming Request Data:", request.data)

    data = request.data
    occasion = data.get("occasion", "").strip()
    user_id = data.get("user_id")  # User ID from request

    if not occasion:
        print("❌ Error: Occasion is missing")
        return Response({"error": "Please provide an occasion to generate an outfit."}, status=400)

    if not user_id:
        print("❌ Error: User ID is missing")
        return Response({"error": "User ID is required."}, status=400)

    # Fetch user from DB
    try:
        user = User.objects.get(user_id=user_id)
        print(f"🔹 Found User: {user.email}")
    except User.DoesNotExist:
        print("❌ Error: User not found")
        return Response({"error": "User not found."}, status=404)

    # Retrieve user's clothing items from closet
    clothing_items = []
    try:
        user_closet_items = Closet.objects.filter(user_id=user.user_id).select_related("item")
        print(f"🔹 Closet Items Found: {user_closet_items.count()}")

        if user_closet_items.exists():
            clothing_items = [
                {
                    "name": item.item.item_name,
                    "category": str(item.item.category_id) or "Unknown",  # Ensure category is a string
                    "color": item.item.color or "Unknown",
                    "brand": item.item.brand or "Unknown",
                    "image_url": item.item.image_url,
                }
                for item in user_closet_items
            ]
        else:
            print("❌ No clothing items found in closet.")
            return Response({"error": "No clothing items found in your closet."}, status=400)

        # Group clothing items by category
        grouped_clothing = defaultdict(list)
        for item in clothing_items:
            grouped_clothing[item["category"]].append(item["image_url"])

        print(f"🔹 Grouped Clothing Items: {json.dumps(grouped_clothing, indent=2)}")

        # Prepare structured input for LLM
        clothing_description = "\n".join(
            [
                f"{clothing['name']} ({clothing['color']} {clothing['category']} by {clothing['brand']})"
                for clothing in clothing_items
            ]
        )

        print(f"🔹 Clothing Description for LLM:\n{clothing_description}")

        valid_images = {
            "Head Accessory": grouped_clothing.get("Head Accessory", [None])[0],
            "Top": grouped_clothing.get("Top", [None])[0],
            "Outerwear": grouped_clothing.get("Outerwear", [None])[0],
            "Bottom": grouped_clothing.get("Bottom", [None])[0],
            "Footwear": grouped_clothing.get("Footwear", [None])[0],
        }

        

        prompt = f"""
        You are a fashion assistant. The user has the following clothing items:
        {clothing_description}

        The user wants an outfit for the following occasion: {occasion}.

        Select an outfit based on the available clothing. You **must use** the following image paths:

        - Head Accessory: {valid_images['Head Accessory']}
        - Top: {valid_images['Top']}
        - Outerwear: {valid_images['Outerwear']}
        - Bottom: {valid_images['Bottom']}
        - Footwear: {valid_images['Footwear']}

        If no suitable item exists for a category, return `"None"` as the item and `null` for the image.

        The JSON format should be:
        {{
            "Head Accessory": {{"item": "Hat", "image": "{valid_images['Head Accessory']}"}},
            "Top": {{"item": "Black Tee", "image": "{valid_images['Top']}"}},
            "Outerwear": {{"item": "None", "image": null}},
            "Bottom": {{"item": "Jeans", "image": "{valid_images['Bottom']}"}},
            "Footwear": {{"item": "Airforces", "image": "{valid_images['Footwear']}"}}
        }}
        """


        print("🔹 Sending Prompt to LLM...")
        
        # Generate outfit suggestion using Gemini
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt)
            
            print(f"🔹 Raw Response from LLM: {response.text}")

            # Clean up the response to remove unwanted text (like 'json' at the start)
            # cleaned_response = re.sub(r"^json\s*", "", response.text).strip()
            cleaned_response = re.sub(r"```(json)?", "", response.text).strip()

            # Now parse the cleaned response
            # outfit_suggestion = json.loads(cleaned_response)

            # Check if the response is empty or just whitespace
            if not cleaned_response.strip():
                print("❌ Error: LLM response is empty")
                return Response({"error": "LLM returned an empty response."}, status=500)

            try:
                # Now parse the cleaned response
                outfit_suggestion = json.loads(cleaned_response)
            except json.JSONDecodeError as e:
                print(f"❌ Error: Failed to parse LLM response as JSON: {e}")
                return Response({"error": "Invalid response format from LLM"}, status=500)
            
            # Ensure all suggested items have properly formatted image URLs
            for category, details in outfit_suggestion.items():
                if details["image"]:  # If an image exists, ensure it's correctly formatted
                    outfit_suggestion[category]["image"] = f"/media/closet/{details['image'].split('/')[-1]}"

            print(f"🔹 Final Corrected Outfit Suggestion: {outfit_suggestion}")
            

        except json.JSONDecodeError as e:
            print(f"❌ Error: Failed to parse LLM response as JSON: {e}")
            return Response({"error": "Invalid response format from LLM"}, status=500)

        print(f"🔹 Outfit Suggestion from LLM: {outfit_suggestion}")

        # Save suggestion in DB
        OutfitSuggestion.objects.create(suggestion=outfit_suggestion)

        return Response({
            "outfit": outfit_suggestion,  # Structured JSON with item names & images
            "clothing_images_by_category": grouped_clothing  # Keep grouped images
        })

    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return Response({"error": f"Unexpected error: {str(e)}"}, status=500)
