import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, Zap, FileText } from "lucide-react";

export default function Landing() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Top Nav */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        <div className="text-2xl font-bold text-gray-800">MedBeta</div>
        <nav className="flex gap-6 items-center">
          <button
            onClick={() => setActiveSection("home")}
            className={`text-gray-700 hover:text-blue-600 transition ${
              activeSection === "home" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveSection("features")}
            className={`text-gray-700 hover:text-blue-600 transition ${
              activeSection === "features" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className={`text-gray-700 hover:text-blue-600 transition ${
              activeSection === "contact" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Main Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-16 gap-12 relative flex-grow">
        {/* Left Side Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-center md:text-left z-10"
        >
          {activeSection === "home" && (
            <>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
                Smart, Secure & Real-Time Health Care Records
              </h1>
              <p className="text-gray-700 mb-8 text-lg md:text-xl">
                MedBeta is a next-generation platform enabling hospitals and doctors
                to securely access, update, and share medical data instantly — ensuring
                seamless patient care anywhere, anytime.
              </p>

              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:bg-blue-700 transition"
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          )}

          {activeSection === "features" && (
            <>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Key Features</h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                MedBeta empowers healthcare facilities with cutting-edge digital
                solutions that ensure efficiency, privacy, and seamless interoperability
                between systems.
              </p>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <Lock size={28} className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Secure Cloud Storage
                    </h4>
                    <p className="text-gray-600 text-sm">
                      End-to-end encryption protects patient data — accessible only
                      by authorized professionals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap size={28} className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Real-Time Updates
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Get instant notifications of new diagnoses, prescriptions,
                      and medical events as they happen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText size={28} className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Cross-Hospital Access
                    </h4>
                    <p className="text-gray-600 text-sm">
                      View and manage patient records securely across multiple
                      hospitals and departments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText size={28} className="text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      AI-Powered Analytics
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Gain insights on patient trends and hospital performance
                      through real-time analytics dashboards.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "contact" && (
            <>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Get in Touch With Us
              </h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Have a question or need help? Reach out to our support team. We’re
                here to assist you in transforming healthcare through technology.
              </p>

              <form className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">Phone</label>
                  <div className="flex">
                    <select className="border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      className="border-t border-b border-r border-gray-300 rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                  Send Message
                </motion.button>
              </form>
            </>
          )}
        </motion.div>

        {/* Right Illustration (Remains Visible) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md relative z-10"
        >
          <motion.img
            src="/doctor-illustration.png"
            alt="Doctor Illustration"
            className="w-full drop-shadow-2xl rounded-2xl"
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <div className="absolute -z-10 top-6 right-6 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-60"></div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6 mt-auto">
        <p className="text-lg font-medium">Join the Future of Healthcare Data</p>
        <p className="text-sm mt-2 opacity-90">
          &copy; 2025 MedBeta. Empowering digital health transformation worldwide.
        </p>
        <p className="text-sm mt-1">
           Email: support@medbeta.io |  www.medbeta.io
        </p>
      </footer>
    </div>
  );
}
