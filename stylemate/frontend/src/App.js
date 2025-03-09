import './App.css';
import Closet from "./pages/closet";
import Favorites from "./pages/favorites";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";


function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" element={<Home />} />
        <Route path="/closet" element={<Closet />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Router>
    </div>
  );
}

export default App;
