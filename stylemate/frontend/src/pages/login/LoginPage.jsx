import React from 'react';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-card">
        {/* Title Section */}
        <h2 className="login-title">StyleMate</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {/* Login Form */}
        <div className="login-form">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter your email"
          />

          <label className="form-label password-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter your password"
          />

          <div className="forgot-password-container">
            <a href="#" className="forgot-password-link">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button className="login-button">
            Login
          </button>

          {/* Sign Up Link */}
          <p className="signup-text">
            Don't have an account? <a href="#" className="signup-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}