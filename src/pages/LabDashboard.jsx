// src/pages/LabDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FlaskRound,
  LogOut,
  User,
  UploadCloud,
  Mail,
  Send,
  MessageCircle,
  Settings,
  X,
} from "lucide-react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function LabDashboard() {
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [pendingTests, setPendingTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Fetch technician data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    // Fetch pending and completed tests
    fetchTests(token);
    fetchCompletedTests(token);
  }, [navigate]);

  const fetchTests = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/labtests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingTests(res.data);

      if (res.data.length > 0) {
        setTechnician({
          name: res.data[0].technician_name || "Technician",
          email: res.data[0].technician_email,
        });
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
      if (err.response?.status === 401) navigate("/auth");
    }
  };

  const fetchCompletedTests = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/labtests/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompletedTests(res.data);
    } catch (err) {
      console.error("Error fetching completed tests:", err);
    }
  };

  // udate test results
  const handleResultSubmit = async (testId, results) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_URL}/labtests/${testId}/update`,
        { results, status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), text: `Test ${testId} marked as completed.` },
      ]);

      // Refresh lists
      fetchTests(token);
      fetchCompletedTests(token);
    } catch (err) {
      console.error("Error updating test:", err);
      alert("Failed to update test result!");
    }
  };

  // Profile settings and logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handlePasswordChange = () => {
    alert("Password updated successfully!");
    setPasswordInput("");
    setShowSettings(false);
  };

  if (!technician)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-700">
        Loading technician dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FlaskRound size={26} /> Lab Dashboard
        </h1>
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
              <Mail size={22} className="text-white" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg p-3 z-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Notifications</span>
                  <button onClick={() => setShowNotifications(false)}>
                    <X size={16} />
                  </button>
                </div>
                <ul className="space-y-1">
                  {notifications.map((n) => (
                    <li key={n.id} className="text-sm">{n.text}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Technician Info */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600">
              <User size={18} />
            </div>
            <div className="text-sm">
              <p className="font-semibold">{technician.name}</p>
              <p className="text-xs text-gray-200">{technician.email}</p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-white text-blue-700 p-1 rounded-lg hover:bg-cyan-100 text-sm"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-lg shadow hover:bg-cyan-100 text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN SECTION */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tests */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold mb-2">🧪 Pending Tests</h2>
          {pendingTests.length === 0 ? (
            <p className="text-gray-600 text-sm">No pending tests assigned.</p>
          ) : (
            pendingTests.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">
                    {t.patient_name} ({t.patient_email}) - {t.test_name}
                  </span>
                  <button
                    onClick={() =>
                      handleResultSubmit(
                        t.id,
                        prompt(`Enter results for ${t.test_name}:`)
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Send size={14} /> Submit Result
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Doctor: {t.doctor_name} ({t.doctor_email})
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Requested: {new Date(t.date_requested).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Completed Tests */}
        <div>
          <h2 className="text-lg font-bold mb-2">📜 Completed Tests</h2>
          <div className="bg-white rounded-xl p-3 shadow max-h-[500px] overflow-y-auto">
            {completedTests.length === 0 ? (
              <p className="text-gray-600 text-sm">No completed tests yet.</p>
            ) : (
              completedTests.map((t) => (
                <div key={t.id} className="border-b py-2 text-sm">
                  <p className="font-semibold">{t.test_name}</p>
                  <p>Patient: {t.patient_name}</p>
                  <p>Doctor: {t.doctor_name}</p>
                  <p>Result: {t.results || "N/A"}</p>
                  <p className="text-xs text-gray-500">
                    Done on: {new Date(t.date_completed).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-lg w-72 relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-semibold mb-2">Profile Settings</h3>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <User size={26} className="text-gray-400" />
              </div>
              <label className="cursor-pointer px-2 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center gap-1 mb-2 text-sm">
                <UploadCloud size={14} /> Upload
                <input type="file" className="hidden" />
              </label>
              <input
                type="password"
                placeholder="New Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="border rounded-lg p-2 w-full mb-2 text-sm"
              />
              <button
                onClick={handlePasswordChange}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
