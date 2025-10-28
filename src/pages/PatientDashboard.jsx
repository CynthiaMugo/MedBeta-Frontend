// src/pages/PatientDashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  FaCog,
  FaVideo,
  FaUserMd,
  FaCalendarAlt,
  FaSearch,
  FaHistory,
  FaFlask,
  FaPills,
  FaHospital,
} from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Main Patient Dashboard Component
function PatientDashboard() {
  const storedName = localStorage.getItem("patientName") || "Patient";
  const [patientName, setPatientName] = useState(storedName);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");
  const [showSettings, setShowSettings] = useState(false);
  const mapRef = useRef(null);

  const [selectedTab, setSelectedTab] = useState("medical");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [closestHospital, setClosestHospital] = useState(null);

  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments") || "[]")
  );

  const labHistory = JSON.parse(
    localStorage.getItem("labHistory") || '["Blood Test - Normal","COVID-19 - Negative"]'
  );
  const pharmacyHistory = JSON.parse(
    localStorage.getItem("pharmacyHistory") || '["Amoxicillin","Vitamin D"]'
  );

  const hospitals = [
    { name: "Nairobi Hospital", coords: [-1.2921, 36.8219] },
    { name: "Aga Khan University Hospital", coords: [-1.2684, 36.811] },
    { name: "MP Shah Hospital", coords: [-1.2654, 36.8129] },
    { name: "Kenyatta National Hospital", coords: [-1.3001, 36.8066] },
  ];

  const doctors = {
    "Nairobi Hospital": [
      { name: "Dr. Kamau", specialty: "Cardiologist", experience: "10 years", patients: 1200, rating: 4.8, available: ["2025-10-24", "2025-10-26"] },
      { name: "Dr. Atieno", specialty: "Dermatologist", experience: "7 years", patients: 900, rating: 4.6, available: ["2025-10-25", "2025-10-28"] },
    ],
    "Aga Khan University Hospital": [
      { name: "Dr. Patel", specialty: "Neurologist", experience: "12 years", patients: 1500, rating: 4.9, available: ["2025-10-23", "2025-10-24"] },
      { name: "Dr. Amina", specialty: "Pediatrician", experience: "8 years", patients: 1100, rating: 4.7, available: ["2025-10-26", "2025-10-27"] },
    ],
  };

  // Initialize Map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", { zoomControl: true }).setView([-1.286389, 36.817223], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const patientIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        map.setView(coords, 13);
        L.marker(coords, { icon: patientIcon }).addTo(map).bindPopup("You are here");

        let minDist = Infinity;
        let closest = null;
        hospitals.forEach((h) => {
          const dist = Math.hypot(coords[0] - h.coords[0], coords[1] - h.coords[1]);
          if (dist < minDist) {
            minDist = dist;
            closest = h;
          }
          L.marker(h.coords).addTo(map).bindPopup(`<b>${h.name}</b>`);
        });
        setClosestHospital(closest);
      });
    }

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const filteredDoctors =
    selectedHospital && doctors[selectedHospital]
      ? doctors[selectedHospital].filter((doc) =>
          (doc.name + doc.specialty).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const saveSettings = () => {
    if (profilePic) localStorage.setItem("profilePic", profilePic);
    if (patientName) localStorage.setItem("patientName", patientName);
    alert("Settings saved locally.");
    setShowSettings(false);
  };

  const handleProfilePic = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setProfilePic(reader.result); localStorage.setItem("profilePic", reader.result); };
    reader.readAsDataURL(file);
  };

  const bookAppointment = (doctor, date) => {
    if (!date) return alert("Please select a date.");
    const appt = {
      id: Date.now(),
      doctor: doctor.name,
      specialty: doctor.specialty,
      hospital: selectedHospital,
      date,
    };
    const updated = [appt, ...appointments];
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    alert(`Appointment booked with ${doctor.name} on ${date}`);
    setSelectedDoctor(null);
  };

  return (
    <div className="flex min-h-screen bg-blue-900 text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-800/70 backdrop-blur-lg flex flex-col p-6 space-y-6">
        <div className="flex flex-col items-center gap-2">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-20 h-20 rounded-full ring-2 ring-blue-300 shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
              {patientName?.slice(0, 1)}
            </div>
          )}
          <h2 className="text-xl font-bold">{patientName}</h2>
          <button onClick={() => setShowSettings(true)} className="mt-2 p-2 bg-blue-700 rounded-full hover:bg-blue-600 transition z-50">
            <FaCog />
          </button>
        </div>

        <nav className="flex flex-col gap-4 mt-8">
          <SidebarItem icon={<FaHistory />} label="Medical History" active={selectedTab === "medical"} onClick={() => setSelectedTab("medical")} />
          <SidebarItem icon={<FaFlask />} label="Lab Results" active={selectedTab === "lab"} onClick={() => setSelectedTab("lab")} />
          <SidebarItem icon={<FaPills />} label="Pharmacy History" active={selectedTab === "pharmacy"} onClick={() => setSelectedTab("pharmacy")} />
          <SidebarItem icon={<FaUserMd />} label="Doctors" active={selectedTab === "doctors"} onClick={() => setSelectedTab("doctors")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto space-y-6">
        {/* Tabs content */}
        {selectedTab === "medical" && (
          <GlassCard
            title="Medical History"
            items={appointments.length ? appointments : [
              { date: "2025-10-25", doctor: "Dr. Kamau", hospital: "Nairobi Hospital", diagnosis: "Hypertension", prescription: "Lisinopril", notes: "Monitor BP daily", labResults: "Blood Test Normal", followUpDate: "2025-11-01" },
              { date: "2025-10-20", doctor: "Dr. Amina", hospital: "Aga Khan", diagnosis: "Flu", prescription: "Paracetamol", notes: "Rest and hydrate", labResults: "Rapid Flu Test Negative", followUpDate: "2025-10-27" },
            ]}
          />
        )}
        {selectedTab === "lab" && <GlassCard title="Lab Results" items={labHistory.map(l => ({ date: "2025-10-26", details: l }))} />}
        {selectedTab === "pharmacy" && <GlassCard title="Pharmacy History" items={pharmacyHistory.map(p => ({ date: "2025-10-26", details: p }))} />}

        {/* Doctors Tab */}
        {selectedTab === "doctors" && (
          <div className="bg-blue-800/40 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-blue-300">
            <h2 className="text-xl font-bold text-white mb-4">Find a Doctor</h2>

            {/* Hospital Selection */}
            <select
              className="w-full p-2 rounded-md mb-3 bg-blue-700/60 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedHospital}
              onChange={(e) => { setSelectedHospital(e.target.value); setSelectedDoctor(null); }}
            >
              <option value="">Select Hospital</option>
              {Object.keys(doctors).map((h) => <option key={h} value={h}>{h}</option>)}
            </select>

            {/* Search */}
            <div className="flex items-center border rounded-md mb-3 p-2 bg-blue-700/40">
              <FaSearch className="text-white mr-2"/>
              <input
                type="text"
                placeholder="Search doctor/specialty..."
                className="flex-1 outline-none bg-transparent text-white placeholder-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedHospital}
              />
            </div>

            {/* Doctor Cards */}
            {selectedHospital && filteredDoctors.map(doc => (
              <motion.div
                key={doc.name}
                className="p-3 mb-3 bg-blue-700/50 rounded-md shadow-md border border-blue-400 hover:bg-blue-600 transition cursor-pointer flex items-center gap-4"
                onClick={() => setSelectedDoctor(doc)}
                whileHover={{ scale: 1.02 }}
              >
                {/* Profile Pic */}
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {doc.name.split(" ")[1]?.[0] || doc.name[0]}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">{doc.name}</p>
                  <p className="text-gray-300">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-yellow-400 ${i < Math.round(doc.rating) ? "" : "text-gray-500"}`}>★</span>
                    ))}
                    <span className="text-gray-300 ml-2">{doc.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  <p>{doc.experience}</p>
                  <p>{doc.patients} patients</p>
                </div>
              </motion.div>
            ))}

            {/* Doctor Details & Booking */}
            {selectedDoctor && (
              <div className="mt-4 bg-blue-700/60 p-5 rounded-xl border border-blue-400 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                    {selectedDoctor.name.split(" ")[1]?.[0] || selectedDoctor.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedDoctor.name}</h3>
                    <p className="text-gray-300">{selectedDoctor.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-yellow-400 ${i < Math.round(selectedDoctor.rating) ? "" : "text-gray-500"}`}>★</span>
                      ))}
                      <span className="text-gray-300 ml-2">{selectedDoctor.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <ul className="list-disc list-inside text-gray-200 mt-3 space-y-1">
                  <li>Experience: {selectedDoctor.experience}</li>
                  <li>Patients treated: {selectedDoctor.patients}</li>
                </ul>

                {/* Availability */}
                <div className="mt-3">
                  <p className="text-white font-semibold mb-2">Available Dates:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.available.map(date => (
                      <button
                        key={date}
                        onClick={() => bookAppointment(selectedDoctor, date)}
                        className="px-3 py-1 bg-blue-600/70 text-white rounded hover:bg-blue-500 transition"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Map */}
        <div className="w-full h-80 rounded-lg overflow-hidden border border-blue-400">
          <div id="map" className="w-full h-full" />
        </div>
        {closestHospital && (
          <div className="mt-4 p-4 bg-blue-700/50 rounded-xl border border-blue-400">
            <div className="flex items-center gap-2">
              <FaHospital className="text-blue-300 text-2xl"/>
              <p className="text-white font-bold">Closest Hospital:</p>
            </div>
            <p className="text-gray-200">{closestHospital.name}</p>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-blue-900/80 flex items-center justify-center z-50">
          <div className="bg-blue-800 p-6 rounded-2xl shadow-xl w-96 relative backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-4">Settings</h3>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                className="w-full p-2 mt-1 rounded bg-blue-700/40 text-white"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </label>
            <label className="block mb-2">
              Profile Picture:
              <input type="file" accept="image/*" onChange={handleProfilePic} className="mt-1"/>
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Cancel</button>
              <button onClick={saveSettings} className="px-4 py-2 bg-blue-400 text-black rounded hover:bg-blue-300">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${active ? "bg-blue-700 text-white" : "hover:bg-blue-800/50 text-gray-300"}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

// GlassCard Component
function GlassCard({ title, items }) {
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <motion.div className="bg-blue-700/40 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-blue-400 hover:scale-105 transition-all duration-300">
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-300 text-sm">No records yet.</p>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {items.map((i, idx) => (
            <li
              key={idx}
              className="p-2 bg-blue-700/20 rounded-md border border-blue-400 cursor-pointer"
              onClick={() => toggleExpand(idx)}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-white">{i.date} - {i.doctor || i.details} {i.hospital ? `@ ${i.hospital}` : ""}</p>
                <span>{expandedId === idx ? "▲" : "▼"}</span>
              </div>
              {expandedId === idx && (
                <div className="mt-2 text-xs space-y-1 text-gray-300">
                  {i.diagnosis && <p><strong>Diagnosis:</strong> {i.diagnosis}</p>}
                  {i.prescription && <p><strong>Prescription:</strong> {i.prescription}</p>}
                  {i.notes && <p><strong>Notes:</strong> {i.notes}</p>}
                  {i.labResults && <p><strong>Lab Results:</strong> {i.labResults}</p>}
                  {i.followUpDate && <p><strong>Follow-up:</strong> {i.followUpDate}</p>}
                  {i.details && <p><strong>Details:</strong> {i.details}</p>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default PatientDashboard;
