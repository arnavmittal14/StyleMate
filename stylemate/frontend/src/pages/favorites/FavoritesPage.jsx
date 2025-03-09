
import FavoriteItem from "./FavoriteItem";

export default function FavoritesPage() {
  const favoriteOutfits = [
    { image: "/casual-look.jpg", name: "Casual Weekend Look", occasion: "Brunch & Shopping", temperature: "15-20°C" },
    { image: "/evening-dress.jpg", name: "Evening Elegance", occasion: "Dinner Date", temperature: "18-22°C" },
    { image: "/office-suit.jpg", name: "Office Ready", occasion: "Work Meeting", temperature: "20-25°C" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      

      {/* Page Header */}
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold text-gray-800">My Favorite Outfits</h2>
        <p className="text-gray-600 mt-2">Your personally curated collection of favorite outfits</p>
      </div>

      {/* Favorites Carousel */}
      <div className="relative flex items-center justify-center mt-8">
        <button className="absolute left-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200">⬅️</button>

        <div className="flex space-x-6 overflow-x-auto px-6 py-4">
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

        <button className="absolute right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200">➡️</button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {favoriteOutfits.map((_, index) => (
          <div key={index} className="w-3 h-3 bg-gray-400 rounded-full"></div>
        ))}
      </div>
    </div>
  );
}
