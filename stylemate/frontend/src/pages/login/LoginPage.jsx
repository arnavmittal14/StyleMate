import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
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
  const fetchAndSetCurrentUser = () => {
    fetch("http://localhost:8000/api/current_user/", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.user_id) {
          // Update AuthContext with complete user data
          login({ email: data.user.email, user_id: data.user.user_id });
          navigate("/");
        } else {
          setError("Failed to retrieve user info after login");
        }
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setError("Error fetching current user");
      });
  };

  // Regular login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        // If login is successful, data.message should be truthy.
        // Check if user_id is included; if not, fetch current user.
        if (data.message) {
          if (data.user_id) {
            login({ email, user_id: data.user_id });
            navigate("/");
          } else {
            // If user_id is missing, fetch the current user info.
            fetchAndSetCurrentUser();
          }
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Error during login:", err);
        setError("Login failed. Please try again.");
      });
  };

  // When guest login button is clicked, show the gender selection popup
  const handleGuestLogin = () => {
    setError("");
    setShowGuestPopup(true);
  };

  // When the guest chooses a gender, call the guest_login API endpoint
  const confirmGuestLogin = () => {
    fetch("http://localhost:8000/api/guest_login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ gender: guestGender.toLowerCase() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user_id) {
          let guestEmail = "";
          if (guestGender.toLowerCase() === "male") {
            guestEmail = "guest_male@example.com";
          } else if (guestGender.toLowerCase() === "female") {
            guestEmail = "guest_female@example.com";
          } else {
            guestEmail = "guest_other@example.com";
          }
          login({ email: guestEmail, user_id: data.user_id });
          setShowGuestPopup(false);
          navigate("/");
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Error during guest login:", err);
        setError("Guest login failed. Please try again.");
      });
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
      {showGuestPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Choose Your Preferred Closet</h3>
            <div className="closet-selection">
              <button onClick={() => setGuestGender("female")}>
                Female Closet
              </button>
              <button onClick={() => setGuestGender("male")}>
                Male Closet
              </button>
              <button onClick={() => setGuestGender("other")}>
                Other
              </button>
            </div>
            <div className="popup-actions">
              <button onClick={confirmGuestLogin}>Confirm</button>
              <button onClick={cancelGuestLogin}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
