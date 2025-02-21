import React from 'react';
import './Profile.css';
import pfp from '../assets/pfp.png';

const Profile = () => {
  return (
    <div className="profile-container">
      <nav className="navbar">
        <div className="logo">👕 StyleMate</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/closet">Closet</a></li>
          <li><a href="/favorites">Favourites</a></li>
          <li><a href="/profile" className="active">Profile</a></li>
        </ul>
      </nav>
      <div className="profile-header">
        <img src={pfp} alt="Profile" className="profile-image" />
        <div className="profile-info">
          <h2>Sarah Johnson</h2>
          <p>Member since January 2025</p>
        </div>
      </div>
      <div className="profile-content">
        <h3>Personal Information</h3>
        <form className="profile-form">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" value="Sarah" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value="Johnson" />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="number" value="25" />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>
        </form>
        <h3>Style Preferences</h3>
        <div className="style-preferences">
          <button className="selected">Casual</button>
          <button>Formal</button>
          <button>Bohemian</button>
          <button>Streetwear</button>
          <button>Minimalist</button>
        </div>
        <button className="save-button">Save Changes</button>
      </div>
      <footer className="footer">
        <p>© 2025 StyleMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Profile;
