import { useState } from "react";
import "./NewItemModal.css";

export default function NewItemModal({ onClose, onAddItem }) {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Tops");

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

    onAddItem({ image, name, category });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />

          {image && <img src={image} alt="Preview" className="image-preview" />}

          <label>Item Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Footwear">Footwear</option>
            <option value="Outerwear">Outerwear</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="add-item-button">Add Item</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
