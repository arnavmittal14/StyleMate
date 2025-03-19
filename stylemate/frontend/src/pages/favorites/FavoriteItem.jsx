import React from "react";
import "./FavoriteItem2.css";

const FavoriteItem = ({ name, items }) => {
  return (
    <div className="card">
      <h3 className="title">{name}</h3>
      <div className="bar">
        <div className="filledbar"></div>
      </div>
      <div className="item-container">
        {items.map((item, index) => (
          <div key={index} className="item-card">
            {item.image_url ? (
              <img className="item-image" src={item.image_url} alt={item.item_name} />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <div className="item-details">
              <div className="item-name">{item.item_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteItem;
