import { useState, useEffect } from "react";
import "./NewItemModal.css";

export default function NewItemModal({ onClose, onAddItem, initialItem }) {
  const [image, setImage] = useState(initialItem?.image || null);
  const [name, setName] = useState(initialItem?.name || "");
  const [categoryId, setCategoryId] = useState(initialItem?.category_id || "2");

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!image || !name.trim()) {
      alert("Please upload an image and enter a name.");
      return;
    }

    const newItem = { image, item_name: name, category_id: categoryId };
    onAddItem(newItem);
    onClose();
  };

  // If editing, update the state based on the initialItem prop
  useEffect(() => {
    if (initialItem) {
      setImage(initialItem.image);
      setName(initialItem.name);
      setCategoryId(initialItem.categoryId);
    }
  }, [initialItem]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialItem ? "Edit Item" : "Add New Item"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {image && <img src={image} alt="Preview" className="image-preview" />}

          <label>Item Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Category:</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="1">Head Accessory</option>
            <option value="2">Tops</option>
            <option value="3">Outerwear</option>
            <option value="4">Bottoms</option>
            <option value="5">Footwear</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="add-item-button">
              {initialItem ? "Save Changes" : "Add Item"}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
