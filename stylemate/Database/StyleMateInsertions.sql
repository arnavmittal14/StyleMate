-- Sample Insertions

-- 1. Insert sample Users
INSERT INTO Users (username, email, password_hash, gender)
VALUES 
('guest', 'guest@gmail.com', 'hashedpassword1','non-binary'),
('bob', 'bob@example.com', 'hashedpassword2','male');

-- 2. Insert sample ClothingItems (using existing Subcategory IDs from your earlier inserts)
-- Head Accessories (Subcategories: Hat (1), Sunglasses (2))
INSERT INTO ClothingItems (item_name, description, subcategory_id, color, brand, image_url)
VALUES 
('Trendy Hat', 'A stylish blue hat for sunny days.', 1, 'Blue', 'HatCo', 'https://example.com/images/trendy_hat.jpg'),
('Cool Shades', 'Sleek sunglasses for a modern look.', 2, 'Black', 'ShadeMakers', 'https://example.com/images/cool_shades.jpg');

-- Tops (Subcategories: Shirts (3), Jersey (4))
INSERT INTO ClothingItems (item_name, description, subcategory_id, color, brand, image_url)
VALUES 
('Classic White Shirt', 'A crisp white shirt suitable for formal events.', 3, 'White', 'ShirtMasters', 'https://example.com/images/white_shirt.jpg'),
('Sporty Jersey', 'A comfortable jersey ideal for casual outings.', 4, 'Red', 'SportWear', 'https://example.com/images/sporty_jersey.jpg');

-- Outerwear (Subcategories: Jackets (5), Hoodies (6))
INSERT INTO ClothingItems (item_name, description, subcategory_id, color, brand, image_url)
VALUES 
('Leather Jacket', 'A rugged leather jacket for a bold look.', 5, 'Black', 'LeatherWorks', 'https://example.com/images/leather_jacket.jpg'),
('Cozy Hoodie', 'A soft hoodie perfect for cooler days.', 6, 'Grey', 'HoodieHub', 'https://example.com/images/cozy_hoodie.jpg');

-- Bottoms (Subcategories: Pants (7), Shorts (8), Skirts (9), Dress (10))
INSERT INTO ClothingItems (item_name, description, subcategory_id, color, brand, image_url)
VALUES 
('Slim Fit Pants', 'Modern slim fit pants for everyday wear.', 7, 'Navy', 'PantsPro', 'https://example.com/images/slim_fit_pants.jpg'),
('Casual Shorts', 'Comfortable shorts for a relaxed style.', 8, 'Khaki', 'ShortsCo', 'https://example.com/images/casual_shorts.jpg');

-- Footwear (Subcategories: Shoes (11), Sandals (12), Heels (13))
INSERT INTO ClothingItems (item_name, description, subcategory_id, color, brand, image_url)
VALUES 
('Running Shoes', 'Lightweight running shoes with excellent grip.', 11, 'White', 'RunFast', 'https://example.com/images/running_shoes.jpg'),
('Beach Sandals', 'Perfect sandals for a day at the beach.', 12, 'Blue', 'SandalStyle', 'https://example.com/images/beach_sandals.jpg');

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

-- Creating an outfit set for Bob using his items:
INSERT INTO OutfitSets (user_id, outfit_name, head_accessory_item_id, top_item_id, outerwear_item_id, bottom_item_id, footwear_item_id, current_weather)
VALUES 
(2, 'Laid-back Look', 2, 4, 6, 8, 10, 'Snowy');

-- 5. Insert sample SavedOutfits
-- Alice saves Bob's outfit, and Bob saves Alice's outfit:
INSERT INTO SavedOutfits (user_id, outfit_id)
VALUES 
(1, 2),  -- Alice saves Bob's "Laid-back Look"
(2, 1);  -- Bob saves Alice's "Casual Cool"

