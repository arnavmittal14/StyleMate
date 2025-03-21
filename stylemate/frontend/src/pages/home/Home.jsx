import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api"; // ✅ Axios instance
import OutfitModal from "./OutfitModal";
import "./Home.css";
import "./OutfitModal.css";

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
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    let timeoutId;

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

    const successCallback = (position) => {
      clearTimeout(timeoutId);
      fetchWeather(position.coords.latitude, position.coords.longitude);
    };

    const errorCallback = () => {
      console.error("Location access denied or timed out. Using default city (Calgary).");
      fetchWeather(51.0447, -114.0719);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      timeoutId = setTimeout(errorCallback, 3000);
    } else {
      errorCallback();
    }
  }, [navigate]);

  const generateOutfit = async () => {
    if (!occasion.trim()) return;

    setLoading(true);
    setIsModalOpen(true);

    try {
      const response = await api.post("/api/generate-outfit/", {
        occasion,
        user_id: localStorage.getItem("user_id"),
      });

      setOutfit(response.data);
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
        <p className="main-description">
          Get personalized outfit recommendations based on your wardrobe
        </p>
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
          <button className="generate-button" onClick={generateOutfit}>
            Generate
          </button>
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
