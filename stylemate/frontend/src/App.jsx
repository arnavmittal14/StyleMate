import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar.jsx";
import Closet from "./pages/closet/ClosetPage.jsx";
import Favorites from "./pages/favorites/FavoritesPage.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/LoginPage.jsx";
import Signup from "./pages/signup/SignupPage.jsx";  // Import SignupPage
import { AuthProvider } from "./pages/login/AuthContext";
import Profile from "./pages/profile/ProfilePage.jsx";

function Layout({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup"; // Hide Navbar on login & signup pages

  return (
    <div className="App">
      <div className="ombre-background">
        {!hideNavbar && <Navbar setIsAuthenticated={setIsAuthenticated} />} {/* Show Navbar on all pages except login & signup */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} /> {/* Added Signup route */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true"; // Persist login state
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthProvider>
      <Router>
        <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </Router>
    </AuthProvider>
  );
}

export default App;
