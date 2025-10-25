// src/pages/HospitalDashboard.jsx
import React, { useState, useEffect } from "react";
import { User, LogOut, Users, Calendar, Mail, PlusCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// Dummy Data (with age)
const dummyPatients = [
  { id: 1, name: "John Doe", email: "john@example.com", admitted: true, room: "101", age: 10 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", admitted: false, room: "102", age: 25 },
  { id: 3, name: "Bob Teen", email: "bob@example.com", admitted: true, room: "103", age: 15 },
  { id: 4, name: "Alice Senior", email: "alice@example.com", admitted: false, room: "104", age: 65 },
];

const dummyAppointments = [
  { id: 1, patient: "John Doe", doctor: "Dr. Williams", time: "10:00 AM", status: "Pending" },
  { id: 2, patient: "Jane Smith", doctor: "Dr. Adams", time: "11:30 AM", status: "Completed" },
  { id: 3, patient: "Bob Teen", doctor: "Dr. Williams", time: "1:00 PM", status: "Pending" },
];

export default function HospitalDashboard() {
  const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem("hospitalLoggedIn")) || false);
  const [role, setRole] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [activeTab, setActiveTab] = useState("patients");

  const [patients, setPatients] = useState(JSON.parse(localStorage.getItem("patients")) || dummyPatients);
  const [appointments, setAppointments] = useState(JSON.parse(localStorage.getItem("appointments")) || dummyAppointments);
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem("hospitalMessages")) || []);
  const [newMessage, setNewMessage] = useState("");

  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientRoom, setNewPatientRoom] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("");
  const [newPatientAdmitted, setNewPatientAdmitted] = useState(false);

  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterRoom, setFilterRoom] = useState("");

  useEffect(() => localStorage.setItem("hospitalLoggedIn", JSON.stringify(loggedIn)), [loggedIn]);
  useEffect(() => localStorage.setItem("patients", JSON.stringify(patients)), [patients]);
  useEffect(() => localStorage.setItem("appointments", JSON.stringify(appointments)), [appointments]);
  useEffect(() => localStorage.setItem("hospitalMessages", JSON.stringify(messages)), [messages]);

  const handleLogin = () => {
    if (!nameInput || !emailInput || !accessCodeInput) return alert("All fields are required!");
    if (!role) return alert("Select your role");
    localStorage.setItem("userRole", "hospital");
    localStorage.setItem("hospitalUser", JSON.stringify({ name: nameInput, email: emailInput, accessCode: accessCodeInput, role }));
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setNameInput(""); setEmailInput(""); setAccessCodeInput(""); setProfilePic(null); setRole("");
    localStorage.removeItem("hospitalUser"); localStorage.removeItem("userRole");
  };

  const handleProfilePic = (e) => setProfilePic(URL.createObjectURL(e.target.files[0]));

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: messages.length + 1, from: nameInput, message: newMessage }]);
    setNewMessage("");
  };

  const admitPatient = (id) => setPatients(prev => prev.map(p => p.id === id ? { ...p, admitted: true } : p));
  const dischargePatient = (id) => setPatients(prev => prev.map(p => p.id === id ? { ...p, admitted: false } : p));
  const addNewPatient = () => {
    if (!newPatientName || !newPatientEmail || !newPatientRoom || !newPatientAge) return alert("All fields are required!");
    const newPatient = {
      id: patients.length + 1,
      name: newPatientName,
      email: newPatientEmail,
      room: newPatientRoom,
      age: parseInt(newPatientAge),
      admitted: newPatientAdmitted
    };
    setPatients([...patients, newPatient]);
    setNewPatientName(""); setNewPatientEmail(""); setNewPatientRoom(""); setNewPatientAge(""); setNewPatientAdmitted(false);
  };

  // Filters and stats
  const doctors = [...new Set(appointments.map(a => a.doctor))];
  const rooms = [...new Set(patients.map(p => p.room))];

  const filteredPatients = patients.filter(p => {
    let matchDoctor = true;
    let matchRoom = true;
    if (filterDoctor) matchDoctor = appointments.some(a => a.patient === p.name && a.doctor === filterDoctor);
    if (filterRoom) matchRoom = p.room === filterRoom;
    return matchDoctor && matchRoom;
  });

  const getAgeGroupStats = (patients) => {
    const groups = { Kids: 0, Teenagers: 0, Adults: 0, Seniors: 0 };
    const admitted = { Kids: 0, Teenagers: 0, Adults: 0, Seniors: 0 };
    patients.forEach(p => {
      let group = p.age < 13 ? "Kids" : p.age < 20 ? "Teenagers" : p.age < 60 ? "Adults" : "Seniors";
      groups[group]++;
      if (p.admitted) admitted[group]++;
    });
    return Object.keys(groups).map(g => ({ group: g, Admitted: admitted[g], NotAdmitted: groups[g] - admitted[g] }));
  };

  const getRoomStats = () => {
    return rooms.map(r => {
      const patientsInRoom = patients.filter(p => p.room === r);
      const occupied = patientsInRoom.filter(p => p.admitted).length;
      const free = patientsInRoom.length - occupied;
      return { room: r, occupied, free };
    });
  };

  const getDoctorStats = () => {
    return doctors.map(doc => {
      const patientsOfDoctor = appointments.filter(a => a.doctor === doc).map(a => a.patient);
      const admittedCount = patients.filter(p => patientsOfDoctor.includes(p.name) && p.admitted).length;
      const pendingAppointments = appointments.filter(a => a.doctor === doc && a.status === "Pending").length;
      return { doctor: doc, totalPatients: patientsOfDoctor.length, admittedPatients: admittedCount, pendingAppointments };
    });
  };

  // --- LOGIN PAGE ---
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-700">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center text-blue-700">Hospital Staff Login</h2>
          <input type="text" placeholder="Full Name" value={nameInput} onChange={e => setNameInput(e.target.value)}
            className="border border-blue-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
          <input type="email" placeholder="Email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
            className="border border-blue-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
          <input type="password" placeholder="Access Code" value={accessCodeInput} onChange={e => setAccessCodeInput(e.target.value)}
            className="border border-blue-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none" />
          <select value={role} onChange={e => setRole(e.target.value)}
            className="border border-blue-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none">
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="receptionist">Receptionist</option>
          </select>
          <label className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-800 rounded-xl cursor-pointer hover:bg-cyan-200">
            Upload Profile Picture
            <input type="file" className="hidden" onChange={handleProfilePic} />
          </label>
          <button onClick={handleLogin} className="w-full py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition">
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PAGE ---
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="flex flex-col items-center py-6 border-b">
          {profilePic ? <img src={profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-cyan-600" /> :
            <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center"><User size={36} className="text-cyan-600" /></div>}
          <h2 className="mt-2 font-bold text-lg">{nameInput}</h2>
          <p className="text-gray-500">{role}</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3">
          <button onClick={() => setActiveTab("patients")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab === "patients" ? "bg-cyan-100 font-semibold" : "hover:bg-gray-100"}`}><Users /> Patients</button>
          <button onClick={() => setActiveTab("appointments")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab === "appointments" ? "bg-cyan-100 font-semibold" : "hover:bg-gray-100"}`}><Calendar /> Appointments</button>
          {role === "admin" && <button onClick={() => setActiveTab("messages")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab === "messages" ? "bg-cyan-100 font-semibold" : "hover:bg-gray-100"}`}><Mail /> Messages</button>}
          {role === "receptionist" && <button onClick={() => setActiveTab("register")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab === "register" ? "bg-cyan-100 font-semibold" : "hover:bg-gray-100"}`}><PlusCircle /> Register Patient</button>}
          <button onClick={() => setActiveTab("statistics")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab === "statistics" ? "bg-cyan-100 font-semibold" : "hover:bg-gray-100"}`}>📊 Statistics</button>
          <button onClick={() => setActiveTab("doctors")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${activeTab === "doctors" ? "bg-cyan-100 font-semibold" : "hover:bg-gray-100"}`}>🩺 Doctors Overview</button>
          <button onClick={handleLogout} className="flex items-center gap-3 mt-10 px-4 py-3 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 w-full"><LogOut /> Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* PATIENTS TAB */}
        {activeTab === "patients" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-gray-500">{p.email}</p>
                  <p className="text-gray-500">Room: {p.room}</p>
                  <p className="text-gray-500">Age: {p.age}</p>
                  <span className={`inline-block px-2 py-1 mt-2 rounded-full text-sm font-medium ${p.admitted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.admitted ? "Admitted" : "Not Admitted"}
                  </span>
                </div>
                {role === "receptionist" && (
                  <button onClick={() => p.admitted ? dischargePatient(p.id) : admitPatient(p.id)}
                    className={`mt-4 py-2 rounded-xl w-full ${p.admitted ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {p.admitted ? "Discharge" : "Admit"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">Appointments</h2>
            <table className="w-full border-collapse">
              <thead className="bg-cyan-100">
                <tr>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="p-3">{a.patient}</td>
                    <td className="p-3">{a.doctor}</td>
                    <td className="p-3">{a.time}</td>
                    <td className={`p-3 font-semibold ${a.status === "Completed" ? "text-green-700" : "text-orange-700"}`}>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && role === "admin" && (
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold">Broadcast Messages</h2>
            <div className="flex gap-2">
              <input type="text" placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)}
                className="flex-1 border px-4 py-2 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
              <button onClick={sendMessage} className="px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition">Send</button>
            </div>
            <div className="max-h-96 overflow-y-auto flex flex-col gap-2">
              {messages.map(m => (
                <div key={m.id} className="bg-gray-50 p-3 rounded-xl shadow">{m.from}: {m.message}</div>
              ))}
            </div>
          </div>
        )}

        {/* REGISTER PATIENT */}
        {activeTab === "register" && role === "receptionist" && (
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold">Register New Patient</h2>
            <input type="text" placeholder="Name" value={newPatientName} onChange={e => setNewPatientName(e.target.value)}
              className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
            <input type="email" placeholder="Email" value={newPatientEmail} onChange={e => setNewPatientEmail(e.target.value)}
              className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
            <input type="text" placeholder="Room" value={newPatientRoom} onChange={e => setNewPatientRoom(e.target.value)}
              className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
            <input type="number" placeholder="Age" value={newPatientAge} onChange={e => setNewPatientAge(e.target.value)}
              className="border px-4 py-2 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newPatientAdmitted} onChange={e => setNewPatientAdmitted(e.target.checked)} />
              Admitted
            </label>
            <button onClick={addNewPatient} className="px-6 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition">Add Patient</button>
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === "statistics" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">Patient Age Distribution</h2>
            <div className="flex gap-4 mb-4">
              <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}
                className="border px-3 py-2 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none">
                <option value="">All Doctors</option>
                {doctors.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={filterRoom} onChange={e => setFilterRoom(e.target.value)}
                className="border px-3 py-2 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none">
                <option value="">All Rooms</option>
                {rooms.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={getAgeGroupStats(filteredPatients)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Admitted" stackId="a" fill="#14b8a6" radius={[10, 10, 0, 0]} />
                <Bar dataKey="NotAdmitted" stackId="a" fill="#f87171" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* DOCTORS OVERVIEW TAB */}
        {activeTab === "doctors" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">Doctors Overview</h2>
            <table className="w-full border-collapse mb-6">
              <thead className="bg-cyan-100">
                <tr>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Total Patients</th>
                  <th className="p-3 text-left">Admitted Patients</th>
                  <th className="p-3 text-left">Pending Appointments</th>
                </tr>
              </thead>
              <tbody>
                {getDoctorStats().map(d => (
                  <tr key={d.doctor} className="hover:bg-gray-50">
                    <td className="p-3">{d.doctor}</td>
                    <td className="p-3">{d.totalPatients}</td>
                    <td className="p-3">{d.admittedPatients}</td>
                    <td className="p-3">{d.pendingAppointments}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-lg font-semibold mb-2">Patients Distribution per Doctor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getDoctorStats()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="doctor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalPatients" fill="#14b8a6" radius={[10, 10, 0, 0]} />
                <Bar dataKey="admittedPatients" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </main>
    </div>
  );
}
