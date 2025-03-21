import React, { useState, useEffect } from "react";
import { api } from "../../api"; // ✅ Use centralized Axios instance
import "./ProfilePage2.css";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("/profile.png");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    api.get("/api/current_user/")
      .then((res) => {
        if (res.data.user) {
          const user = res.data.user;
          setFirstName(user.first_name || "");
          setLastName(user.last_name || "");
          setEmail(user.email || "");
          setGender(user.gender || "male");
          setProfilePhotoPreview(user.profile_photo_url || "/profile.png");
        } else if (res.data.error) {
          setError(res.data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setError("Error fetching current user.");
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => setProfilePhotoPreview(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
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

    try {
      const res = await api.post("/api/update_user/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentComplete);
        },
      });

      if (res.data.message) {
        setMessage(res.data.message);
      } else {
        setError(res.data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Error updating user. Please try again.");
    } finally {
      setUploadProgress(0);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-card">
      <div className="profile-left">
        <img src={profilePhotoPreview} alt="Profile" className="profile-img" />
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
              <option value="male">Male</option>
              <option value="female">Female</option>
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
