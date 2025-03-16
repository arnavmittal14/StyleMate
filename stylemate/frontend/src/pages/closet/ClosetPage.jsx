// import { useState } from "react";
// import "./ClosetPage.css";

// export default function ClosetPage() {
//   const allClothingItems = [
//     { image: "/defaultcloset/whitetee.png", name: "White Tee", category: "Tops" },
//     { image: "/defaultcloset/blacktee.png", name: "Black Tee", category: "Tops" },
//     { image: "/defaultcloset/bluejeans.png", name: "Blue Jeans", category: "Bottoms" },
//     { image: "/defaultcloset/blackjeans.png", name: "Black Jeans", category: "Bottoms" },
//     { image: "/defaultcloset/greyhoodie.png", name: "Grey Hoodie", category: "Outerwear" },
//     { image: "/defaultcloset/whitesneakers.png", name: "White Sneakers", category: "Footwear" },
//   ];

//   const [selectedCategory, setSelectedCategory] = useState("All Items");

//   // Filter clothing items based on the selected category
//   const filteredItems =
//     selectedCategory === "All Items"
//       ? allClothingItems
//       : allClothingItems.filter((item) => item.category === selectedCategory);

//   return (
//     <div className="closet-container">
//       {/* Filters Section */}
//       <div className="filters-container">
//         {["All Items", "Tops", "Bottoms", "Footwear", "Outerwear"].map((filter, index) => (
//           <button
//             key={index}
//             className={`filter-button ${filter === selectedCategory ? "filter-button-active" : ""}`}
//             onClick={() => setSelectedCategory(filter)}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>

//       {/* Add New Item Button */}
//       <div className="add-button-container">
//         <button className="add-button">+ Add New Item</button>
//       </div>

//       {/* Closet Items Grid */}
//       <div className="closet-grid">
//         {filteredItems.map((item, index) => (
//           <div key={index} className="closet-item">
//             <img src={item.image} alt={item.name} className="item-image" />
//             <p className="item-name">{item.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import "./ClosetPage.css";
import NewItemModal from "./NewItemModal";

export default function ClosetPage() {
  const allClothingItems = [
    { image: "/defaultcloset/whitetee.png", name: "White Tee", category: "Tops" },
    { image: "/defaultcloset/blacktee.png", name: "Black Tee", category: "Tops" },
    { image: "/defaultcloset/bluejeans.png", name: "Blue Jeans", category: "Bottoms" },
    { image: "/defaultcloset/blackjeans.png", name: "Black Jeans", category: "Bottoms" },
    { image: "/defaultcloset/greyhoodie.png", name: "Grey Hoodie", category: "Outerwear" },
    { image: "/defaultcloset/whitesneakers.png", name: "White Sneakers", category: "Footwear" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [clothingItems, setClothingItems] = useState(allClothingItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter clothing items based on the selected category
  const filteredItems =
    selectedCategory === "All Items"
      ? clothingItems
      : clothingItems.filter((item) => item.category === selectedCategory);

  // Function to handle adding a new item
  const handleAddItem = (newItem) => {
    setClothingItems([...clothingItems, newItem]);
  };

  return (
    <div className="closet-container">
      {/* Filters Section */}
      <div className="filters-container">
        {["All Items", "Tops", "Bottoms", "Footwear", "Outerwear"].map((filter, index) => (
          <button
            key={index}
            className={`filter-button ${filter === selectedCategory ? "filter-button-active" : ""}`}
            onClick={() => setSelectedCategory(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Add New Item Button */}
      <div className="add-button-container">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          + Add New Item
        </button>
      </div>

      {/* Closet Items Grid */}
      <div className="closet-grid">
        {filteredItems.map((item, index) => (
          <div key={index} className="closet-item">
            <img src={item.image} alt={item.name} className="item-image" />
            <p className="item-name">{item.name}</p>
          </div>
        ))}
      </div>

      {/* New Item Modal */}
      {isModalOpen && <NewItemModal onClose={() => setIsModalOpen(false)} onAddItem={handleAddItem} />}
    </div>
  );
}
