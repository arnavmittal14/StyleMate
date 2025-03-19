import React, { useEffect, useState } from "react";
import "./ClosetPage.css";
import NewItemModal from "./NewItemModal";

export default function ClosetPage() {
  const [clothingItems, setClothingItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [error, setError] = useState("");

  // Mapping from category_id to category name
  const categoryMapping = {
    1: "Head Accessory",
    2: "Tops",
    3: "Outerwear",
    4: "Bottoms",
    5: "Footwear"
  };

  // Fetch closet items from the backend using the current user's id stored in localStorage
  const fetchClosetItems = () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }
    fetch(`http://localhost:8000/api/get_closet/?user_id=${userId}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.closet) {
          setClothingItems(data.closet);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Error fetching closet items:", err);
        setError("Error fetching closet items");
      });
  };

  useEffect(() => {
    fetchClosetItems();
  }, []);

  // Called when a new item is added via the modal.
  // Sends item info along with an uploaded photo (if any) to the backend's add_to_closet endpoint.
  const handleAddItem = (newItem) => {
    setError("");
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    // Create FormData for file upload and text fields.
    const formData = new FormData();
    formData.append("item_name", newItem.item_name);
    formData.append("description", newItem.description || "");
    formData.append("category_id", newItem.category_id || "");
    formData.append("color", newItem.color || "");
    formData.append("brand", newItem.brand || "");
    formData.append("user_id", userId);

    // Append the image file (if provided)
    if (newItem.photo) {
      formData.append("photo", newItem.photo);
    } else if (newItem.image_url) {
      formData.append("image_url", newItem.image_url);
    }

    fetch("http://localhost:8000/api/add_to_closet/", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          // On success, re-fetch closet items to update the UI.
          fetchClosetItems();
          setIsModalOpen(false);
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Error adding item to closet:", err);
        setError("Error adding item. Please try again.");
      });
  };

  // Edit and delete functions remain similar
  const handleEditItem = (updatedItem) => {
    const existingItem = clothingItems[itemToEdit];
    const newItem = {
      ...existingItem,
      ...updatedItem
    }

    // Delete item
    handleDeleteItem(itemToEdit);

    // Add it back with the new stuff
    handleAddItem(newItem);
  };

  const handleDeleteItem = (optionalItem = -1) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    const itemForDeletion = optionalItem === -1 ? itemToDelete : optionalItem;

    fetch(`http://localhost:8000/api/delete_from_closet/?user_id=${userId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { Accept: "application/json" },
      body: JSON.stringify(clothingItems[itemForDeletion])
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          fetchClosetItems()
        }
      })
      .catch((err) => {
        console.error("Error fetching closet items:", err);
        setError("Error fetching closet items");
      });

    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (index) => {
    setItemToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (index) => {
    setItemToEdit(index);
    setIsEditModalOpen(true);
  };

  const filteredItems =
    selectedCategory === "All Items"
      ? clothingItems
      : clothingItems.filter(
        (item) => categoryMapping[item.category_id] === selectedCategory
      );

  return (
    <div className="closet-container">
      {/* Filters Section */}

      <div className="closet-content">
        <h2 className="closet-heading">Closet</h2>
      </div>

      <div className="filters-container">
        {["All Items", "Head Accessory", "Tops", "Bottoms", "Outerwear", "Footwear"].map(
          (filter, index) => (
            <button
              key={index}
              className={`filter-button ${filter === selectedCategory ? "filter-button-active" : ""}`}
              onClick={() => setSelectedCategory(filter)}
            >
              {filter}
            </button>
          )
        )}
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
            {/* Display the image using the URL returned from backend's serve endpoint */}
            <img src={item.image_url} alt={item.item_name} className="items-image" />
            <p className="item-name">{item.item_name}</p>
            <div className="action-buttons">
              <button className="edit-button" onClick={() => openEditModal(index)}>
                ✏️
              </button>
              <button className="delete-button" onClick={() => openDeleteModal(index)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Item Modal */}
      {isModalOpen && (
        <NewItemModal
          onClose={() => setIsModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && (
        <NewItemModal
          onClose={() => setIsEditModalOpen(false)}
          onAddItem={handleEditItem}
          initialItem={clothingItems[itemToEdit]}
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
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
