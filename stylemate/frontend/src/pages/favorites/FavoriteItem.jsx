import React from "react";
import "./FavoriteItem.css";  

export default function FavoriteItem({ image, name, label }) {
  return (
    <div className="favorite-item">
      <div className="image-container">
        <img src={image} alt={name} className="outfit-image" />
        <button className="heart-button">❤️</button>
      </div>
      <div className="item-details">
        <h3 className="item-name">{name}</h3>
        <div className="item-footer">
        </div>
      </div>
    </div>
  );
}