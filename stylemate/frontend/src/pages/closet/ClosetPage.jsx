import { useState } from "react";
import "./ClosetPage.css";
import NewItemModal from "./NewItemModal";

export default function ClosetPage() {
  const allClothingItems = [
    { image: "/defaultcloset/whitetee.png", name: "White Tee", category: "Tops" },
    { image: "/defaultcloset/blacktee.png", name: "Black Tee", category: "Tops" },
    { image: "/defaultcloset/bluejeans.png", name: "Blue Jeans", category: "Bottoms" },
    { image: "/defaultcloset/blackjeans.png", name: "Black Jeans", category: "Bottoms" },
    { image: "/defaultcloset/greyhoodie.png", name: "Grey Hoodie", category: "Outerwear" },
    { image: "/defaultcloset/whitesneakers.png", name: "White Sneakers", category: "Footwear" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [clothingItems, setClothingItems] = useState(allClothingItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null); // State for the item to edit

  // Add new item to the closet
  const handleAddItem = (newItem) => {
    setClothingItems([...clothingItems, newItem]);
  };

  // Edit an existing item
  const handleEditItem = (updatedItem) => {
    const updatedItems = clothingItems.map((item, index) =>
      index === itemToEdit ? updatedItem : item
    );
    setClothingItems(updatedItems);
    setIsEditModalOpen(false);
  };

  // Remove an item from the closet
  const handleDeleteItem = () => {
    const updatedItems = clothingItems.filter((_, i) => i !== itemToDelete);
    setClothingItems(updatedItems);
    setIsDeleteModalOpen(false); // Close the modal after deletion
  };

  // Open the delete confirmation modal
  const openDeleteModal = (index) => {
    setItemToDelete(index);
    setIsDeleteModalOpen(true);
  };

  // Open the edit modal
  const openEditModal = (index) => {
    setItemToEdit(index);
    setIsEditModalOpen(true);
  };

  // Filter clothing items based on the selected category
  const filteredItems =
    selectedCategory === "All Items"
      ? clothingItems
      : clothingItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="closet-container">
      {/* Filters Section */}
      <div className="filters-container">
        {["All Items", "Tops", "Bottoms", "Footwear", "Outerwear"].map((filter, index) => (
          <button
            key={index}
            className={`filter-button ${filter === selectedCategory ? "filter-button-active" : ""}`}
            onClick={() => setSelectedCategory(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Add New Item Button */}
      <div className="add-button-container">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          + Add New Item
        </button>
      </div>

      {/* Closet Items Grid */}
      <div className="closet-grid">
        {filteredItems.map((item, index) => (
          <div key={index} className="closet-item">
            <img src={item.image} alt={item.name} className="items-image" />
            <p className="item-name">{item.name}</p>
            <div className="action-buttons">
              <button
                className="edit-button"
                onClick={() => openEditModal(index)}
              >
                ✏️
              </button>
              <button
                className="delete-button"
                onClick={() => openDeleteModal(index)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Item Modal */}
      {isModalOpen && <NewItemModal onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />}

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <NewItemModal
          onClose={() => setIsEditModalOpen(false)}
          onAddItem={handleEditItem} // Use handleEditItem to update
          initialItem={clothingItems[itemToEdit]} // Pass the initial item to the modal
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>Are you sure you want to delete this item?</p>
            <button onClick={handleDeleteItem}>Yes</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
