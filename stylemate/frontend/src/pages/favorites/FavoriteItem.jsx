// FavoriteItem.jsx
import React from 'react';
import './FavoriteItem2.css'; // Make sure to add styling for individual items


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
            <img className="item-image" src={item.image} alt={item.name} />
            <div className="item-details">
              {/* <div className="item-name">{item.name}</div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteItem;
