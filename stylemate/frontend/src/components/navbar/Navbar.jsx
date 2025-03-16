import React from 'react';
import './Navbar.css'; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <img src="/styleMate_logo_2.png" alt="StyleMate Logo" className="logo" />
      <nav className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/Closet" className="nav-link">Closet</a>
        <a href="/Favorites" className="nav-link">Favorites</a>
        <a href="/Profile" className="nav-link">Profile</a>
      </nav>
    </nav>
  );
}