DROP DATABASE IF EXISTS stylemate_database;
CREATE DATABASE stylemate_database;
USE stylemate_database;

-- Categories Table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

-- Subcategories Table
CREATE TABLE Subcategories (
    subcategory_id INT AUTO_INCREMENT PRIMARY KEY,
    subcategory_name VARCHAR(50) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
);

-- Clothing Items Table
CREATE TABLE ClothingItems (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    subcategory_id INT,
    color VARCHAR(50),
    brand VARCHAR(100),
    image_url VARCHAR(255),  -- Image link for clothing item
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subcategory_id) REFERENCES Subcategories(subcategory_id) ON DELETE SET NULL
);

-- Users Table (For Closet)
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_photo_url VARCHAR(255),
    gender ENUM('male', 'female', 'non-binary', 'other') NOT NULL,
    gender_other VARCHAR(50) DEFAULT NULL,
    last_login DATETIME NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    is_staff TINYINT(1) NOT NULL DEFAULT 0,
    is_superuser TINYINT(1) NOT NULL DEFAULT 0
);

-- Closet (Individual Items Owned by Users)
CREATE TABLE Closet (
    closet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES ClothingItems(item_id) ON DELETE CASCADE
);

-- Outfit Sets (Collection of 5 Items - Head Accessory, Shirt, Outerwear, Pants, Shoes)
CREATE TABLE OutfitSets (
-- add occasion and weather 
    outfit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    outfit_name VARCHAR(100) NOT NULL,
	head_accessory_item_id INT,
    top_item_id INT,
    outerwear_item_id INT,
    bottom_item_id INT,
    footwear_item_id INT,
    current_weather VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (head_accessory_item_id) REFERENCES ClothingItems(item_id) ON DELETE SET NULL,
    FOREIGN KEY (top_item_id) REFERENCES ClothingItems(item_id) ON DELETE SET NULL,
    FOREIGN KEY (outerwear_item_id) REFERENCES ClothingItems(item_id) ON DELETE SET NULL,
    FOREIGN KEY (bottom_item_id) REFERENCES ClothingItems(item_id) ON DELETE SET NULL,
    FOREIGN KEY (footwear_item_id) REFERENCES ClothingItems(item_id) ON DELETE SET NULL
);

CREATE TABLE SavedOutfits (
	saved_outfit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    outfit_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (outfit_id) REFERENCES OutfitSets(outfit_id) ON DELETE CASCADE
);


INSERT INTO Categories (category_name) VALUES 
('Head Accessory'), 
('Top'), 
('Jacket/Outerwear'), 
('Bottoms'), 
('Footwear');

INSERT INTO Subcategories (subcategory_name, category_id) VALUES
('Hat', 1), 
('Sunglasses', 1),
('Shirts', 2), 
('Jersey', 2),
('Jackets', 3), 
('Hoodies', 3),
('Pants', 4), 
('Shorts', 4), 
('Skirts', 4),
('Dress', 4), -- need gemini to detect dresses and reccommend bottoms accordingly
('Shoes', 5), 
('Sandals', 5), 
('Heels', 5);

