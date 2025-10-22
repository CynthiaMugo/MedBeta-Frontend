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
} from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function PatientDashboard() {
  // user info
  const storedName = localStorage.getItem("patientName") || "Patient";
  const [patientName, setPatientName] = useState(storedName);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");

  // settings & security
  const [showSettings, setShowSettings] = useState(false);
  const [nextOfKin, setNextOfKin] = useState(
    JSON.parse(localStorage.getItem("nextOfKin") || '{"name":"","id":""}')
  );
  const [password, setPassword] = useState(""); // demo: store plain in localStorage (not for production)

  // map
  const mapRef = useRef(null);

  // doctors & search/filter
  const [selectedHospital, setSelectedHospital] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);

  // appointments, lab, pharmacy histories (persisted)
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments") || "[]")
  );
  const [labHistory, setLabHistory] = useState(
    JSON.parse(
      localStorage.getItem(
        "labHistory"
      ) || '["Blood Test (2025-09-10) - Normal","COVID-19 (2025-08-01) - Negative"]'
    )
  );
  const [pharmacyHistory, setPharmacyHistory] = useState(
    JSON.parse(
      localStorage.getItem(
        "pharmacyHistory"
      ) || '["Amoxicillin - 10 days (2025-09-11)","Vitamin D - 30 days (2025-08-15)"]'
    )
  );

  // sample hospitals & doctors (keeps your filters unchanged)
  const hospitals = {
    "Nairobi Hospital": [
      { name: "Dr. Kamau", specialty: "Cardiologist", available: ["2025-10-24", "2025-10-26"] },
      { name: "Dr. Atieno", specialty: "Dermatologist", available: ["2025-10-25", "2025-10-28"] },
    ],
    "Aga Khan": [
      { name: "Dr. Patel", specialty: "Neurologist", available: ["2025-10-23", "2025-10-24"] },
      { name: "Dr. Amina", specialty: "Pediatrician", available: ["2025-10-26", "2025-10-27"] },
    ],
    "Mater Hospital": [
      { name: "Dr. Ochieng", specialty: "Orthopedic", available: ["2025-10-25", "2025-10-28"] },
      { name: "Dr. Wanjiru", specialty: "Gynecologist", available: ["2025-10-24", "2025-10-26"] },
    ],
  };

  // init leaflet map once
  useEffect(() => {
    // avoid reinit
    if (mapRef.current) return;

    const map = L.map("map", { zoomControl: true }).setView([-1.286389, 36.817223], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const patientIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

    // optionally use current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          map.setView(coords, 13);
          L.marker(coords, { icon: patientIcon }).addTo(map).bindPopup("You are here");
        },
        () => {
          // fallback default marker
          L.marker([-1.286389, 36.817223], { icon: patientIcon })
            .addTo(map)
            .bindPopup("Default location");
        },
        { enableHighAccuracy: true }
      );
    } else {
      L.marker([-1.286389, 36.817223], { icon: patientIcon }).addTo(map).bindPopup("You are here");
    }

    // add hospital markers
    const hospitalList = [
      { name: "Nairobi Hospital", coords: [-1.2921, 36.8219] },
      { name: "Aga Khan University Hospital", coords: [-1.2684, 36.811] },
      { name: "MP Shah Hospital", coords: [-1.2654, 36.8129] },
      { name: "Kenyatta National Hospital", coords: [-1.3001, 36.8066] },
    ];
    hospitalList.forEach((h) => {
      L.marker(h.coords).addTo(map).bindPopup(`<b>${h.name}</b>`);
    });

    mapRef.current = map;

    // cleanup on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // filtered doctor list based on selectedHospital & searchTerm — keeps original filters intact
  const filteredDoctors =
    selectedHospital && hospitals[selectedHospital]
      ? hospitals[selectedHospital].filter((doc) =>
          (doc.name + doc.specialty).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  // handle settings save
  const saveSettings = () => {
    localStorage.setItem("nextOfKin", JSON.stringify(nextOfKin));
    if (profilePic) localStorage.setItem("profilePic", profilePic);
    if (patientName) localStorage.setItem("patientName", patientName);
    if (password) localStorage.setItem("userPassword", password); // demo only
    alert("Settings saved locally.");
    setShowSettings(false);
  };

  // handle booking: save appointment to state + localStorage and add to medical history
  const bookAppointment = (doctor, date, hospitalName) => {
    const appt = {
      id: Date.now(),
      doctor: doctor.name,
      specialty: doctor.specialty,
      hospital: hospitalName,
      date,
      createdAt: new Date().toISOString(),
    };
    const next = [appt, ...appointments];
    setAppointments(next);
    localStorage.setItem("appointments", JSON.stringify(next));
    // Append to medical history (we'll store appointments as the medical history items)
    alert(`Appointment booked with ${doctor.name} on ${date}`);
    setShowBookModal(false);
    setSelectedDoctor(null);
  };

  // open booking modal for specific doctor
  const openBook = (doc, hospitalName) => {
    setSelectedDoctor({ ...doc, hospital: hospitalName });
    setShowBookModal(true);
  };

  // handle profile pic upload
  const handleProfilePic = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      localStorage.setItem("profilePic", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // helper: get last hospital & doctor from appointments
  const lastVisit = appointments.length ? appointments[0] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 text-gray-800 flex flex-col relative">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white/60 backdrop-blur-md z-20">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Patient Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome to your health hub</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <div className="text-sm font-medium text-blue-800">{patientName}</div>
            {lastVisit && (
              <div className="text-xs text-gray-500">
                Last visit: {lastVisit.doctor} @ {lastVisit.hospital} ({lastVisit.date})
              </div>
            )}
          </div>

          {/* profile thumbnail */}
          <label className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">
                {patientName?.slice(0, 1) || "P"}
              </div>
            )}
            {/* hidden file input */}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleProfilePic}
              title="Upload profile picture"
            />
          </label>

          {/* cogwheel */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white/30 hover:bg-white/40 rounded-full transition"
            title="Settings"
          >
            <FaCog className="text-blue-700 text-2xl" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6 z-10">
        {/* Top row: Medical / Lab / Pharmacy History */}
        <div className="grid md:grid-cols-3 gap-6">
          <section className="bg-white/70 p-5 rounded-xl shadow-md backdrop-blur-sm">
            <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-3">
              <FaHistory /> Medical History
            </h2>
            {appointments.length === 0 ? (
              <p className="text-sm text-gray-600">No past appointments yet.</p>
            ) : (
              <ul className="text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto">
                {appointments.map((a) => (
                  <li key={a.id} className="p-2 bg-white rounded-md border">
                    <div className="font-semibold text-blue-800">{a.doctor}</div>
                    <div className="text-xs text-gray-600">
                      {a.specialty} — {a.hospital}
                    </div>
                    <div className="text-xs text-gray-500">Date: {a.date}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white/70 p-5 rounded-xl shadow-md backdrop-blur-sm">
            <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-3">
              <FaFlask /> Lab Results
            </h2>
            <ul className="text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto">
              {labHistory.map((l, i) => (
                <li key={i} className="p-2 bg-white rounded-md border">
                  {l}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white/70 p-5 rounded-xl shadow-md backdrop-blur-sm">
            <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-3">
              <FaPills /> Pharmacy History
            </h2>
            <ul className="text-sm text-gray-700 space-y-2 max-h-40 overflow-y-auto">
              {pharmacyHistory.map((p, i) => (
                <li key={i} className="p-2 bg-white rounded-md border">
                  {p}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Doctor search & selector + booking controls */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">Find a Doctor</h2>

            {/* hospital selector */}
            <select
              className="w-full p-2 rounded-md border border-blue-300 mb-3"
              value={selectedHospital}
              onChange={(e) => {
                setSelectedHospital(e.target.value);
                setSelectedDoctor(null);
              }}
            >
              <option value="">Select Hospital</option>
              {Object.keys(hospitals).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            {/* search */}
            <div className="flex items-center border rounded-md mb-3 p-2">
              <FaSearch className="text-blue-700 mr-2" />
              <input
                type="text"
                placeholder="Search doctor or specialty..."
                className="flex-1 outline-none bg-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedHospital}
              />
            </div>

            {/* doctor results (keep your filters + UI intact) */}
            {selectedHospital && (
              <>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doc) => (
                    <div
                      key={doc.name}
                      className="p-3 mb-3 bg-white rounded-md shadow-sm border hover:bg-blue-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-blue-800">
                            <FaUserMd className="inline mr-2" />
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-600">{doc.specialty}</p>
                        </div>

                        <div className="flex flex-col gap-2 w-36">
                          <button
                            onClick={() => openBook(doc, selectedHospital)}
                            className="w-full bg-blue-600 text-white py-1 rounded-md hover:bg-blue-700 text-sm"
                          >
                            <FaCalendarAlt className="inline mr-2" />
                            Book
                          </button>

                          <button
                            onClick={() => alert(`Starting remote call with ${doc.name}`)}
                            className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700 text-sm"
                          >
                            <FaVideo className="inline mr-2" />
                            Call
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No doctors found for this hospital.</p>
                )}
              </>
            )}
          </div>

          {/* Map container (kept smaller and at bottom of page as requested) */}
          <div className="bg-white/60 rounded-xl p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Nearby Hospitals</h2>
            <div id="map" className="w-full h-[240px] rounded-lg border border-blue-200" />
          </div>
        </div>
      </main>

      {/* Book Modal (z high so map never overlaps) */}
      {showBookModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Available dates — {selectedDoctor.name} ({selectedDoctor.specialty})
            </h3>

            <div className="space-y-2">
              {(selectedDoctor.available || []).map((d) => (
                <button
                  key={d}
                  onClick={() => bookAppointment(selectedDoctor, d, selectedDoctor.hospital || selectedDoctor.hospitalName)}
                  className="w-full p-2 border rounded-md hover:bg-blue-50"
                >
                  {d}
                </button>
              ))}
              {(!selectedDoctor.available || selectedDoctor.available.length === 0) && (
                <div className="text-gray-600">No available dates listed.</div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  // cancel
                  setShowBookModal(false);
                  setSelectedDoctor(null);
                }}
                className="flex-1 bg-gray-300 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[95%] max-w-md">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Display Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2 border border-blue-300 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Upload Profile Picture</label>
                <input type="file" accept="image/*" onChange={handleProfilePic} className="w-full" />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Next of Kin Name</label>
                <input
                  type="text"
                  value={nextOfKin.name}
                  onChange={(e) => setNextOfKin({ ...nextOfKin, name: e.target.value })}
                  className="w-full p-2 border border-blue-300 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Next of Kin ID / Birth Cert No.</label>
                <input
                  type="text"
                  value={nextOfKin.id}
                  onChange={(e) => setNextOfKin({ ...nextOfKin, id: e.target.value })}
                  className="w-full p-2 border border-blue-300 rounded-md"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Change Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full p-2 border border-blue-300 rounded-md"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={saveSettings} className="flex-1 bg-blue-600 text-white py-2 rounded-md">
                  Save
                </button>
                <button onClick={() => setShowSettings(false)} className="flex-1 bg-gray-300 py-2 rounded-md">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
