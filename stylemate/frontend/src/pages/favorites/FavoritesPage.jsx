// FavoritesPage.jsx
import React from 'react';
import FavoriteItem from './FavoriteItem';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const favoriteOutfits = [
    {
      id: 1,
      name: "Casual Weekend Look",
      items: [
        { image: "/defaultcloset/greyhoodie.png", name: "T-shirt", occasion: "Brunch", temperature: "15-20°C" },
        { image: "/defaultcloset/blackjeans.png", name: "Jeans", occasion: "Brunch", temperature: "15-20°C" },
        { image: "/defaultcloset/whitesneakers.png", name: "Sneakers", occasion: "Brunch", temperature: "15-20°C" },
        { image: "greyhoodie.png", name: "Sunglasses", occasion: "Brunch", temperature: "15-20°C" },
      ],
    },
    {
      id: 2,
      name: "Evening Elegance",
      items: [
        { image: "/evening-1.jpg", name: "Dress", occasion: "Dinner Date", temperature: "18-22°C" },
        { image: "/evening-2.jpg", name: "Heels", occasion: "Dinner Date", temperature: "18-22°C" },
        { image: "/evening-3.jpg", name: "Clutch", occasion: "Dinner Date", temperature: "18-22°C" },
        { image: "/evening-4.jpg", name: "Necklace", occasion: "Dinner Date", temperature: "18-22°C" },
        { image: "/evening-5.jpg", name: "Bracelet", occasion: "Dinner Date", temperature: "18-22°C" },
      ],
    },
    {
      id: 3,
      name: "Office Ready",
      items: [
        { image: "/office-1.jpg", name: "Blazer", occasion: "Work Meeting", temperature: "20-25°C" },
        { image: "/office-2.jpg", name: "Shirt", occasion: "Work Meeting", temperature: "20-25°C" },
        { image: "/office-3.jpg", name: "Trousers", occasion: "Work Meeting", temperature: "20-25°C" },
        { image: "/office-4.jpg", name: "Shoes", occasion: "Work Meeting", temperature: "20-25°C" },
        { image: "/office-5.jpg", name: "Watch", occasion: "Work Meeting", temperature: "20-25°C" },
      ],
    },
  ];

  return (
    <div className="favorites-container">
      {favoriteOutfits.map((outfit) => (
        <FavoriteItem key={outfit.id} name={outfit.name} items={outfit.items} />
      ))}
    </div>
  );
};
export default FavoritesPage;
