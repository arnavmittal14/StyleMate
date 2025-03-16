SELECT 
    os.outfit_id,
    os.outfit_name,
    ha.item_name AS head_accessory_name,
    ha.image_url AS head_accessory_image,
    t.item_name AS top_name,
    t.image_url AS top_image,
    o.item_name AS outerwear_name,
    o.image_url AS outerwear_image,
    b.item_name AS bottom_name,
    b.image_url AS bottom_image,
    f.item_name AS footwear_name,
    f.image_url AS footwear_image
FROM OutfitSets os
LEFT JOIN ClothingItems ha ON os.head_accessory_item_id = ha.item_id
LEFT JOIN ClothingItems t  ON os.top_item_id = t.item_id
LEFT JOIN ClothingItems o  ON os.outerwear_item_id = o.item_id
LEFT JOIN ClothingItems b  ON os.bottom_item_id = b.item_id
LEFT JOIN ClothingItems f  ON os.footwear_item_id = f.item_id;
