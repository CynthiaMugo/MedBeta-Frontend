import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_URL } from "../config";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await axios.post(`${API_URL}${endpoint}`, formData);

      //token and role now come from backend
      const token = response.data.token;
      const role = response.data.role;
      const user_id = response.data.user_id;
      const hospital_id = response.data.hospital_id || null;

      if (token) {
        // Save token and user info
        localStorage.setItem("token", token);
        const userData = { token, role, user_id, hospital_id };
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on role
        switch (role) {
          case "superadmin":
            navigate("/superadmin/dashboard");
            break;
          case "hospital":
          case "hospital_admin":
            navigate("/hospital/dashboard");
            break;
          case "doctor":
            navigate("/doctor/dashboard");
            break;
          case "technician":
          case "labtech":
            navigate("/technician/dashboard");
            break;
          case "pharmacist":
            navigate("/pharmacist/dashboard");
            break;
          case "patient":
            navigate("/patient/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.response?.data?.error || "Something went wrong!");
=======
  e.preventDefault();
  try {
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const response = await axios.post(`${API_URL}${endpoint}`, formData);

    // Your backend returns "token" for registration
    const token = response.data.token || response.data.access_token;

    if (token) {
      // Save token
      localStorage.setItem("token", token);

      // Decode role
      const decoded = jwtDecode(token);
      const role = decoded?.role || decoded?.sub?.role;

      // Redirect based on role
      if (role === "superadmin") navigate("/superadmin/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "technician") navigate("/technician/dashboard");
      else if (role === "patient") navigate("/patient/dashboard");
      else if (role === "hospital") navigate("/hospital/dashboard");
      else if (role === "pharmacist") navigate("/pharmacy/dashboard");
      else if (role === "hospital_admin") navigate ("/hospital/dashboard");
      else navigate("/");
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) return alert("Please enter your email first.");
    try {
      await axios.put(`${API_URL}/auth/reset-password`, {
        email: formData.email,
      });
      alert("Password reset link sent! Check your email.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error sending reset link");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full"
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>

          {/* Toggle Login/Sign Up */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-l-md ${
                isLogin ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-r-md ${
                !isLogin
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring focus:ring-blue-200"
                required
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {isLogin && (
              <p
                className="text-right text-sm text-blue-600 hover:underline cursor-pointer"
                onClick={() => handleForgotPassword()}
              >
                Forgot Password?
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
            >
              {isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            <a href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </a>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}