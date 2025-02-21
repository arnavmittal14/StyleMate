import React from "react";
import "./Favourites.css";
import sumr from "../assets/sum.jpg";
import even from "../assets/even.jpg";
import work from "../assets/work.jpg";

const Favorites = () => {
  return (
    <div className="favorites-container">
      <nav className="navbar">
        <div className="logo">👕 StyleMate</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/closet">Closet</a></li>
          <li><a href="/favorites" className="active">Favourites</a></li>
          <li><a href="/Profile">Profile</a></li>
        </ul>
      </nav>
      <h1>Favorite Outfits</h1>
      <p className="subtitle">Your personally curated collection of outfits</p>
      <div className="favorites-grid">
        <div className="favorite-item"><img src= {sumr} alt="Summer Casual" /><p>Summer Casual</p></div>
        <div className="favorite-item"><img src= {even} alt="Evening Elegance" /><p>Evening Elegance</p></div>
        <div className="favorite-item"><img src= {work} alt="Workout Ready" /><p>Workout Ready</p></div>
      </div>
      <button className="new-outfit">+ New Outfit</button>
      <footer className="footer">
        <p>© 2025 StyleMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Favorites;
