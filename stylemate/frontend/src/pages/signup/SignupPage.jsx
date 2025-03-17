import { useState } from "react";
import { useAuth } from "../login/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Female");

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    login({ email }); // Simulate sign-up by logging in with the email
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-left">
          <h2>Create an Account</h2>
          <p>Sign up to get started</p>
        </div>
        <div className="signup-right">
          <form onSubmit={handleSignUp}>
            <div className="input-container">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
            <div className="input-container">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
            <div className="login-link">
              <p>
                Already have an account? <button type="button" className="login-button" onClick={() => navigate("/login")}>Login</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

}

