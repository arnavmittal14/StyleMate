import React from 'react';
import { useNavigate } from "react-router-dom";
import './Navbar.css';

export default function Navbar() {

  // const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // For redirection

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // Redirect to login page
  };

  const isGuestUser = () => {
    const user = localStorage.getItem('user');
    const userJSON = JSON.parse(user);
    if (userJSON?.email && userJSON?.email?.includes("guest")) {
      return true;
    }

    return false;
  }

  return (
    <nav className="navbar">
      <img src="/styleMate_logo_2.png" alt="StyleMate Logo" className="logo" />
      <nav className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/Closet" className="nav-link">Closet</a>
        <a href="/Favorites" className="nav-link">Favorites</a>
        {!isGuestUser() && <a href="/Profile" className="nav-link">Profile</a>}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>
    </nav>
  );
}