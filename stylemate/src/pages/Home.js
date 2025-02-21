import React, { useState } from "react";
import "./Home.css";
import tshirtImg from "../assets/tshirt.jpeg";
import jeansImg from "../assets/jeans.jpeg";
import sneakersImg from "../assets/shoes.jpeg";
const Home = () => {
  const [occasion, setOccasion] = useState("");
  const [generatedOutfit, setGeneratedOutfit] = useState(null);

  const handleGenerate = () => {
    // Mock outfit generation (replace with API call later)
    const outfit = [
      { name: "Casual White T-Shirt", description: "Perfect for layering or wearing alone", image: tshirtImg },
      { name: "Classic Blue Jeans", description: "Comfortable slim-fit denim", image: jeansImg },
      { name: "White Sneakers", description: "Versatile and comfortable footwear", image: sneakersImg},
    ]; 
    setGeneratedOutfit(outfit);
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">👕 StyleMate</div>
        <ul className="nav-links">
          <li><a href="/Home" className="active">Home</a></li>
          <li><a href="/closet">Closet</a></li>
          <li><a href="/favorites">Favourites</a></li>
          <li><a href="/Profile">Profile</a></li>
        </ul>
      </nav>

      {/* Header */}
      <header className="header">
        <h1>Generate Your Perfect Outfit</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="What's the occasion? (e.g., casual, formal)"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
          <button onClick={handleGenerate}>Generate</button>
        </div>
        <div className="weather-info">
          <div>🌡️ Temperature: 22°C</div>
          <div>☁️ Weather: Partly Cloudy</div>
          <div>🌸 Season: Spring</div>
        </div>
      </header>

      {/* Outfit Section */}
      {generatedOutfit && (
        <section className="outfit-section">
          <h2>Your Generated Outfit</h2>
          <div className="outfit-grid">
            {generatedOutfit.map((item, index) => (
              <div key={index} className="outfit-item">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <div className="buttons">
            <button className="favorite-btn">❤️ Save to Favorites</button>
            <button className="generate-btn" onClick={handleGenerate}>🔄 Generate Another</button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 StyleMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
