import React from "react";  
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      

      {/* Main Content */}
      <div className="main-content">
        <h2 className="main-heading">Your Personal AI Stylist</h2>
        <p className="main-description">Get personalized outfit recommendations based on your wardrobe</p>
      </div>

      {/* Outfit Generator */}
      <div className="generator-card">
        <h3 className="generator-title">Generate Your Outfit</h3>
        <div className="input-container">
          <input
            type="text"
            placeholder="What's the occasion?"
            className="occasion-input"
          />
          <button className="generate-button">Generate</button>
        </div>

        {/* Weather Display */}
        <div className="weather-card">
          <h4 className="weather-location">San Francisco</h4>
          <p className="weather-condition">Partly Cloudy</p>
          <p className="weather-temp">72°F</p>
          <p className="weather-feels-like">Feels like 70°F</p>
        </div>
      </div>
    </div>
  );
}