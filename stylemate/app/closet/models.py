from django.conf import settings
from django.db import models


class ClothingItem(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category_id = models.IntegerField(blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.CharField(
        max_length=500, blank=True, null=True)  # Store file path
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ClothingItems'
        # If using native table, set managed = False
        managed = True


class Closet(models.Model):
    closet_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Closet'
        managed = True  # if you're using native tables


class Subcategories(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'Categories'
