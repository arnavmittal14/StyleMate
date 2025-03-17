import {React, useEffect, useState} from "react";  
import { useNavigate } from "react-router-dom";
import OutfitModal from "./OutfitModal";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    const [weather, setWeather] = useState({
      city: "Loading...",
      condition: "Fetching...",
      temp: "",
      feelsLike: "",
    });

    const [occasion, setOccasion] = useState("");
    const [outfit, setOutfit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      // Redirect to login if not authenticated
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      let timeoutId;
  
      // Function to fetch weather
      const fetchWeather = async (lat, lon) => {
        const apiKey = "44cacdb47e2bd59c4100c6e2e4548626";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  
        try {
          const response = await fetch(url);
          const data = await response.json();

          setWeather({
            city: data.name,
            condition: data.weather[0].description,
            temp: `${Math.round(data.main.temp)}°C`,
            feelsLike: `Feels like ${Math.round(data.main.feels_like)}°C`,
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
        timeoutId = setTimeout(errorCallback, 3000);
      } else {
        errorCallback(); // If geolocation is not supported
      }
    }, [navigate]);

    const generateOutfit = async () => {
      if (!occasion.trim()) return;
  
      setLoading(true);
      setIsModalOpen(true); 
  
      try {
        const response = await fetch("http://localhost:8000/generate-outfit/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ occasion }),
        });
  
        if (!response.ok) throw new Error("Failed to fetch outfit");
  
        const data = await response.json();
        setOutfit(data);
      } catch (error) {
        console.error("Error generating outfit:", error);
        setOutfit(null);
      } finally {
        setLoading(false);
      }
    };

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
        <h6 className="generator-subtitle">keep it brief for optimal results!</h6>
        <div className="input-container">
          <input
            type="text"
            placeholder="What's the occasion?"
            className="occasion-input"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
          <button className="generate-button" onClick={generateOutfit}>Generate</button>
        </div>

        {/* Weather Display */}
        <div className="weather-card">
        <h4 className="weather-location">{weather.city}</h4>
          <p className="weather-condition">{weather.condition}</p>
          <p className="weather-temp">{weather.temp}</p>
          <p className="weather-feels-like">{weather.feelsLike}</p>
        </div>
      </div>

       {/* Outfit Modal */}
       <OutfitModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        occasion={occasion}
        loading={loading}
        outfit={outfit}
      />

    </div>
  );
}