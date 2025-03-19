import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../login/AuthContext";
import "./SignupPage.css";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [error, setError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Build the payload for the registration API.
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password1: password,
      password2: password,
      gender: gender.toLowerCase(),
    };

    console.log("Payload to register:", payload); // Debug output

    fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          // Registration successful.
          // Option 1: Automatically log the user in
          navigate("/login");
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        setError("Registration failed. Please try again.");
      });
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
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="signup-button">
              Sign Up
            </button>
            <div className="login-link">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="login-button"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
