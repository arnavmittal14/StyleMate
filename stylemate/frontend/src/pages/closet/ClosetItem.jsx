import React from 'react';
import './ClosetItem.css';

export default function ClosetItem({ image, name, category, season }) {
  return (
    <div className="closet-item">
      <div className="image-container">
        <img src={image} alt={name} className="item-image" />
        <button className="favorite-button">
          💜
        </button>
      </div>
      <div className="item-details">
        <h3 className="item-name">{name}</h3>
        <p className="item-meta">{category} • {season}</p>
      </div>
    </div>
  );
}