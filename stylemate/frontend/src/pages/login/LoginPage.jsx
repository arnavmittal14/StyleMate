import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedInAsGuest, setIsLoggedInAsGuest] = useState(false); // Track guest login state
  const [showPopup, setShowPopup] = useState(false); // Show closet selection popup
  const [selectedCloset, setSelectedCloset] = useState(""); // Track the selected closet

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password); // Call login function with email and password
    navigate("/"); // Redirect to home page
  };

  const handleGuestLogin = () => {
    login({ email: "guest" }); // Login as guest with a dummy email
    setIsLoggedInAsGuest(true); // Set guest login state to true
  };

  const handleSignUp = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  const handleClosetSelection = (closetType) => {
    setSelectedCloset(closetType); // Set the selected closet type
    setShowPopup(false); // Close the popup
    // Store the user's preference in local storage or context
    localStorage.setItem("preferredCloset", closetType);
    navigate("/"); // Redirect to home page

  };
  
  return (
    <div className="login-container">
      {!isLoggedInAsGuest ? (
        <div className="login-card">
          <div className="login-left">
            <h2>Welcome Back!</h2>
            <p>Login to your account</p>
          </div>
          <div className="login-right">
            <form onSubmit={handleLogin}>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
              <div className="guest-login">
                <button
                  type="button"
                  className="guest-button"
                  onClick={handleGuestLogin}
                >
                  Continue as Guest
                </button>
              </div>
              <div className="signup-link">
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="signup-button"
                    onClick={handleSignUp}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Popup for closet selection (after guest login)
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Choose Your Preferred Closet</h3>
            <div className="closet-selection">
              <button onClick={() => handleClosetSelection("female")}>
                Female Closet
              </button>
              <button onClick={() => handleClosetSelection("male")}>
                Male Closet
              </button>
              <button onClick={() => handleClosetSelection("mixed")}>
                Mixed Closet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
