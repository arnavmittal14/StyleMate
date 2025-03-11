import React from 'react';
import './Navbar.css'; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">StyleMate</h1>
      <div className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/Closet" className="nav-link">Closet</a>
        <a href="/Favorites" className="nav-link">Favorites</a>
        <a href="/Profile" className="nav-link">Profile</a>
      </div>
    </nav>
  );
}