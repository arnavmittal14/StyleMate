import React, { useEffect, useState } from "react";
import FavoriteItem from "./FavoriteItem";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const [favoriteOutfits, setFavoriteOutfits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedOutfits = async () => {
      try {
        const userId = localStorage.getItem("user_id"); // Get logged-in user's ID
        const response = await fetch(`http://localhost:8000/api/get_saved_outfits/?user_id=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch saved outfits");
        }

        const data = await response.json();
        setFavoriteOutfits(data.saved_outfits);
      } catch (err) {
        console.error("Error fetching saved outfits:", err);
        setError("Failed to load saved outfits. Please try again.");
      }
    };

    fetchSavedOutfits();
  }, []);

  return (
    <div className="favorites-container">
      <h2>Saved Outfits</h2>

      {error ? (
        <p className="error-message">{error}</p>
      ) : favoriteOutfits.length === 0 ? (
        <p className="no-outfits-message">No saved outfits found.</p>
      ) : (
        favoriteOutfits.map((outfit) => (
          <FavoriteItem 
            key={outfit.saved_outfit_id}
            name={outfit.outfit_name}
            items={Object.values(outfit.items).filter(item => item !== null)} // Filter out null items
          />
        ))
      )}
    </div>
  );
};

export default FavoritesPage;
