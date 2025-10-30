import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pill,
  ClipboardList,
  User,
  Sun,
  Moon,
  CheckCircle,
  Clock,
  LogOut,
  ShieldCheck,
  PillBottle,
} from "lucide-react";
import { API_URL } from "../config";
import axios from "axios";

export default function PharmacistDashboard() {
  const [unclaimed, setUnclaimed] = useState([]);
  const [claimed, setClaimed] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "blue");
  const [loading, setLoading] = useState(false);
  const [pharmacist, setPharmacist] = useState({
    name: "Pharmacist Alice",
    profilePic: null,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // console.log(localStorage.getItem("token"))

  useEffect(() => {
    fetchPharmacyProfile();
  }, []);

  const fetchPharmacyProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/pharmacies/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.data) {
        setPharmacist({
          name: res.data.data.name,
          profilePic: null, // if you have an image field, replace null
        });
      }
    } catch (err) {
      console.error("Error fetching pharmacy profile:", err);
    }
  };



  // FETCH PRESCRIPTIONS

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const [unclaimedRes, claimedRes] = await Promise.all([
        axios.get(`${API_URL}/prescriptions/unclaimed`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUnclaimed(unclaimedRes.data || []);
      setClaimed(claimedRes.data.data || []);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  // CLAIM PRESCRIPTION
  const claimPrescription = async (id) => {
    try {
      await axios.put(
        `${API_URL}/prescriptions/${id}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPrescriptions();
    } catch (err) {
      console.error("Error claiming prescription:", err);
      alert("Could not claim prescription.");
    }
  };


  const handlePrescriptionAction = async (id, action) => {
    try {
      await axios.put(
        `${API_URL}/prescriptions/${id}/action`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPrescriptions();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      alert(`Could not ${action} prescription.`);
    }
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "blue" ? "black" : "blue"));
  useEffect(() => localStorage.setItem("theme", theme), [theme]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const themeClasses =
    theme === "blue" ? "bg-blue-50 text-gray-900" : "bg-gray-900 text-white";

  return (
    <div className={`min-h-screen relative ${themeClasses}`}>
      {/* HEADER */}
      <header
        className={`flex justify-between items-center p-6 shadow-md ${
          theme === "blue" ? "bg-blue-600 text-white" : "bg-gray-900 text-white"
        }`}
      >
        <h1 className="text-2xl font-bold">Pharmacist Dashboard</h1>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-white text-blue-700 px-3 py-1 rounded-xl hover:bg-gray-200 transition"
        >
          {theme === "blue" ? <Sun size={16} /> : <Moon size={16} />} Theme
        </button>
      </header>

      <main className="p-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* PROFILE PANEL */}
        <div className="bg-gradient-to-b from-blue-400 to-blue-200 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center hover:shadow-2xl transition">
          {pharmacist.profilePic ? (
            <img
              src={pharmacist.profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white mb-4"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-4 border-4 border-white">
              <User size={40} className="text-blue-500" />
            </div>
          )}
          <h2 className="font-bold text-xl">{pharmacist.name}</h2>
        </div>

        {/* UNCLAIMED PRESCRIPTIONS */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="text-orange-500 w-8 h-8" />
            <h2 className="text-xl font-semibold">Unclaimed Prescriptions</h2>
          </div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : unclaimed.length === 0 ? (
            <p className="text-gray-500">No unclaimed prescriptions.</p>
          ) : (
            <ul className="space-y-3">
              {unclaimed.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                >
                  <div>
                    <span className="font-semibold">{p.patient}</span> -{" "}
                    {p.medication_details}{" "}
                    <span className="text-gray-500">({p.doctor})</span>
                  </div>
                  <button
                    onClick={() => claimPrescription(p.id)}
                    className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition"
                  >
                    <CheckCircle size={16} /> Claim
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CLAIMED PRESCRIPTIONS */}
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition col-span-4 mt-6 lg:mt-0">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="text-yellow-500 w-8 h-8" />
            <h2 className="text-xl font-semibold">My Prescriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-blue-100 rounded-xl">
                <tr>
                  <th className="px-4 py-2 text-left">Patient</th>
                  <th className="px-4 py-2 text-left">Medication</th>
                  <th className="px-4 py-2 text-left">Doctor</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claimed.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-3">
                      No claimed prescriptions yet.
                    </td>
                  </tr>
                ) : (
                  claimed.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2">{p.patient_id}</td>
                      <td className="px-4 py-2">{p.medication_details}</td>
                      <td className="px-4 py-2">{p.doctor_id}</td>
                      <td className="px-4 py-2 capitalize">
                        {p.status || "pending"}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() =>
                            handlePrescriptionAction(p.id, "verify")
                          }
                          disabled={p.status === "verified" || p.status === "dispensed"}
                          className={`flex items-center gap-1 px-3 py-1 rounded-xl transition ${
                            p.status === "verified" || p.status === "dispensed"
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          <ShieldCheck size={14} /> Verify
                        </button>
                        <button
                          onClick={() =>
                            handlePrescriptionAction(p.id, "dispense")
                          }
                          disabled={p.status === "dispensed"}
                          className={`flex items-center gap-1 px-3 py-1 rounded-xl transition ${
                            p.status === "dispensed"
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          <PillBottle size={14} /> Dispense
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="fixed bottom-6 left-6 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-red-600 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
