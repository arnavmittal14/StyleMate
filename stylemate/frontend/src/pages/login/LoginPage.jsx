import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "./api"; // Importing the API instance
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // States for regular login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // States for guest login flow
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [guestGender, setGuestGender] = useState("female"); // default to female

  // Helper to update AuthContext with current user data from backend
  const fetchAndSetCurrentUser = async () => {
    try {
      const res = await api.get("/current_user/", { withCredentials: true });
      if (res.data.user && res.data.user.user_id) {
        login({ email: res.data.user.email, user_id: res.data.user.user_id });
        navigate("/");
      } else {
        setError("Failed to retrieve user info after login");
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
      setError("Error fetching current user");
    }
  };

  // Regular login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login/", { email, password }, { withCredentials: true });
      if (res.data.message) {
        if (res.data.user_id) {
          login({ email, user_id: res.data.user_id });
          navigate("/");
        } else {
          await fetchAndSetCurrentUser();
        }
      } else if (res.data.error) {
        setError(res.data.error);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed. Please try again.");
    }
  };

  // When guest login button is clicked, show the gender selection popup
  const handleGuestLogin = () => {
    setError("");
    setShowGuestPopup(true);
  };

  // Confirm guest login request
  const confirmGuestLogin = async () => {
    try {
      const res = await api.post("/guest_login/", { gender: guestGender.toLowerCase() }, { withCredentials: true });
      if (res.data.user_id) {
        let guestEmail = `guest_${guestGender.toLowerCase()}@example.com`;
        login({ email: guestEmail, user_id: res.data.user_id });
        setShowGuestPopup(false);
        navigate("/");
      } else if (res.data.error) {
        setError(res.data.error);
      }
    } catch (err) {
      console.error("Error during guest login:", err);
      setError("Guest login failed. Please try again.");
    }
  };

  // Cancel guest login popup
  const cancelGuestLogin = () => {
    setShowGuestPopup(false);
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
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
            {error && <div className="error">{error}</div>}
            <button type="submit" className="login-button">
              Login
            </button>
            <div className="guest-login">
              <button type="button" className="guest-button" onClick={handleGuestLogin}>
                Continue as Guest
              </button>
            </div>
            <div className="signup-link">
              <p>
                Don't have an account? {" "}
                <button type="button" className="signup-button" onClick={handleSignUp}>
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      {showGuestPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Choose Your Preferred Closet</h3>
            <div className="closet-selection">
              <button className={guestGender === "female" ? "selected" : ""} onClick={() => setGuestGender("female")}>
                Female Closet
              </button>
              <button className={guestGender === "male" ? "selected" : ""} onClick={() => setGuestGender("male")}>
                Male Closet
              </button>
              <button className={guestGender === "other" ? "selected" : ""} onClick={() => setGuestGender("other")}>
                Other
              </button>
              <div className="conf-cancel">
                <button onClick={confirmGuestLogin}>Confirm</button>
                <button onClick={cancelGuestLogin}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
