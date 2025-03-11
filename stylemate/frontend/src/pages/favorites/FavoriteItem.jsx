import React from "react";
import "./FavoriteItem.css";  

export default function FavoriteItem({ image, name, occasion, temperature }) {
  return (
    <div className="favorite-item">
      <div className="image-container">
        <img src={image} alt={name} className="outfit-image" />
        <button className="heart-button">❤️</button>
      </div>
      <div className="item-details">
        <h3 className="item-name">{name}</h3>
        <p className="item-occasion">Perfect for: {occasion}</p>
        <div className="item-footer">
          <span className="temperature">🌡 {temperature}</span>
          <button className="share-button">🔗</button>
        </div>
      </div>
    </div>
  );
}