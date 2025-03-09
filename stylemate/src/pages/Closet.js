import React from "react";
import "./Closet.css";
import tshirtImg from "../assets/tshirt.jpeg";
import jeansImg from "../assets/jeans.jpeg";
import sneakersImg from "../assets/shoe2.jpg";
import chainImg from "../assets/chain.jpeg"

const Closet = () => {
  return (
    <div className="closet-container">
      <nav className="navbar">
        <div className="logo">👕 StyleMate</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/closet" className="active">Closet</a></li>
          <li><a href="/favorites">Favourites</a></li>
          <li><a href="/Profile">Profile</a></li>
        </ul>
      </nav>
      <h1>My Closet</h1>
      <div className="closet-categories">
        <div className="category">Tops <span>24 items</span></div>
        <div className="category">Bottoms <span>16 items</span></div>
        <div className="category">Shoes <span>12 items</span></div>
        <div className="category">Accessories <span>18 items</span></div>
      </div>
      <div className="closet-grid">
        <div className="closet-item"><img src= {tshirtImg} alt="T-Shirt" /><p>White Basic T-Shirt</p></div>
        <div className="closet-item"><img src= {jeansImg} alt="Jeans" /><p>Black Slim Jeans</p></div>
        <div className="closet-item"><img src= {sneakersImg} alt="Sneakers" /><p>Sneakers</p></div>
        <div className="closet-item"><img src= {chainImg} alt="Necklace" /><p>Gold Chain Necklace</p></div>
      </div>
      <div className="buttons">
        <button className="add-item">+ Add Item</button>
        <button className="filter">🔍 Filter</button>
      </div>
      <footer className="footer">
        <p>© 2025 StyleMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Closet;
