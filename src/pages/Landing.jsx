// src/pages/Landing.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, Zap, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Top Nav */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-gray-800">MedBeta</div>
        <nav className="flex gap-6 items-center">
          <a href="#home" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </a>
          {/* Removed Login and Sign Up */}
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-24 gap-12 relative"
      >
        {/* Background accent */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-blue-100/20 rounded-3xl"></div>

        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl text-center md:text-left z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
            Smart, Secure & Real-Time Health Care Records
          </h1>
          <p className="text-gray-700 mb-8 text-lg md:text-xl">
            Access patient medical history securely from any healthcare facility,
            ensuring better continuity of care.
          </p>
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:bg-blue-700 transition"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-md relative z-10"
        >
          <motion.img
            src="/doctor-illustration.png"
            alt="2D Cartoon Doctor Illustration"
            className="w-full drop-shadow-2xl rounded-2xl"
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <div className="absolute -z-10 top-6 right-6 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-60"></div>
        </motion.div>
      </section>

      {/* Feature Highlights */}
      <section
        id="features"
        className="flex flex-col md:flex-row justify-center gap-8 px-8 md:px-24 py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md text-center w-64 hover:shadow-lg transition"
        >
          <Lock size={32} className="text-blue-400 mb-4" />
          <h3 className="font-semibold text-gray-800 mb-2">
            Secure Cloud Storage
          </h3>
          <p className="text-gray-600 text-sm">
            End-to-end encryption for patient data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md text-center w-64 hover:shadow-lg transition"
        >
          <Zap size={32} className="text-blue-400 mb-4" />
          <h3 className="font-semibold text-gray-800 mb-2">Real-Time Updates</h3>
          <p className="text-gray-600 text-sm">
            Instantly sync new diagnosis and treatments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md text-center w-64 hover:shadow-lg transition"
        >
          <FileText size={32} className="text-blue-400 mb-4" />
          <h3 className="font-semibold text-gray-800 mb-2">
            Cross-Hospital Access
          </h3>
          <p className="text-gray-600 text-sm">
            View records from any connected facility.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        &copy; 2025 MedBeta. All rights reserved.
      </footer>
    </div>
  );
}
