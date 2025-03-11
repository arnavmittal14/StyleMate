import { useState } from "react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [selectedGender, setSelectedGender] = useState("");

  return (
    <div className="profile-page">
      {/* Profile Section */}
      <div className="profile-container">
        <div className="profile-header">
          {/* Profile Image Upload */}
          <div className="profile-image-container">
            <img
              src="/profile-placeholder.jpg"
              alt="Profile"
              className="profile-image"
            />
            <button className="profile-upload-btn">📷</button>
          </div>

          {/* Profile Header */}
          <h2 className="profile-title">My Profile</h2>
          <p className="profile-subtitle">Manage your personal information</p>
        </div>

        {/* Profile Form */}
        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="First Name" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Last Name" />
            </div>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="number" placeholder="Age" />
          </div>

          {/* Gender Selection */}
          <div className="gender-selection">
            <label>Gender</label>
            <div className="gender-options">
              {["Male", "Female", "Other"].map((gender) => (
                <button
                  key={gender}
                  className={`gender-button ${
                    selectedGender === gender ? "selected" : ""
                  }`}
                  onClick={() => setSelectedGender(gender)}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="save-button-container">
            <button className="save-button">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
