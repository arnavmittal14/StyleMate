import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/login/AuthContext.jsx"; 
import './Navbar.css'; 

export default function Navbar() {

  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // For redirection

  const handleLogout = () => {
    logout(); // Reset authentication
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <img src="/styleMate_logo_2.png" alt="StyleMate Logo" className="logo" />
      <nav className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/Closet" className="nav-link">Closet</a>
        <a href="/Favorites" className="nav-link">Favorites</a>
        <a href="/Profile" className="nav-link">Profile</a>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
    </nav>
  );
}