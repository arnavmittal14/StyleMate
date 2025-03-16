from django.shortcuts import render
import google.generativeai as genai
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import OutfitSuggestion
from closet.models import ClothingItem  # Assuming you store clothes in this model
import base64

# Initialize Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

@api_view(["POST"])
def generate_outfit(request):
    """Processes user input (images & labels) and suggests an outfit."""
    data = request.data
    images = data.get("images", [])  # List of base64-encoded images
    labels = data.get("labels", [])  # List of labels (shirt, pants, etc.)

    if not images or not labels or len(images) != len(labels):
        return Response({"error": "Invalid data"}, status=400)

    # Convert images to base64 if not already
    base64_images = [img if isinstance(img, str) else base64.b64encode(img.read()).decode() for img in images]

    # Prepare Gemini input
    prompt = f"""
    You are a fashion assistant. Given the images of the following clothing items, suggest a stylish outfit:
    {', '.join(labels)}
    """

    # Generate outfit suggestion using Gemini
    response = genai.chat(messages=[{"role": "user", "content": prompt}], images=base64_images)

    outfit_suggestion = response.text if response else "No outfit could be generated."

    # Save the suggestion in the database
    outfit = OutfitSuggestion.objects.create(suggestion=outfit_suggestion)
    return Response({"outfit": outfit_suggestion})
