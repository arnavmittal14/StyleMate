// import { useState } from "react";
// import "./ProfilePage.css";

// export default function ProfilePage() {
//   const [selectedGender, setSelectedGender] = useState("");
//   const [profileImage, setProfileImage] = useState("/profile.png");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     age: "",
//     email: "",
//     password: "",
//   });

//   // handles upload of new profile pic 
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//     // Handle form data change
//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     };

//   return (
//     <div className="profile-page">
//       {/* Profile Section */}
//       <div className="profile-container">
//         <div className="profile-header">
//           {/* Profile Image Upload */}
//           <div className="profile-image-container">
//             <img
//               src="/profile.png"
//               alt="Profile"
//               className="profile-image"
//             />
            
//             <label htmlFor="file-input" className="profile-upload-btn">
//               📷
//             </label>
//           </div>

//           {/* Profile Header */}
//           <h2 className="profile-title">My Profile</h2>
//           <p className="profile-subtitle">Manage your personal information</p>
//         </div>

//         {/* Profile Form */}
//         <div className="profile-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label>First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 placeholder="First Name"
//               />
//             </div>
//             <div className="form-group">
//               <label>Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 placeholder="Last Name"
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Age</label>
//             <input
//               type="number"
//               name="age"
//               value={formData.age}
//               onChange={handleChange}
//               placeholder="Age"
//             />
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//             />
//           </div>

//           {/* Gender Selection */}
//           <div className="gender-selection">
//             <label>Gender</label>
//             <div className="gender-options">
//               {["Male", "Female", "Other"].map((gender) => (
//                 <button
//                   key={gender}
//                   className={`gender-button ${
//                     selectedGender === gender ? "selected" : ""
//                   }`}
//                   onClick={() => setSelectedGender(gender)}
//                 >
//                   {gender}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="save-button-container">
//             <button className="save-button">Save Changes</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import './ProfilePage2.css';
import React, { useState } from "react";

export default function ProfileCard() {
  const [firstName, setFirstName] = useState("First");
  const [lastName, setLastName] = useState("Last");
  const [age, setAge] = useState(20);
  const [email, setEmail] = useState("info@example.com");
  const [password, setPassword] = useState("password");
  const [gender, setGender] = useState("Female");
  const [image, setImage] = useState("./profile.png");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert(`Profile Saved!\n\nFirst Name: ${firstName}\nLast Name: ${lastName}\nAge: ${age}\nEmail: ${email}\nGender: ${gender}`);
  };

  return (
    <div className="profile-card">
      <div className="profile-left">
        <img src={image} alt="Profile" className="profile-img" />
        <input type="text" className="profile-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type="text" className="profile-role" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <h5>Upload my own profile photo</h5>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="image-upload" />
      </div>
      <div className="profile-right">
        <h3>Personal Information</h3>
        <hr />
        <div className="info-row">
          <div>
            <strong>First Name</strong>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <strong>Last Name</strong>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="info-row">
          <div>
            <strong>Email</strong>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <strong>Password</strong>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="info-row">
          <div className="gender-dropdown">
            <strong>Gender   </strong>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className='gender-dropdown'>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
