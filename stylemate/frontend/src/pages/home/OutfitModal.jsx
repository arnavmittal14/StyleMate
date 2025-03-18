import React from "react";
import "./OutfitModal.css";

const OutfitModal = ({ isOpen, onClose, occasion, loading, outfit }) => {
  if (!isOpen) return null; // Prevent rendering if modal is closed

  const saveToFavorites = async () => {
    if (!outfit) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    // Prepare the payload for saving outfit
    const outfitData = {
      user_id: userId,
      outfit_name: `${occasion} Outfit`, // Dynamic name
      head_accessory_item_id: outfit.outfit[1]?.item_id || null,
      top_item_id: outfit.outfit[2]?.item_id || null,
      outerwear_item_id: outfit.outfit[3]?.item_id || null,
      bottom_item_id: outfit.outfit[4]?.item_id || null,
      footwear_item_id: outfit.outfit[5]?.item_id || null,
      current_weather: "Unknown", // Modify as needed
    };

    try {
      const response = await fetch("http://localhost:8000/api/add_saved_outfit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outfitData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Outfit saved to favorites!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to save outfit:", error);
      alert("Failed to save outfit. Try again.");
    }
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
                <th>Image</th>
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
