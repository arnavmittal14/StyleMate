import {React, useEffect, useState} from "react";  
import "./Home.css";

export default function Home() {

    const [weather, setWeather] = useState({
      city: "Loading...",
      condition: "Fetching...",
      temp: "",
      feelsLike: "",
    });

    useEffect(() => {
      let timeoutId;
  
      // Function to fetch weather
      const fetchWeather = async (lat, lon) => {
        const apiKey = "44cacdb47e2bd59c4100c6e2e4548626"; // Replace with your API key
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
        try {
          const response = await fetch(url);
          const data = await response.json();
          setWeather({
            city: data.name,
            condition: data.weather[0].description,
            temp: `${Math.round(data.main.temp)}°F`,
            feelsLike: `Feels like ${Math.round(data.main.feels_like)}°F`,
          });
        } catch (error) {
          console.error("Error fetching weather:", error);
        }
      };
  
      // Function to handle location success
      const successCallback = (position) => {
        clearTimeout(timeoutId); // Clear timeout if location is obtained
        fetchWeather(position.coords.latitude, position.coords.longitude);
      };
  
      // Function to handle location errors or timeout
      const errorCallback = () => {
        console.error("Location access denied or timed out. Using default city (Calgary).");
        fetchWeather(51.0447, -114.0719); // Default to Calgary
      };
  
      // Attempt to get the user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  
        // Set a 5-second timeout to use Calgary as the default
        timeoutId = setTimeout(errorCallback, 5000);
      } else {
        errorCallback(); // If geolocation is not supported
      }
    }, []);

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
        <h4 className="weather-location">{weather.city}</h4>
          <p className="weather-condition">{weather.condition}</p>
          <p className="weather-temp">{weather.temp}</p>
          <p className="weather-feels-like">{weather.feelsLike}</p>
        </div>
      </div>
    </div>
  );
}