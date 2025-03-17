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
                    "category": item.item.category_id or "Unknown",
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

        prompt = f"""
        You are a fashion assistant. The user has the following clothing items:
        {clothing_description}

        The user wants an outfit for the following occasion: {occasion}.

        Based on the available clothes, suggest a stylish and appropriate outfit.
        """

        print("🔹 Sending Prompt to LLM...")
        
        # Generate outfit suggestion using Gemini
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")  # ✅ Correct model instance
            response = model.generate_content(prompt)  # ✅ Correct API call

            outfit_suggestion = response.text if response else "No outfit could be generated."
        except Exception as e:
            print(f"❌ LLM Error: {e}")
            return Response({"error": f"LLM request failed: {str(e)}"}, status=500)

        print(f"🔹 Outfit Suggestion from LLM: {outfit_suggestion}")

        # Save suggestion in DB
        OutfitSuggestion.objects.create(suggestion=outfit_suggestion)

        return Response({
            "outfit": outfit_suggestion,
            "clothing_images_by_category": grouped_clothing
        })

    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return Response({"error": f"Unexpected error: {str(e)}"}, status=500)
