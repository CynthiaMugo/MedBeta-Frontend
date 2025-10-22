// src/pages/PatientAuth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Save patient info (mock)
    localStorage.setItem("userRole", "patient");
    localStorage.setItem("userName", name);

    // Navigate to patient portal
    navigate("/patient-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0a0f24] to-[#08112a] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#08112a] border border-[#00f0ff] shadow-[0_0_30px_#00f0ff]">
        <h2 className="text-4xl font-extrabold text-[#00f0ff] text-center mb-6 animate-pulse">
          Patient Sign Up
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0a0f24] border border-[#00f0ff] text-[#e0f7ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0a0f24] border border-[#00f0ff] text-[#e0f7ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0a0f24] border border-[#00f0ff] text-[#e0f7ff] focus:outline-none focus:ring-2 focus:ring-[#00f0ff]"
          />

          <button
            onClick={handleSignup}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold shadow-[0_0_20px_#00f0ff] hover:shadow-[0_0_40px_#00f0ff] transition duration-300"
          >
            Sign Up
          </button>
        </div>

        <p className="text-sm text-[#00f0ff] mt-4 text-center">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer hover:text-white"
            onClick={() => navigate("/auth")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
