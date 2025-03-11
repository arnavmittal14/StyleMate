import ClosetItem from "./ClosetItem";
import "./ClosetPage.css";

export default function ClosetPage() {
  const clothingItems = [
    { image: "/white-tee.jpg", name: "White Basic Tee", category: "Casual", season: "Summer" },
    { image: "/denim-jeans.jpg", name: "Blue Denim Jeans", category: "Casual", season: "All Seasons" },
    { image: "/leather-jacket.jpg", name: "Leather Jacket", category: "Evening", season: "Fall" },
    { image: "/floral-dress.jpg", name: "Floral Dress", category: "Casual", season: "Summer" },
  ];

  return (
    <div className="page-container">

      {/* Filters Section */}
      <div className="filters-container">
        {["All Items", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"].map((filter, index) => (
          <button
            key={index}
            className={`filter-button ${
              filter === "Tops" ? "filter-button-active" : ""
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Add New Item Button */}
      <div className="add-button-container">
        <button className="add-button">+ Add New Item</button>
      </div>

      {/* Closet Items Grid */}
      <div className="closet-grid">
        {clothingItems.map((item, index) => (
          <ClosetItem key={index} image={item.image} name={item.name} category={item.category} season={item.season} />
        ))}
      </div>
    </div>
  );
}