from django.db import models
from django.conf import settings
from closet.models import ClothingItem  # Assuming ClothingItem is defined in your closet app

class OutfitSet(models.Model):
    outfit_id = models.AutoField(primary_key=True, db_column='outfit_id')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column='user_id'
    )
    outfit_name = models.CharField(max_length=100, db_column='outfit_name')
    head_accessory_item = models.ForeignKey(
        ClothingItem,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column='head_accessory_item_id',
        related_name='outfit_head'
    )
    top_item = models.ForeignKey(
        ClothingItem,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column='top_item_id',
        related_name='outfit_top'
    )
    outerwear_item = models.ForeignKey(
        ClothingItem,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column='outerwear_item_id',
        related_name='outfit_outerwear'
    )
    bottom_item = models.ForeignKey(
        ClothingItem,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column='bottom_item_id',
        related_name='outfit_bottom'
    )
    footwear_item = models.ForeignKey(
        ClothingItem,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column='footwear_item_id',
        related_name='outfit_footwear'
    )
    current_weather = models.CharField(max_length=100, null=True, blank=True, db_column='current_weather')

    class Meta:
        db_table = 'OutfitSets'
        managed = False  # Do not let Django manage (create/alter) the table

    def __str__(self):
        return f"OutfitSet {self.outfit_id} ({self.outfit_name})"

class SavedOutfit(models.Model):
    saved_outfit_id = models.AutoField(primary_key=True, db_column='saved_outfit_id')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column='user_id'
    )
    outfit = models.ForeignKey(
        OutfitSet,
        on_delete=models.CASCADE,
        db_column='outfit_id'
    )

    class Meta:
        db_table = 'SavedOutfits'
        managed = False

    def __str__(self):
        return f"SavedOutfit {self.saved_outfit_id} for User {self.user_id}"
