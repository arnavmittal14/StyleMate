import { useEffect, useState } from "react";
import "./NewItemModal.css";

export default function NewItemModal({ onClose, onAddItem, initialItem }) {
  const [imageFile, setImageFile] = useState(null); // Store actual file
  const [imagePreview, setImagePreview] = useState(initialItem?.image_url || null);
  const [name, setName] = useState(initialItem?.item_name || "");
  const [categoryId, setCategoryId] = useState(initialItem?.category_id || "2");

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const newItem = {
      ...(imageFile && { photo: imageFile }), // Use actual file object for FormData compatibility
      ...(name && { item_name: name }),
      category_id: categoryId,
    };

    onAddItem(newItem);
    onClose();
  };

  // Populate form when editing an existing item
  useEffect(() => {
    if (initialItem) {
      setImagePreview(initialItem.image_url);
      setName(initialItem.item_name);
      setCategoryId(initialItem.category_id);
    }
  }, [initialItem]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialItem ? "Edit Item" : "Add New Item"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} required={!initialItem} />

          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

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
