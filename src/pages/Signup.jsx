// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForgot(false);
    setError("");
  };

  const getRoleByEmail = (email) => {
    if (email.includes("doctor")) return "doctor";
    if (email.includes("lab")) return "lab";
    if (email.includes("pharma")) return "pharmacist";
    if (email.includes("admin")) return "admin";
    if (email.includes("hospital")) return "hospital";
    return "patient";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const role = getRoleByEmail(form.email);
      const user = { ...form, role, isVerified: true };
      localStorage.setItem("user", JSON.stringify(user));

      const redirects = {
        patient: "/patient-dashboard",
        doctor: "/doctor-dashboard",
        lab: "/lab-dashboard",
        pharmacist: "/pharmacist-dashboard",
        admin: "/admin-dashboard",
        hospital: "/hospital-dashboard",
      };

      navigate(redirects[role]);
    } catch {
      setError("Action failed. Please try again.");
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Animated Background Panel */}
      <motion.div
        initial={false}
        animate={{
          x: isLogin ? "100%" : "0%",
          background: isLogin
            ? "linear-gradient(to bottom right, #00bfff, #0066ff)"
            : "linear-gradient(to bottom right, #7e22ce, #9333ea)",
        }}
        transition={{
          duration: 1.2,
          ease: [0.77, 0, 0.175, 1],
        }}
        className="absolute top-0 left-0 h-full w-1/2 md:w-1/2 hidden md:block rounded-r-3xl shadow-2xl"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center justify-center h-full text-white px-8"
        >
          <h1 className="text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
            {isLogin ? "Welcome Back to" : "Join"}{" "}
            <span className="text-yellow-300">MedBeta</span>
          </h1>
          <p className="text-lg text-center max-w-md leading-relaxed">
            {isLogin
              ? "Access your MedBeta account and manage your healthcare data securely."
              : "MedBeta connects doctors, labs, pharmacies, and hospitals in one intelligent ecosystem."}
          </p>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="mt-10 text-sm uppercase tracking-widest font-semibold text-yellow-200"
          >
            {isLogin ? "Let’s get you signed in" : "Get started today!"}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Section: Auth Forms */}
      <div className="flex flex-1 items-center justify-center z-10 bg-white">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-10 rounded-2xl shadow-2xl w-96"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
            {isLogin ? "Login to MedBeta" : "Create a MedBeta Account"}
          </h2>

          {error && (
            <p className="text-red-600 text-sm text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.email}
              onChange={handleChange}
              required
            />

            {!forgot && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={form.password}
                onChange={handleChange}
                required
              />
            )}

            {/* Forgot Password Field */}
            <AnimatePresence>
              {forgot && (
                <motion.input
                  key="reset"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  type="email"
                  name="resetEmail"
                  placeholder="Enter your email to reset password"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold transition-all duration-200"
            >
              {forgot ? "Send Reset Link" : isLogin ? "Login" : "Sign Up"}
            </motion.button>

            <div className="text-center mt-4 text-sm text-gray-600">
              {isLogin ? (
                <>
                  <button
                    type="button"
                    onClick={() => setForgot(!forgot)}
                    className="text-blue-500 hover:underline"
                  >
                    {forgot ? "Back to Login" : "Forgot Password?"}
                  </button>
                  <p className="mt-3">
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-purple-600 hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-purple-600 hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
