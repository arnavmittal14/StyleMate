import React, { useState, useEffect } from "react";
import "./ProfilePage2.css";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("/profile.png");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch current user info on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/current_user/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFirstName(data.user.first_name || "");
          setLastName(data.user.last_name || "");
          setEmail(data.user.email || "");
          setGender(data.user.gender || "Male");
          setProfilePhotoPreview(data.user.profile_photo_url || "/profile.png");
        } else if (data.error) {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setError("Error fetching current user.");
        setLoading(false);
      });
  }, []);

  // Handle file selection for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => setProfilePhotoPreview(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Use XMLHttpRequest to send FormData and update upload progress
  const handleSave = () => {
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("gender", gender.toLowerCase());

    if (profilePhotoFile) {
      formData.append("profile_photo", profilePhotoFile);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/api/update_user/", true);
    xhr.withCredentials = true;

    // Update progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.message) {
            setMessage(response.message);
          } else {
            setError(response.error || "Unknown error");
          }
        } catch (e) {
          setError("Invalid response from server");
        }
      } else {
        setError("Error updating user. Status: " + xhr.status);
      }
      setUploadProgress(0);
    };

    xhr.onerror = () => {
      setError("Error updating user. Please try again.");
      setUploadProgress(0);
    };

    xhr.send(formData);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-card">
      <div className="profile-left">
        <img
          src={profilePhotoPreview}
          alt="Profile"
          className="profile-img"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <strong>Last Name</strong>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="info-row">
          <div>
            <strong>Email</strong>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <strong>Password</strong>
            <input type="password" placeholder="********" readOnly />
          </div>
        </div>
        <div className="info-row">
          <div className="gender-dropdown">
            <strong>Gender</strong>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="gender-dropdown"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="non-binary">Non-Binary</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        {uploadProgress > 0 && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
