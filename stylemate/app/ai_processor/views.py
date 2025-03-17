from django.shortcuts import render
import google.generativeai as genai
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import OutfitSuggestion
from closet.models import Closet, ClothingItem, Subcategories  # Ensure correct DB reference
import base64
from collections import defaultdict

# Initialize Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

@api_view(["POST"])
def generate_outfit(request):
    print(request.data)
    """
    Suggests an outfit based on the occasion:
    - If user is authenticated, retrieve clothing from the database (Closet table).
    - If user is a guest, require temporary clothing upload (not stored).
    - Groups clothing items by category before returning the response.
    """
    user = request.user if request.user.is_authenticated else None
    data = request.data
    occasion = data.get("occasion", "").strip()
    guest_clothing = data.get("guest_clothing", [])

    if not occasion:
        return Response({"error": "Please provide an occasion to generate an outfit."}, status=400)

    clothing_items = []

    if user:
        # Authenticated user: Fetch clothing from database
        user_closet_items = Closet.objects.filter(user_id=user.id).select_related("item")

        if user_closet_items.exists():
            clothing_items = [
                {
                    "name": item.item.item_name,
                    "category": item.item.category_id if item.item.subcategory else "Unknown",
                    "color": item.item.color or "Unknown",
                    "brand": item.item.brand or "Unknown",
                    "image_url": item.item.image_url,
                }
                for item in user_closet_items
            ]
        else:
            return Response({"error": "No clothing items found in your closet."}, status=400)
    
    else:
        # Guest user: Use uploaded images instead (temporary storage)
        if not guest_clothing:
            return Response({"error": "Guests must upload clothing images."}, status=400)

        clothing_items = [
            {
                "name": f"Guest Item {i+1}",
                "category": item.get("category", "Unknown"),
                "color": item.get("color", "Unknown"),
                "brand": item.get("brand", "Unknown"),
                "image_url": item.get("image_data", ""),  # Guest uploads base64 images
            }
            for i, item in enumerate(guest_clothing)
        ]

    # Group clothing items by category
    grouped_clothing = defaultdict(list)
    for item in clothing_items:
        grouped_clothing[item["category"]].append(item["image_url"])

    # Prepare LLM input
    clothing_description = "\n".join(
        [
            f"{clothing['name']} ({clothing['color']} {clothing['category']} by {clothing['brand']})"
            for clothing in clothing_items
        ]
    )

    prompt = f"""
    You are a fashion assistant. The user has the following clothing items:
    {clothing_description}

    The user wants an outfit for the following occasion: {occasion}.

    Based on the available clothes, suggest a stylish and appropriate outfit.
    """

    # Generate outfit suggestion using Gemini
    response = genai.chat(messages=[{"role": "user", "content": prompt}])

    outfit_suggestion = response.text if response else "No outfit could be generated."

    # Save suggestion only if the user is authenticated
    if user:
        OutfitSuggestion.objects.create(suggestion=outfit_suggestion)

    return Response({
        "outfit": outfit_suggestion,
        "clothing_images_by_category": grouped_clothing
    })
