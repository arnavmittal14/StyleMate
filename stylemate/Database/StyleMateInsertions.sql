-- Sample Insertions

-- 2. Insert sample ClothingItems (using existing Subcategory IDs from your earlier inserts)
-- Head Accessories (Subcategories: Hat (1), Sunglasses (2))
INSERT INTO ClothingItems (item_name, description, category_id, color, brand)
VALUES 
('Trendy Hat', 'A stylish blue hat for sunny days.', 1, 'Blue', 'HatCo'),
('Cool Shades', 'Sleek sunglasses for a modern look.', 1, 'Black', 'ShadeMakers');

-- Tops (Subcategories: Shirts (3), Jersey (4))
INSERT INTO ClothingItems (item_name, description, category_id, color, brand)
VALUES 
('Classic White Shirt', 'A crisp white shirt suitable for formal events.', 2, 'White', 'ShirtMasters'),
('Sporty Jersey', 'A comfortable jersey ideal for casual outings.', 2, 'Red', 'SportWear');

-- Outerwear (Subcategories: Jackets (5), Hoodies (6))
INSERT INTO ClothingItems (item_name, description, category_id, color, brand)
VALUES 
('Leather Jacket', 'A rugged leather jacket for a bold look.', 3, 'Black', 'LeatherWorks'),
('Cozy Hoodie', 'A soft hoodie perfect for cooler days.', 3, 'Grey', 'HoodieHub');

-- Bottoms (Subcategories: Pants (7), Shorts (8), Skirts (9), Dress (10))
INSERT INTO ClothingItems (item_name, description, category_id, color, brand)
VALUES 
('Slim Fit Pants', 'Modern slim fit pants for everyday wear.', 4, 'Navy', 'PantsPro'),
('Casual Shorts', 'Comfortable shorts for a relaxed style.', 4, 'Khaki', 'ShortsCo');

-- Footwear (Subcategories: Shoes (11), Sandals (12), Heels (13))
INSERT INTO ClothingItems (item_name, description, category_id, color, brand)
VALUES 
('Running Shoes', 'Lightweight running shoes with excellent grip.', 5, 'White', 'RunFast'),
('Beach Sandals', 'Perfect sandals for a day at the beach.', 5, 'Blue', 'SandalStyle');

-- 3. Insert sample Closet entries (linking users to items they own)
-- Assuming Alice owns a few items and Bob owns some others.
INSERT INTO Closet (user_id, item_id)
VALUES 
(1, 1),  -- Alice owns 'Trendy Hat'
(1, 3),  -- Alice owns 'Classic White Shirt'
(1, 5),  -- Alice owns 'Leather Jacket'
(1, 7),  -- Alice owns 'Slim Fit Pants'
(1, 9),  -- Alice owns 'Running Shoes'
(2, 2),  -- Bob owns 'Cool Shades'
(2, 4),  -- Bob owns 'Sporty Jersey'
(2, 6),  -- Bob owns 'Cozy Hoodie'
(2, 8),  -- Bob owns 'Casual Shorts'
(2, 10); -- Bob owns 'Beach Sandals'

-- 4. Insert sample OutfitSets
-- Creating an outfit set for Alice using her items:
INSERT INTO OutfitSets (user_id, outfit_name, head_accessory_item_id, top_item_id, outerwear_item_id, bottom_item_id, footwear_item_id, current_weather)
VALUES 
(1, 'Casual Cool', 1, 3, 5, 7, 9, 'Sunny');

-- Creating an outfit set for Bob using his item

