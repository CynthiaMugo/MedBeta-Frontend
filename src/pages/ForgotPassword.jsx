import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email.");

    try {
      setLoading(true);
      await axios.put(`${API_URL}/auth/reset-password`, { email });
      alert(" Password reset link sent! Check your email.");
      navigate("/"); // or navigate("/login") if you want to go back there
    } catch (error) {
      console.error("Forgot password error:", error);
      alert(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Forgot Password
          </h2>

          <p className="text-gray-600 text-center mb-6 text-sm">
            Enter your registered email address and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/auth")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Go back to Login
            </span>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
