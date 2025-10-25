// src/pages/HospitalAuth.jsx
import React, { useState } from "react";
import { User, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HospitalAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [tokenRequested, setTokenRequested] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ----- Handlers -----
  const handleLogin = () => {
    if (!name.trim() || !email.trim() || !accessCode.trim()) {
      setMessage("All fields are required to access the dashboard.");
      return;
    }

    const hospitalUser = {
      name: name.trim(),
      email: email.trim(),
      accessCode: accessCode.trim(),
      role: "hospital",
      profilePic,
      isVerified: true,
    };

    localStorage.setItem("user", JSON.stringify(hospitalUser));

    // Redirect to Hospital Dashboard
    navigate("/hospital-dashboard");
  };

  const handleProfilePic = (e) => {
    setProfilePic(URL.createObjectURL(e.target.files[0]));
  };

  const requestToken = () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Please enter your name and email to request a token.");
      return;
    }
    alert(`Access token requested for ${name} (${email})`);
    setTokenRequested(true);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">Hospital Staff Login</h2>

        {/* Name */}
        <div className="flex items-center border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 outline-none">
          <User size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ml-2 w-full outline-none text-gray-700"
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 outline-none">
          <User size={20} className="text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ml-2 w-full outline-none text-gray-700"
          />
        </div>

        {/* Access Code */}
        <div className="flex items-center border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 outline-none">
          <input
            type="password"
            placeholder="Access Code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="ml-2 w-full outline-none text-gray-700"
          />
        </div>

        {/* Profile Pic */}
        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-xl cursor-pointer hover:bg-blue-200">
          <UploadCloud size={18} /> Upload Profile Picture
          <input type="file" className="hidden" onChange={handleProfilePic} />
        </label>

        {/* Request Token */}
        <button
          type="button"
          onClick={requestToken}
          disabled={tokenRequested}
          className={`w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition ${
            tokenRequested ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {tokenRequested ? "Token Requested" : "Request Access Token"}
        </button>

        {/* Login */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          Access Dashboard
        </button>

        {message && <p className="text-red-600 text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
export default HospitalAuth;