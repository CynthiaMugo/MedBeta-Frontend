// src/pages/PharmacistDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Pill,
  ClipboardList,
  LogOut,
  User,
  Sun,
  Moon,
  CheckCircle,
  Clock,
} from "lucide-react";

// Dummy prescription data
const initialPrescriptions = [
  { id: 1, patient: "Patient A", medication: "Paracetamol", doctor: "Dr. John Doe", pharmacist: "Alice", status: "Done" },
  { id: 2, patient: "Patient B", medication: "Ibuprofen", doctor: "Dr. Jane Smith", pharmacist: null, status: "Pending" },
  { id: 3, patient: "Patient C", medication: "Amoxicillin", doctor: "Dr. John Doe", pharmacist: "Bob", status: "Done" },
];

export default function PharmacistDashboard() {
  const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem("pharmaLoggedIn")) || false);
  const [nameInput, setNameInput] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [pharmacist, setPharmacist] = useState(JSON.parse(localStorage.getItem("pharmacist")) || { name: "", profilePic: null });
  const [prescriptions, setPrescriptions] = useState(JSON.parse(localStorage.getItem("prescriptions")) || initialPrescriptions);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "blue");

  useEffect(() => localStorage.setItem("pharmacist", JSON.stringify(pharmacist)), [pharmacist]);
  useEffect(() => localStorage.setItem("pharmaLoggedIn", JSON.stringify(loggedIn)), [loggedIn]);
  useEffect(() => localStorage.setItem("prescriptions", JSON.stringify(prescriptions)), [prescriptions]);
  useEffect(() => localStorage.setItem("theme", theme), [theme]);

  // Handlers
  const handleLogin = () => {
    if (!nameInput.trim()) return alert("Enter your name!");
    setPharmacist({ name: nameInput, profilePic });
    setLoggedIn(true);
  };

  const handleProfilePic = (e) => {
    setProfilePic(URL.createObjectURL(e.target.files[0]));
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setNameInput("");
    setProfilePic(null);
    setPharmacist({ name: "", profilePic: null });
  };

  const toggleTheme = () => setTheme(theme === "blue" ? "black" : "blue");

  const markDone = (id) => {
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: "Done", pharmacist: pharmacist.name } : p
      )
    );
  };

  // ----- LOGIN PAGE -----
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400">
        <div className="bg-white text-gray-800 p-10 rounded-3xl shadow-2xl w-96 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center text-blue-700">Pharmacist Login</h2>
          <input
            type="text"
            placeholder="Enter your full name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="border border-blue-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-xl cursor-pointer hover:bg-blue-200">
            Upload Profile Picture
            <input type="file" className="hidden" onChange={handleProfilePic} />
          </label>
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // ----- DASHBOARD -----
  const themeClasses = theme === "blue" ? "bg-blue-50 text-gray-900" : "bg-gray-900 text-white";

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* HEADER */}
      <header className={`flex justify-between items-center p-6 shadow-md ${theme === "blue" ? "bg-blue-600 text-white" : "bg-gray-900 text-white"}`}>
        <h1 className="text-2xl font-bold">Pharmacist Dashboard</h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="flex items-center gap-2 bg-white text-blue-700 px-3 py-1 rounded-xl hover:bg-gray-200 transition">
            {theme === "blue" ? <Sun size={16} /> : <Moon size={16} />} Theme
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="p-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* PROFILE PANEL */}
        <div className="bg-gradient-to-b from-blue-400 to-blue-200 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition">
          {pharmacist.profilePic ? (
            <img src={pharmacist.profilePic} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white mb-4" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-4 border-4 border-white">
              <User size={40} className="text-blue-500" />
            </div>
          )}
          <h2 className="font-bold text-xl">{pharmacist.name}</h2>
          <label className="mt-4 px-4 py-2 bg-white text-blue-700 rounded-xl cursor-pointer hover:bg-blue-100 flex items-center gap-2">
            Upload Picture
            <input type="file" className="hidden" onChange={handleProfilePic} />
          </label>
        </div>

        {/* PRESCRIPTION QUEUE */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="text-orange-500 w-8 h-8" />
            <h2 className="text-xl font-semibold">Prescription Queue</h2>
          </div>
          <ul className="space-y-3">
            {prescriptions.filter(p => p.status === "Pending").map((p) => (
              <li key={p.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                <div>
                  <span className="font-semibold">{p.patient}</span> - {p.medication} <span className="text-gray-500">({p.doctor})</span>
                </div>
                <button
                  onClick={() => markDone(p.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition"
                >
                  <CheckCircle size={16} /> Done
                </button>
              </li>
            ))}
            {prescriptions.filter(p => p.status === "Pending").length === 0 && (
              <li className="text-gray-500 text-center py-4">No pending prescriptions</li>
            )}
          </ul>
        </div>

        {/* MEDICATION HISTORY */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition col-span-4 mt-6 lg:mt-0">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="text-yellow-500 w-8 h-8" />
            <h2 className="text-xl font-semibold">Medication History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-blue-100 rounded-xl">
                <tr>
                  <th className="px-4 py-2 text-left">Patient</th>
                  <th className="px-4 py-2 text-left">Medication</th>
                  <th className="px-4 py-2 text-left">Doctor</th>
                  <th className="px-4 py-2 text-left">Pharmacist</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2">{p.patient}</td>
                    <td className="px-4 py-2">{p.medication}</td>
                    <td className="px-4 py-2">{p.doctor}</td>
                    <td className="px-4 py-2">{p.pharmacist || "Unassigned"}</td>
                    <td className="px-4 py-2">
                      {p.status === "Done" ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <CheckCircle size={16} /> Done
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600 font-semibold">
                          <Clock size={16} /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
