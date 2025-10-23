import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorAuth() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "doctor") {
      navigate("/doctors-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ role: "doctor", name: form.name }));
    navigate("/doctors-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-400 to-teal-600 text-gray-900">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-teal-600">Doctor Portal</h1>
        <p className="text-center text-gray-500 mb-6">Sign up or log in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-teal-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-teal-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-teal-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
