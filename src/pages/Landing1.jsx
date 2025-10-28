// src/pages/Landing.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, Zap, FileText, Heart, Mail } from "lucide-react";
import { API_URL } from "../config";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col scroll-smooth">
      {/* Top Nav */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        <div className="text-2xl font-bold text-gray-800">MedBeta</div>
        <nav className="flex gap-6 items-center">
          <a href="#home" className="text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#features" className="text-gray-700 hover:text-blue-600">
            Features
          </a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">
            About
          </a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-24 gap-12 relative"
      >
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

      {/* Features Section */}
      <section
        id="features"
        className="flex flex-col md:flex-row justify-center gap-8 px-8 md:px-24 py-12"
      >
        {[
          {
            icon: Lock,
            title: "Secure Cloud Storage",
            text: "End-to-end encryption for patient data.",
          },
          {
            icon: Zap,
            title: "Real-Time Updates",
            text: "Instantly sync new diagnosis and treatments.",
          },
          {
            icon: FileText,
            title: "Cross-Hospital Access",
            text: "View records from any connected facility.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md text-center w-64 hover:shadow-lg transition"
          >
            <feature.icon size={32} className="text-blue-400 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.text}</p>
          </motion.div>
        ))}
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white px-8 md:px-24 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-blue-700 mb-6"
        >
          About MedBeta
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-700 max-w-3xl mx-auto leading-relaxed text-lg"
        >
          MedBeta is built with one vision — to connect healthcare facilities,
          doctors, and patients through technology that’s secure, efficient, and
          reliable. We streamline communication and record access so providers
          can focus on what truly matters: patient care.
        </motion.p>
        {/* <div className="flex justify-center mt-8">
          <Heart className="text-red-400" size={32} />
        </div> */}
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-blue-50 px-8 md:px-24 text-center"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-blue-700 mb-6"
        >
          Contact Us
        </motion.h2>
        <p className="text-gray-600 mb-8">
          Got questions or want to collaborate? Reach out and we'll get back to
          you soon.
        </p>

        <form className="max-w-lg mx-auto space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        <div className="flex justify-center gap-4 mt-8 text-gray-600">
          <Mail size={20} />
          <p>contact@medbeta.health</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        &copy; 2025 MedBeta. All rights reserved.
      </footer>
    </div>
  );
}
