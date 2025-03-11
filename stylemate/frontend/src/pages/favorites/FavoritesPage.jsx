import FavoriteItem from "./FavoriteItem";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const favoriteOutfits = [
    { image: "/casual-look.jpg", name: "Casual Weekend Look", occasion: "Brunch & Shopping", temperature: "15-20°C" },
    { image: "/evening-dress.jpg", name: "Evening Elegance", occasion: "Dinner Date", temperature: "18-22°C" },
    { image: "/office-suit.jpg", name: "Office Ready", occasion: "Work Meeting", temperature: "20-25°C" },
  ];

  return (
    <div className="favorites-page">
      

      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title">My Favorite Outfits</h2>
        <p className="page-description">Your personally curated collection of favorite outfits</p>
      </div>

      {/* Favorites Carousel */}
      <div className="carousel-container">
        <button className="carousel-button carousel-button-left">⬅️</button>

        <div className="carousel-items">
          {favoriteOutfits.map((outfit, index) => (
            <FavoriteItem 
              key={index} 
              image={outfit.image} 
              name={outfit.name} 
              occasion={outfit.occasion} 
              temperature={outfit.temperature} 
            />
          ))}
        </div>

        <button className="carousel-button carousel-button-right">➡️</button>
      </div>

      {/* Pagination Dots */}
      <div className="pagination-dots">
        {favoriteOutfits.map((_, index) => (
          <div key={index} className="pagination-dot"></div>
        ))}
      </div>
    </div>
  );
}