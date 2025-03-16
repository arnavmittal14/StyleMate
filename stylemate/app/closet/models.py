from django.db import models
from django.conf import settings

class ClothingItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    subcategory_id = models.IntegerField(blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ClothingItems'
        # If using native table, set managed = False
        managed = False

class Closet(models.Model):
    closet_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Closet'
        managed = False  # if you're using native tables
