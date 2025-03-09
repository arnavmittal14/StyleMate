import ClosetItem from "./ClosetItem";

export default function ClosetPage() {
  const clothingItems = [
    { image: "/white-tee.jpg", name: "White Basic Tee", category: "Casual", season: "Summer" },
    { image: "/denim-jeans.jpg", name: "Blue Denim Jeans", category: "Casual", season: "All Seasons" },
    { image: "/leather-jacket.jpg", name: "Leather Jacket", category: "Evening", season: "Fall" },
    { image: "/floral-dress.jpg", name: "Floral Dress", category: "Casual", season: "Summer" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Filters Section */}
      <div className="flex justify-center space-x-4 mt-6">
        {["All Items", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"].map((filter, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-full text-gray-700 border border-gray-300 hover:bg-purple-100 ${
              filter === "Tops" ? "bg-purple-600 text-white" : ""
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Add New Item Button */}
      <div className="flex justify-center mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add New Item</button>
      </div>

      {/* Closet Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10 mt-6">
        {clothingItems.map((item, index) => (
          <ClosetItem key={index} image={item.image} name={item.name} category={item.category} season={item.season} />
        ))}
      </div>
    </div>
  );
}
