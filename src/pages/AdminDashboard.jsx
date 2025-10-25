// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { LogOut, Bell, Settings, Send, X } from "lucide-react";

function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [admin, setAdmin] = useState({ name: "", profilePic: null, password: "" });
  const [nameInput, setNameInput] = useState("");
  const [activeTab, setActiveTab] = useState("staff");
  const [staffList, setStaffList] = useState([]);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("doctor");
  const [newStaffHospital, setNewStaffHospital] = useState("Hospital A");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [patientTokenRequests, setPatientTokenRequests] = useState([]);
  const [requestPatientName, setRequestPatientName] = useState("");
  const [requestHospital, setRequestHospital] = useState("Hospital A");

  useEffect(() => {
    if (loggedIn) localStorage.setItem("admin", JSON.stringify(admin));
  }, [loggedIn, admin]);

  // ----- Handlers -----
  const handleLogin = () => {
    if (!nameInput.trim()) return alert("Enter your name.");
    setAdmin({ ...admin, name: nameInput.trim() });
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setAdmin({ name: "", profilePic: null, password: "" });
    setNameInput("");
  };

  const handleProfilePic = (e) => {
    setAdmin({ ...admin, profilePic: URL.createObjectURL(e.target.files[0]) });
  };

  const handleChangePassword = () => {
    if (!passwordInput) return alert("Enter a new password.");
    setAdmin({ ...admin, password: passwordInput });
    setPasswordInput("");
    alert("Password updated successfully!");
  };

  const addStaff = () => {
    if (!newStaffName.trim()) return alert("Enter staff name.");
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    setStaffList([
      ...staffList,
      { name: newStaffName, role: newStaffRole, token, hospital: newStaffHospital },
    ]);
    setNotifications([
      ...notifications,
      `New ${newStaffRole} added: ${newStaffName} at ${newStaffHospital}`,
    ]);
    setNewStaffName("");
  };

  const removeStaff = (name) =>
    setStaffList(staffList.filter((s) => s.name !== name));

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { from: admin.name, text: newMessage, time: new Date() },
    ]);
    setNewMessage("");
  };

  const requestPatientToken = () => {
    if (!requestPatientName.trim())
      return alert("Enter the patient's name to request token.");
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    setPatientTokenRequests([
      ...patientTokenRequests,
      { patient: requestPatientName, hospital: requestHospital, token },
    ]);
    setNotifications([
      ...notifications,
      `Token requested for patient ${requestPatientName} at ${requestHospital}`,
    ]);
    setRequestPatientName("");
  };

  if (!loggedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center border-t-4 border-blue-500">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">
            Admin Login
          </h2>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="border px-4 py-3 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-5 px-8 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Bell size={24} className="cursor-pointer animate-bounce" />
          <Settings
            size={24}
            className="cursor-pointer"
            onClick={() => setShowSettings(!showSettings)}
          />
          <button
            className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg shadow hover:bg-cyan-100"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed top-20 right-10 bg-white p-6 rounded-2xl shadow-lg w-80 z-50 animate-slide-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Profile Settings</h3>
            <button onClick={() => setShowSettings(false)}>
              <X size={20} />
            </button>
          </div>
          <label className="flex flex-col items-center mb-3 cursor-pointer px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">
            Upload Profile Picture
            <input type="file" className="hidden" onChange={handleProfilePic} />
          </label>
          <input
            type="password"
            placeholder="New Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <button
            onClick={handleChangePassword}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Password
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SIDEBAR / TABS */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col gap-4">
          <h2 className="font-semibold text-lg mb-4">Navigation</h2>
          <button
            className={`py-2 px-4 rounded-lg w-full text-left hover:bg-blue-100 ${
              activeTab === "staff" ? "bg-blue-100 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("staff")}
          >
            Staff Management
          </button>
          <button
            className={`py-2 px-4 rounded-lg w-full text-left hover:bg-blue-100 ${
              activeTab === "messages" ? "bg-blue-100 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("messages")}
          >
            Messages & Notifications
          </button>
          <button
            className={`py-2 px-4 rounded-lg w-full text-left hover:bg-blue-100 ${
              activeTab === "patient" ? "bg-blue-100 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("patient")}
          >
            Patient Token Requests
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg">
          {activeTab === "staff" && (
            <>
              <h2 className="font-semibold text-xl mb-4">Staff Management</h2>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Staff Name"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="border px-3 py-2 rounded flex-1"
                />
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="lab">Lab Technician</option>
                </select>
                <select
                  value={newStaffHospital}
                  onChange={(e) => setNewStaffHospital(e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  <option value="Hospital A">Hospital A</option>
                  <option value="Hospital B">Hospital B</option>
                  <option value="Hospital C">Hospital C</option>
                </select>
                <button
                  onClick={addStaff}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Staff & Generate Token
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {staffList.map((s) => (
                  <div
                    key={s.name}
                    className="bg-blue-50 p-3 rounded-lg flex justify-between items-center shadow hover:shadow-md transition"
                  >
                    <span>
                      {s.name} ({s.role}) - <strong>{s.token}</strong> at{" "}
                      {s.hospital}
                    </span>
                    <button
                      onClick={() => removeStaff(s.name)}
                      className="text-red-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "messages" && (
            <>
              <h2 className="font-semibold text-xl mb-4">
                Messages & Notifications
              </h2>
              <div className="max-h-96 overflow-y-auto mb-3 border rounded-lg p-3 bg-blue-50">
                {messages.map((m, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>{m.from}</strong>: {m.text}{" "}
                    <span className="text-xs text-gray-500">
                      ({m.time.toLocaleTimeString()})
                    </span>
                  </div>
                ))}
                {notifications.map((n, idx) => (
                  <div key={idx} className="mb-1 text-blue-700 font-semibold">
                    Notification: {n}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"
                >
                  <Send size={16} /> Send
                </button>
              </div>
            </>
          )}

          {activeTab === "patient" && (
            <>
              <h2 className="font-semibold text-xl mb-4">
                Patient Token Requests
              </h2>
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={requestPatientName}
                  onChange={(e) => setRequestPatientName(e.target.value)}
                  className="border px-3 py-2 rounded flex-1"
                />
                <select
                  value={requestHospital}
                  onChange={(e) => setRequestHospital(e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  <option value="Hospital A">Hospital A</option>
                  <option value="Hospital B">Hospital B</option>
                  <option value="Hospital C">Hospital C</option>
                </select>
                <button
                  onClick={requestPatientToken}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Request Token
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {patientTokenRequests.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 p-3 rounded-lg flex justify-between items-center shadow hover:shadow-md transition"
                  >
                    <span>
                      {p.patient} - Token: <strong>{p.token}</strong> at{" "}
                      {p.hospital}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;