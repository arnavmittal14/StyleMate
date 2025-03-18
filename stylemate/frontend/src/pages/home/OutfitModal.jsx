import React from "react";
import "./OutfitModal.css";

const OutfitModal = ({ isOpen, onClose, occasion, loading, outfit }) => {
  if (!isOpen) return null; // Prevent rendering if modal is closed

  const saveToFavorites = () => {
    if (!outfit) return;

    const savedOutfits = JSON.parse(localStorage.getItem("favorites")) || [];
    const newOutfit = { occasion, ...outfit };
    localStorage.setItem("favorites", JSON.stringify([...savedOutfits, newOutfit]));

    alert("Outfit saved to favorites!");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Here is your recommended outfit for {occasion}:</h3>

        {loading ? (
          <p>Loading outfit recommendations...</p>
        ) : outfit ? (
          <table className="outfit-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Item</th>
              </tr>
            </thead>
            <tbody>
            {Object.entries(outfit.outfit).map(([category, details]) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{details.item || "None"}</td>
                <td>
                  {details.image ? (
                    <img
                      src={details.image}
                      alt={details.item}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        ) : (
          <p>Failed to load outfit. Please try again.</p>
        )}

        <div className="modal-buttons">
          <button className="save-button" onClick={saveToFavorites} disabled={!outfit}>
            Save to Favorites
          </button>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default OutfitModal;
