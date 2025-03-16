import { useState } from "react";
import FavoriteItem from "./FavoriteItem";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const favoriteOutfits = [
    {
      id: 1,
      name: "Casual Weekend Look",
      items: [
        { image: "/casual-1.jpg", name: "T-shirt", occasion: "Brunch", temperature: "15-20°C" },
        { image: "/casual-2.jpg", name: "Jeans", occasion: "Brunch", temperature: "15-20°C" },
        { image: "/casual-3.jpg", name: "Sneakers", occasion: "Brunch", temperature: "15-20°C" },
        { image: "/casual-4.jpg", name: "Sunglasses", occasion: "Brunch", temperature: "15-20°C" },
        { image: "/casual-5.jpg", name: "Hat", occasion: "Brunch", temperature: "15-20°C" },
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

  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = favoriteOutfits.length;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="favorites-page">
      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title">My Favorite Outfits</h2>
        <p className="page-description">Your personally curated collection of favorite outfits</p>
      </div>

      {/* Outfit Title (on its own line) */}
      <div className="outfit-title-container">
        <h3 className="outfit-title">{favoriteOutfits[currentSlide].name}</h3>
      </div>

      {/* Favorites Carousel */}
      <div className="carousel-container">
        <button className="carousel-button carousel-button-left" onClick={goToPreviousSlide}>
          ← 
        </button>

        <div className="carousel-items">
          {/* Map the current outfit and its items */}
          {favoriteOutfits[currentSlide].items.map((item, index) => (
            <FavoriteItem
              key={index}
              image={item.image}
              name={item.name}
              occasion={item.occasion}
              temperature={item.temperature}
            />
          ))}
        </div>

        <button className="carousel-button carousel-button-right" onClick={goToNextSlide}>
        →
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="pagination-dots">
        {favoriteOutfits.map((_, index) => (
          <div
            key={index}
            className={`pagination-dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}
