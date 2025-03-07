import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
import tshirtImg from "../assets/tshirt.jpeg";
import jeansImg from "../assets/jeans.jpeg";
import sneakersImg from "../assets/shoes.jpeg";

const Home = () => {
  const [occasion, setOccasion] = useState("");
  const [generatedOutfit, setGeneratedOutfit] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "ae9829f9cbfff48c103fcbae172e8c18"; 
        const response = await axios.get(
          `http://api.weatherstack.com/current?access_key=${apiKey}&query=Calgary`
        );

        if (response.data.success === false) {
          throw new Error(response.data.error.info);
        }

        setWeather(response.data.current);
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
      }
    };

    fetchWeather();
  }, []);

  const handleGenerate = () => {
    const outfit = [
      { name: "Casual White T-Shirt", description: "Perfect for layering or wearing alone", image: tshirtImg },
      { name: "Classic Blue Jeans", description: "Comfortable slim-fit denim", image: jeansImg },
      { name: "White Sneakers", description: "Versatile and comfortable footwear", image: sneakersImg },
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
        {weather && (
          <div className="weather-info">
            <div>🌡️ Temperature: {weather.temperature}°C</div>
            <div>☁️ Weather: {weather.weather_descriptions[0]}</div>
          </div>
        )}
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
