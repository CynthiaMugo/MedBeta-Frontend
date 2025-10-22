import React, { useState, useEffect } from "react";
import { Pill, ClipboardList, Bell, LogOut, User, Sun, Moon } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-blue-500">
        <div className="bg-blue-100 p-8 rounded-2xl shadow-lg w-80 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Welcome</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full mb-4"
          />
          <label className="block mb-4 text-blue-900 cursor-pointer">
            Upload Profile Picture
            <input type="file" className="hidden" onChange={handleProfilePic} />
          </label>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // ----- DASHBOARD -----
  const themeClasses = theme === "blue" ? "bg-blue-50 text-blue-900" : "bg-gray-900 text-white";

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* HEADER */}
      <header className={`py-6 px-8 flex justify-between items-center shadow-lg ${theme === "blue" ? "bg-blue-600 text-white" : "bg-gray-900 text-white"}`}>
        <h1 className="text-2xl font-bold">Pharmacist Dashboard</h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white text-blue-700 hover:bg-gray-200">
            {theme === "blue" ? <Sun size={16} /> : <Moon size={16} />}
            Theme
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center">
          <h2 className="font-semibold text-lg mb-3">Your Profile</h2>
          {pharmacist.profilePic ? (
            <img src={pharmacist.profilePic} alt="Profile" className="w-24 h-24 rounded-full mb-3 object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <User size={36} className="text-gray-400" />
            </div>
          )}
          <span className="font-semibold">{pharmacist.name}</span>
          <label className="mt-3 cursor-pointer px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center gap-2">
            Upload Picture
            <input type="file" className="hidden" onChange={handleProfilePic} />
          </label>
        </div>

        {/* Prescription Queue */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition col-span-3">
          <Pill className="text-orange-600 w-10 h-10 mb-3" />
          <h2 className="font-semibold text-lg mb-2">Prescription Queue</h2>
          <p className="text-gray-600 mb-3">View and fulfill prescriptions sent by doctors.</p>
          <ul className="text-gray-700">
            {prescriptions.filter(p => p.status === "Pending").map((p) => (
              <li key={p.id} className="mb-2 flex justify-between items-center border-b py-1">
                <span>{p.patient} - {p.medication} ({p.doctor})</span>
                <button
                  onClick={() => markDone(p.id)}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                >
                  Done
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Medication History */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition col-span-4">
          <ClipboardList className="text-yellow-600 w-10 h-10 mb-3" />
          <h2 className="font-semibold text-lg mb-2">Medication History</h2>
          <p className="text-gray-600 mb-3">Past prescriptions handled by any pharmacist.</p>
          <ul className="text-gray-700">
            {prescriptions.map((p) => (
              <li key={p.id} className="mb-2 flex justify-between items-center border-b py-1">
                <span>
                  {p.patient} - {p.medication} ({p.doctor}) by {p.pharmacist || "Unassigned"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
