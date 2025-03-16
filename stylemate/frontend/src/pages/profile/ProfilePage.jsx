import React, { useState, useEffect } from "react";
import "./ProfilePage2.css";

export default function ProfileCard() {
  const [userData, setUserData] = useState({
    user_id: null,
    first_name: "First",
    last_name: "Last",
    email: "info@example.com",
    gender: "Female",
    profile_photo_url: "/profile.png",
  });
  const [loading, setLoading] = useState(true);

  // On mount, fetch the current user info from the backend.
  useEffect(() => {
    fetch("/api/current_user/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Current user data:", data);
        if (data.user) {
          setUserData(data.user);
        } else {
          console.error("User not authenticated or error:", data.error);
          // Optionally, you can redirect to a login page here.
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
        setLoading(false);
      });
  }, []);

  // Handle changes to input fields.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image upload and processing.
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Preview image locally.
      const reader = new FileReader();
      reader.onload = (e) =>
        setUserData((prevData) => ({
          ...prevData,
          profile_photo_url: e.target.result,
        }));
      reader.readAsDataURL(file);

      // Upload file to backend for processing (background removal).
      const formData = new FormData();
      formData.append("photo", file);
      fetch("/api/upload_and_process_photo/", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.processed_image_url) {
            setUserData((prevData) => ({
              ...prevData,
              profile_photo_url: data.processed_image_url,
            }));
          }
        })
        .catch((err) => console.error("Error uploading image:", err));
    }
  };

  // Handle saving updated user info.
  const handleSave = () => {
    fetch("/api/update_user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("Profile updated successfully!");
        } else if (data.error) {
          alert("Error updating profile: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-card">
      <div className="profile-left">
        <img
          src={userData.profile_photo_url}
          alt="Profile"
          className="profile-img"
        />
        <input
          type="text"
          className="profile-name"
          value={userData.first_name}
          name="first_name"
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="profile-role"
          value={userData.last_name}
          name="last_name"
          onChange={handleInputChange}
        />
        <h5>Upload my own profile photo</h5>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="image-upload"
        />
      </div>
      <div className="profile-right">
        <h3>Personal Information</h3>
        <hr />
        <div className="info-row">
          <div>
            <strong>First Name</strong>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <strong>Last Name</strong>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="info-row">
          <div>
            <strong>Email</strong>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <strong>Password</strong>
            <input type="password" defaultValue="password" readOnly />
          </div>
        </div>
        <div className="info-row">
          <div className="gender-dropdown">
            <strong>Gender</strong>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              className="gender-dropdown"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
