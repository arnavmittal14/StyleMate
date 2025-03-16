import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password); // Call login function with email and password
    navigate("/"); // Redirect to home page
  };

  const handleGuestLogin = () => {
    login({ email: "guest" }); // Login as guest with a dummy email
    navigate("/"); // Redirect to home page
  };

  const handleSignUp = () => {
    login({ email }); // Simulate sign-up by logging in with the email
    navigate("/"); // Redirect to home page
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
    </div>
  );
}