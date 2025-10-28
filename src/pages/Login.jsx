import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (
      savedUser &&
      savedUser.email === form.email &&
      savedUser.password === form.password
    ) {
      localStorage.setItem("jwt", "fake-jwt-token");

      const dashboardRoutes = {
        patient: "/patient/dashboard",
        doctor: "/doctor/dashboard",
        lab: "/lab/dashboard",
        pharmacist: "/pharmacist/dashboard",
        admin: "/admin/dashboard",
        hospital: "/hospital/dashboard",
      };
      navigate(dashboardRoutes[savedUser.role]);
    } else {
      alert("Invalid credentials or user not found!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
