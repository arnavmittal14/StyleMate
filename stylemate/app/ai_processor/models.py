from django.db import models

class OutfitSuggestion(models.Model):
    suggestion = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.suggestion[:50]  # Show a preview
