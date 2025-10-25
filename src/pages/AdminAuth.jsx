// src/pages/AdminAuth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

export default function AdminAuth() {
  const navigate = useNavigate();

  // ----- State -----
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tokenRequested, setTokenRequested] = useState(false);
  const [message, setMessage] = useState("");

  // ----- Handlers -----
  const handleLogin = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    // --- Set admin session in localStorage ---
    const adminUser = {
      name: name.trim(),
      email: email.trim(),
      role: "admin",
      isVerified: true,
    };
    localStorage.setItem("user", JSON.stringify(adminUser));
    localStorage.setItem("adminUser", JSON.stringify(adminUser));

    // --- Navigate to admin dashboard ---
    navigate("/admin-dashboard");
  };

  const requestToken = () => {
    if (!name.trim() || !email.trim()) {
      setMessage("Please provide your name and email to request a token.");
      return;
    }
    alert(`Access token requested for ${name} (${email})`);
    setTokenRequested(true);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center border-t-4 border-blue-700">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Admin Login</h2>

        {/* Name */}
        <div className="flex items-center border rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
          <User size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ml-2 w-full outline-none text-gray-700"
          />
        </div>

        {/* Email */}
        <div className="flex items-center border rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
          <User size={20} className="text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ml-2 w-full outline-none text-gray-700"
          />
        </div>

        {/* Password */}
        <div className="flex items-center border rounded-lg px-3 py-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
          <Lock size={20} className="text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ml-2 w-full outline-none text-gray-700"
          />
        </div>

        {/* Request Token Button */}
        <button
          type="button"
          onClick={requestToken}
          disabled={tokenRequested}
          className={`w-full mb-4 bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition ${
            tokenRequested ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {tokenRequested ? "Token Requested" : "Request Access Token"}
        </button>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition"
        >
          Login
        </button>

        {/* Message */}
        {message && <p className="text-red-600 text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}

