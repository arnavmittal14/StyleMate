
import { useState } from "react";

export default function ProfilePage() {
  const [selectedGender, setSelectedGender] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      

      {/* Profile Section */}
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow-md rounded-2xl">
        <div className="flex flex-col items-center">
          {/* Profile Image Upload */}
          <div className="relative w-24 h-24">
            <img
              src="/profile-placeholder.jpg"
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-purple-500"
            />
            <button className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full shadow-md hover:bg-purple-700">
              📷
            </button>
          </div>

          {/* Profile Header */}
          <h2 className="text-2xl font-semibold text-gray-800 mt-3">My Profile</h2>
          <p className="text-gray-500 text-sm">Manage your personal information</p>
        </div>

        {/* Profile Form */}
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 text-sm">First Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-gray-600 text-sm">Age</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Age"
            />
          </div>

          {/* Gender Selection */}
          <div className="mt-6">
            <label className="text-gray-600 text-sm">Gender</label>
            <div className="flex space-x-4 mt-2">
              {["Male", "Female", "Other"].map((gender) => (
                <button
                  key={gender}
                  className={`w-1/3 px-4 py-2 border border-purple-500 rounded-lg text-purple-600 font-medium hover:bg-purple-100 ${
                    selectedGender === gender ? "bg-purple-600 text-white" : ""
                  }`}
                  onClick={() => setSelectedGender(gender)}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-center">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
