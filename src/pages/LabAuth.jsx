import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LabAuth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [requestedCode, setRequestedCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Simulate requesting a code from admin
  const requestAccessCode = () => {
    if (!name || !email) {
      setMessage("Please enter your name and email first to request an access code.");
      return;
    }
    // Simulated code from admin
    const generatedCode = "LAB123";
    setRequestedCode(generatedCode);
    setMessage(`Access code sent to admin. Use "${generatedCode}" to login.`);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!name || !email || !accessCode) {
      setMessage("Please enter your name, email, and access code.");
      return;
    }

    if (accessCode !== requestedCode) {
      setMessage("Invalid access code! Please request a valid code.");
      return;
    }

    // Store user for PrivateRoute
    const user = {
      name,
      email,
      role: "lab",
      isVerified: true,
    };
    localStorage.setItem("user", JSON.stringify(user));

    // Store technician info separately for LabDashboard
    const technician = {
      name,
      email,
      profilePic: null,
      password: "",
    };
    localStorage.setItem("technician", JSON.stringify(technician));

    // Redirect to LabDashboard
    navigate("/lab-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-80 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-4">
          Lab Login
        </h1>

        {/* Technician Name */}
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />

        {/* Technician Email */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />

        {/* Access Code */}
        <input
          type="text"
          placeholder="Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="border rounded-lg p-2 w-full"
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={requestAccessCode}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Request Code
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>

        {/* Message */}
        {message && <p className="text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}
