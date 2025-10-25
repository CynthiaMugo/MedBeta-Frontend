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

export default function PatientDashboard() {
  const storedName = localStorage.getItem("patientName") || "Patient";
  const [patientName, setPatientName] = useState(storedName);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [nextOfKin, setNextOfKin] = useState(
    JSON.parse(localStorage.getItem("nextOfKin") || '{"name":"","id":""}')
  );
  const [password, setPassword] = useState("");

  const mapRef = useRef(null);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [closestHospital, setClosestHospital] = useState(null);

  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments") || "[]")
  );
  const [labHistory, setLabHistory] = useState(
    JSON.parse(localStorage.getItem("labHistory") || '["Blood Test - Normal","COVID-19 - Negative"]')
  );
  const [pharmacyHistory, setPharmacyHistory] = useState(
    JSON.parse(localStorage.getItem("pharmacyHistory") || '["Amoxicillin","Vitamin D"]')
  );

  const hospitals = [
    { name: "Nairobi Hospital", coords: [-1.2921, 36.8219] },
    { name: "Aga Khan University Hospital", coords: [-1.2684, 36.811] },
    { name: "MP Shah Hospital", coords: [-1.2654, 36.8129] },
    { name: "Kenyatta National Hospital", coords: [-1.3001, 36.8066] },
  ];

  const doctors = {
    "Nairobi Hospital": [
      { name: "Dr. Kamau", specialty: "Cardiologist", available: ["2025-10-24", "2025-10-26"] },
      { name: "Dr. Atieno", specialty: "Dermatologist", available: ["2025-10-25", "2025-10-28"] },
    ],
    "Aga Khan": [
      { name: "Dr. Patel", specialty: "Neurologist", available: ["2025-10-23", "2025-10-24"] },
      { name: "Dr. Amina", specialty: "Pediatrician", available: ["2025-10-26", "2025-10-27"] },
    ],
  };

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

        // Determine closest hospital
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
    localStorage.setItem("nextOfKin", JSON.stringify(nextOfKin));
    if (profilePic) localStorage.setItem("profilePic", profilePic);
    if (patientName) localStorage.setItem("patientName", patientName);
    if (password) localStorage.setItem("userPassword", password);
    alert("Settings saved locally.");
    setShowSettings(false);
  };

  const bookAppointment = (doctor, date, hospitalName) => {
    const appt = { id: Date.now(), doctor: doctor.name, specialty: doctor.specialty, hospital: hospitalName, date };
    const next = [appt, ...appointments];
    setAppointments(next);
    localStorage.setItem("appointments", JSON.stringify(next));
    alert(`Appointment booked with ${doctor.name} on ${date}`);
    setShowBookModal(false);
    setSelectedDoctor(null);
  };

  const openBook = (doc, hospitalName) => { setSelectedDoctor({ ...doc, hospital: hospitalName }); setShowBookModal(true); };
  const handleProfilePic = (e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { setProfilePic(reader.result); localStorage.setItem("profilePic", reader.result); }; reader.readAsDataURL(file); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 text-gray-800 flex flex-col">
      <header className="flex justify-between items-center p-6 shadow-md bg-white/70 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Patient Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {patientName}</p>
        </div>

        <div className="flex items-center gap-4">
          <label className="relative">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-white shadow" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">{patientName?.slice(0,1)}</div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProfilePic}/>
          </label>
          <button onClick={() => setShowSettings(true)} className="p-2 bg-white/30 hover:bg-white/40 rounded-full transition">
            <FaCog className="text-blue-700 text-2xl" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="Medical History" icon={<FaHistory />} items={appointments.map(a => `${a.doctor} @ ${a.hospital} (${a.date})`)} />
          <Card title="Lab Results" icon={<FaFlask />} items={labHistory} />
          <Card title="Pharmacy History" icon={<FaPills />} items={pharmacyHistory} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Find a Doctor</h2>
            <select className="w-full p-2 rounded-md border mb-3" value={selectedHospital} onChange={e => { setSelectedHospital(e.target.value); setSelectedDoctor(null); }}>
              <option value="">Select Hospital</option>
              {Object.keys(doctors).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <div className="flex items-center border rounded-md mb-3 p-2">
              <FaSearch className="text-blue-700 mr-2"/>
              <input type="text" placeholder="Search doctor/specialty..." className="flex-1 outline-none bg-transparent text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} disabled={!selectedHospital}/>
            </div>
            {selectedHospital && filteredDoctors.map(doc => (
              <div key={doc.name} className="p-3 mb-3 bg-white rounded-md shadow-sm border hover:bg-blue-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-blue-800"><FaUserMd className="inline mr-2"/>{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.specialty}</p>
                  </div>
                  <div className="flex flex-col gap-2 w-36">
                    <button onClick={() => openBook(doc, selectedHospital)} className="w-full bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700 text-sm"><FaCalendarAlt className="inline mr-2"/>Book</button>
                    <button onClick={() => alert(`Calling ${doc.name}`)} className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700 text-sm"><FaVideo className="inline mr-2"/>Call</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {closestHospital && <div className="bg-white/80 p-4 rounded-xl shadow-md flex items-center gap-3">
              <FaHospital className="text-blue-700 text-2xl"/>
              <div>
                <p className="font-semibold text-blue-800">Closest Hospital:</p>
                <p className="text-gray-600">{closestHospital.name}</p>
              </div>
            </div>}
            <div className="bg-white/60 rounded-xl p-2 shadow-md">
              <div id="map" className="w-full h-[240px] rounded-lg border border-blue-200"/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Small reusable card
function Card({ title, icon, items }) {
  return (
    <section className="bg-white/70 p-5 rounded-xl shadow-md backdrop-blur-sm">
      <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-3">{icon} {title}</h2>
      {items.length === 0 ? <p className="text-sm text-gray-600">No records yet.</p> :
        <ul className="text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto">
          {items.map((i, idx) => <li key={idx} className="p-2 bg-white rounded-md border">{i}</li>)}
        </ul>
      }
    </section>
  );
}
