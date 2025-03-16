import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import Closet from "./pages/closet/ClosetPage.jsx";
import Favorites from "./pages/favorites/FavoritesPage.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/login/LoginPage.jsx";
import Profile from "./pages/profile/ProfilePage.jsx";

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // Hide Navbar on login page

  return (
    <div className="App">
      <div className="ombre-background">
        {!hideNavbar && <Navbar />} {/* Show Navbar on all pages except login */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
