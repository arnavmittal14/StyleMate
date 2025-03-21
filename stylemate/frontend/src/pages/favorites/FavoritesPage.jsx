import React, { useEffect, useState } from "react";
import { api } from "../../api"; // ✅ Axios instance
import FavoriteItem from "./FavoriteItem";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const [favoriteOutfits, setFavoriteOutfits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedOutfits = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setError("User not logged in");
          return;
        }

        const response = await api.get(`/api/get_saved_outfits/?user_id=${userId}`);

        if (response.data.saved_outfits) {
          setFavoriteOutfits(response.data.saved_outfits);
        } else if (response.data.error) {
          setError(response.data.error);
        }
      } catch (err) {
        console.error("Error fetching saved outfits:", err);
        setError("Failed to load saved outfits. Please try again.");
      }
    };

    fetchSavedOutfits();
  }, []);

  return (
    <div className="favorites-container">
      <div className="fav-content">
        <h2 className="fav-heading">Your Favorites</h2>
      </div>

      {error ? (
        <p className="error-message">{error}</p>
      ) : favoriteOutfits.length === 0 ? (
        <div className="no-outfits-container">
          <p className="no-outfits-message">No saved outfits found.</p>
        </div>
      ) : (
        favoriteOutfits.map((outfit) => (
          <FavoriteItem 
            key={outfit.saved_outfit_id}
            name={outfit.outfit_name}
            items={Object.values(outfit.items).filter(item => item !== null)}
          />
        ))
      )}
    </div>
  );
};

export default FavoritesPage;
