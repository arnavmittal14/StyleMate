import React, { useEffect, useState } from "react";
import { api } from "../../api"; 
import "./ClosetPage.css";
import NewItemModal from "./NewItemModal";

export default function ClosetPage() {
  const [clothingItems, setClothingItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [error, setError] = useState("");

  const categoryMapping = {
    1: "Head Accessory",
    2: "Tops",
    3: "Outerwear",
    4: "Bottoms",
    5: "Footwear",
  };

  const fetchClosetItems = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    try {
      const res = await api.get(`/api/get_closet/?user_id=${userId}`);
      if (res.data.closet) {
        setClothingItems(res.data.closet);
      } else if (res.data.error) {
        setError(res.data.error);
      }
    } catch (err) {
      console.error("Error fetching closet items:", err);
      setError("Error fetching closet items");
    }
  };

  useEffect(() => {
    fetchClosetItems();
  }, []);

  const handleAddItem = async (newItem) => {
    setError("");
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("item_name", newItem.item_name);
    formData.append("description", newItem.description || "");
    formData.append("category_id", newItem.category_id || "");
    formData.append("color", newItem.color || "");
    formData.append("brand", newItem.brand || "");
    formData.append("user_id", userId);

    if (newItem.photo) {
      formData.append("photo", newItem.photo);
    } else if (newItem.image_url) {
      formData.append("image_url", newItem.image_url);
    }

    try {
      const res = await api.post("/api/add_to_closet/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.message) {
        fetchClosetItems();
        setIsModalOpen(false);
      } else if (res.data.error) {
        setError(res.data.error);
      }
    } catch (err) {
      console.error("Error adding item to closet:", err);
      setError("Error adding item. Please try again.");
    }
  };

  const handleDeleteItem = async (optionalItem = -1) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    const itemForDeletion = optionalItem === -1 ? itemToDelete : optionalItem;

    try {
      const res = await api.delete(`/api/delete_from_closet/?user_id=${userId}`, {
        data: JSON.stringify(clothingItems[itemForDeletion]),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.message) {
        fetchClosetItems();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Error deleting item");
    }

    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (index) => {
    setItemToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const filteredItems =
    selectedCategory === "All Items"
      ? clothingItems
      : clothingItems.filter(
          (item) => categoryMapping[item.category_id] === selectedCategory
        );

  return (
    <div className="closet-container">
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

      <div className="add-button-container">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          + Add New Item
        </button>
      </div>

      <div className="closet-grid">
        {filteredItems.map((item, index) => (
          <div key={index} className="closet-item">
            <img src={item.image_url} alt={item.item_name} className="items-image" />
            <p className="item-name">{item.item_name}</p>
            <div className="action-buttons">
              <button className="delete-button" onClick={() => openDeleteModal(index)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <NewItemModal
          onClose={() => setIsModalOpen(false)}
          onAddItem={handleAddItem}
        />
      )}

      {isDeleteModalOpen && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <p>Are you sure you want to delete this item?</p>
            <button onClick={() => handleDeleteItem()}>Yes</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
