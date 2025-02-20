import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Closet from "./pages/Closet";
// import Favorites from "./pages/Favorites";
// import Profile from "./pages/Profile";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/closet" element={<Closet />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
