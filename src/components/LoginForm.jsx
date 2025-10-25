// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ role }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!id || !name) return alert("Enter ID and name");

    // Ensure role first letter matches
    if (!id.toLowerCase().startsWith(role[0])) {
      return alert(`ID must start with ${role[0].toUpperCase()}`);
    }

    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);
    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="p-6 rounded-xl shadow bg-white max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4">{role?.toUpperCase()} Login</h2>
      <input
        type="text"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-teal-400 text-white p-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
