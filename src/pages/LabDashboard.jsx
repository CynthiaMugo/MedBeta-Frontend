// src/pages/LabDashboard.jsx
import React, { useState, useEffect } from "react";
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

function LabDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [technician, setTechnician] = useState({
    name: "",
    profilePic: null,
    password: "",
  });
  const [passwordInput, setPasswordInput] = useState("");

  const [doctors] = useState([
    { id: 1, name: "Dr. John Doe" },
    { id: 2, name: "Dr. Jane Smith" },
  ]);

  const [patients] = useState([
    { id: 1, name: "Patient A" },
    { id: 2, name: "Patient B" },
  ]);

  const [testRequests, setTestRequests] = useState([
    {
      id: 1,
      patientId: 1,
      test: "Blood Test",
      doctorId: 1,
      status: "Pending",
      findings: {
        hemoglobin: { checked: false, value: "", normal: "Normal" },
        wbc: { checked: false, value: "", normal: "Normal" },
        platelets: { checked: false, value: "", normal: "Normal" },
      },
      resultNote: "",
    },
    {
      id: 2,
      patientId: 2,
      test: "Urine Test",
      doctorId: 2,
      status: "Pending",
      findings: {
        glucose: { checked: false, value: "", normal: "Normal" },
        protein: { checked: false, value: "", normal: "Normal" },
        ketones: { checked: false, value: "", normal: "Normal" },
      },
      resultNote: "",
    },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, from: "Dr. John Doe", message: "Requesting token for patient X" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New test request received from Dr. John Doe" },
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const storedTech = JSON.parse(localStorage.getItem("technician"));
    if (storedTech) {
      setTechnician(storedTech);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) localStorage.setItem("technician", JSON.stringify(technician));
  }, [loggedIn, technician]);

  const handleLogout = () => {
    setLoggedIn(false);
    setTechnician({ name: "", profilePic: null, password: "" });
    localStorage.removeItem("technician");
  };

  const handleProfilePic = (e) => {
    setTechnician({ ...technician, profilePic: URL.createObjectURL(e.target.files[0]) });
  };

  const handlePasswordChange = () => {
    setTechnician({ ...technician, password: passwordInput });
    alert("Password updated successfully!");
    setPasswordInput("");
    setShowSettings(false);
  };

  const toggleFinding = (testId, key) => {
    setTestRequests((prev) =>
      prev.map((t) =>
        t.id === testId
          ? {
              ...t,
              findings: {
                ...t.findings,
                [key]: { ...t.findings[key], checked: !t.findings[key].checked },
              },
            }
          : t
      )
    );
  };

  const handleFindingValue = (testId, key, field, value) => {
    setTestRequests((prev) =>
      prev.map((t) =>
        t.id === testId
          ? { ...t, findings: { ...t.findings, [key]: { ...t.findings[key], [field]: value } } }
          : t
      )
    );
  };

  const handleResultNoteChange = (testId, value) => {
    setTestRequests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, resultNote: value } : t))
    );
  };

  const sendResult = (id) => {
    setTestRequests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t))
    );
    alert("Test result sent!");
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: messages.length + 1, from: technician.name, message: newMessage }]);
    setNewMessage("");
  };

  const getPatientName = (id) => patients.find((p) => p.id === id)?.name;
  const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name;

  if (!loggedIn)
    return <div className="min-h-screen flex items-center justify-center text-blue-700">Lab Dashboard Not Logged In</div>;

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Lab Dashboard</h1>
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
              <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-lg shadow-lg p-3 z-50">
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

          {/* Profile pic + Settings + Logout */}
          <div className="flex items-center gap-2">
            {technician.profilePic ? (
              <img
                src={technician.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                <User size={18} className="text-gray-400" />
              </div>
            )}
            <button onClick={() => setShowSettings(true)} className="bg-white text-blue-700 px-2 py-1 rounded-lg hover:bg-cyan-100 text-sm">
              <Settings size={16} />
            </button>
            <button
              className="flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-lg shadow hover:bg-cyan-100 text-sm"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LAB TEST REQUESTS */}
        <div className="lg:col-span-2 space-y-4">
          {testRequests.map((tr) => (
            <div key={tr.id} className="bg-white p-4 rounded-xl shadow hover:shadow-2xl transition">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">
                  {getPatientName(tr.patientId)} - {tr.test} ({getDoctorName(tr.doctorId)}) [{tr.status}]
                </span>
                {tr.status === "Pending" && (
                  <button
                    onClick={() => sendResult(tr.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Send size={14} /> Send
                  </button>
                )}
              </div>

              {tr.status === "Pending" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  {Object.keys(tr.findings).map((key) => (
                    <div key={key} className="bg-blue-50 p-2 rounded shadow-sm">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={tr.findings[key].checked}
                          onChange={() => toggleFinding(tr.id, key)}
                          className="w-3 h-3 accent-blue-600"
                        />
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type="text"
                        placeholder="Value"
                        value={tr.findings[key].value}
                        onChange={(e) => handleFindingValue(tr.id, key, "value", e.target.value)}
                        className="mt-1 border rounded-lg p-1 w-full text-sm"
                      />
                      <select
                        value={tr.findings[key].normal}
                        onChange={(e) => handleFindingValue(tr.id, key, "normal", e.target.value)}
                        className="mt-1 border rounded-lg p-1 w-full text-sm"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Abnormal">Abnormal</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {tr.status === "Pending" && (
                <textarea
                  placeholder="Enter result notes..."
                  value={tr.resultNote}
                  onChange={(e) => handleResultNoteChange(tr.id, e.target.value)}
                  className="w-full border rounded-lg p-2 resize-none h-20 text-sm"
                />
              )}
            </div>
          ))}
        </div>

        {/* MESSAGES & TOKENS */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-2xl transition">
            <h2 className="font-semibold text-sm flex items-center gap-2 mb-2">
              <MessageCircle size={18} className="text-blue-600" /> Messages & Access Tokens
            </h2>
            <div className="max-h-32 overflow-y-auto border rounded-lg p-2 mb-2 bg-blue-50 text-sm">
              {messages.map((m) => (
                <div key={m.id} className="mb-1">
                  <span className="font-semibold">{m.from}: </span>
                  <span>{m.message}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="border rounded-lg p-1 w-full text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <Send size={14} />
              </button>
            </div>
            <button
              onClick={() => alert("Assign token modal placeholder")}
              className="w-full bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Assign Token
            </button>
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
              {technician.profilePic ? (
                <img
                  src={technician.profilePic}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mb-2 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <User size={26} className="text-gray-400" />
                </div>
              )}
              <label className="cursor-pointer px-2 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center gap-1 mb-2 text-sm">
                <UploadCloud size={14} /> Upload
                <input type="file" className="hidden" onChange={handleProfilePic} />
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
export default LabDashboard;