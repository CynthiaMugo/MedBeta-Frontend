// DoctorDashboard.jsx
import React, { useState, useMemo } from "react";
import { Calendar, FileText, User, FlaskRound, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorDashboard() {
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");
  const [doctorName] = useState("Dr. Ian Mabruk");
  const [specialty] = useState("Cardiologist");

  const [activeTab, setActiveTab] = useState("bookings");
  const [status, setStatus] = useState("Available");

  const [notes, setNotes] = useState("");
  const [labOrders, setLabOrders] = useState("");
  const [prescriptions, setPrescriptions] = useState("");

  const [appointments, setAppointments] = useState([
    { id: 1, date: "2025-10-21", time: "10:00 AM", patient: "Jane Doe", status: "pending" },
    { id: 2, date: "2025-10-21", time: "11:30 AM", patient: "John Smith", status: "pending" },
    { id: 3, date: "2025-10-22", time: "02:00 PM", patient: "Alice Johnson", status: "pending" },
  ]);

  const [records, setRecords] = useState([]);
  const [remoteRecords, setRemoteRecords] = useState([]);
  const [accessKey, setAccessKey] = useState("");
  const [messages, setMessages] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, appointment: null });

  // Image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // Handle appointment action
  const handleAppointmentAction = (appointment, action) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === appointment.id ? { ...a, status: action } : a
      )
    );
    setConfirmationModal({ isOpen: false, appointment: null });

    if (action === "confirmed") {
      alert(`${appointment.patient}'s appointment confirmed!`);
    } else if (action === "rejected") {
      alert(`${appointment.patient}'s appointment was rejected!`);
    }
  };

  const handleSaveRecord = () => {
    if (!notes.trim() && !labOrders.trim() && !prescriptions.trim())
      return alert("Please enter consultation info.");

    const newRec = {
      id: Date.now(),
      patient: selectedBooking?.patient || "New Patient",
      doctor: `${doctorName} (Your Clinic)`,
      date: new Date().toISOString().slice(0, 10),
      notes: `Notes: ${notes}\nLab Orders: ${labOrders}\nPrescription: ${prescriptions}`,
    };
    setRecords(prev => [newRec, ...prev]);
    setNotes(""); setLabOrders(""); setPrescriptions("");
    alert("Record saved successfully!");
  };

  const sendLabRequest = () => {
    if (!labOrders.trim()) return alert("Add lab orders first.");
    alert(`Lab request sent:\n${labOrders}`);
  };

  const sendPharmaRequest = () => {
    if (!prescriptions.trim()) return alert("Add prescription first.");
    alert(`Pharmacist request sent:\n${prescriptions}`);
  };

  const fetchRemoteRecords = () => {
    if (!accessKey.trim()) return alert("Enter access key to fetch records.");
    const fakeRemoteRecords = [
      { id: 101, patient: "Remote Patient A", doctor: "Dr. Remote", date: "2025-08-15", notes: "Remote notes example" },
      { id: 102, patient: "Remote Patient B", doctor: "Dr. Remote", date: "2025-09-10", notes: "Another remote notes" },
    ];
    setRemoteRecords(fakeRemoteRecords);
    alert("Access granted. Remote records loaded.");
  };

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [...records, ...remoteRecords];
    return [...records, ...remoteRecords].filter(
      r => r.patient.toLowerCase().includes(q) || (r.notes || "").toLowerCase().includes(q)
    );
  }, [records, remoteRecords, searchQuery]);

  // Get number of confirmed appointments per date
  const getAppointmentsCount = (dateStr) => appointments.filter(a => a.date === dateStr && a.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-teal-400 rounded-full shadow">
            <span className="font-bold text-white">+</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">MedBeta</h2>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right mr-4">
            <div className="text-sm font-medium">{doctorName}</div>
            <div className="text-xs text-gray-500">{specialty}</div>
          </div>
          <label className="relative">
            <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow" />
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
          </label>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 mt-6">
        {/* Top controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">Welcome back, <span className="text-black">{doctorName}</span></h1>
            <p className="mt-2 text-gray-500">Manage bookings, patient records, and consultation panels below.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex gap-3">
              <button onClick={() => setActiveTab("bookings")}
                className={`px-5 py-2 rounded-xl border ${activeTab === "bookings" ? "bg-teal-400 text-white border-teal-400" : "bg-white text-gray-800 border-gray-200"}`}>Manage Bookings</button>
              <button onClick={() => setActiveTab("records")}
                className={`px-5 py-2 rounded-xl border ${activeTab === "records" ? "bg-teal-400 text-white border-teal-400" : "bg-white text-gray-800 border-gray-200"}`}>View Patient Records</button>
            </div>

            <div className="mt-2 sm:mt-0 w-full sm:w-80">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-full px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Search patient..." />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left - Bookings & Records */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "bookings" && (
              <section className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Manage Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto text-left border-collapse">
                    <thead>
                      <tr className="text-sm text-gray-600">
                        <th className="py-3 px-4">Patient</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(a => (
                        <tr key={a.id} className="border-t">
                          <td className="py-4 px-4">{a.patient}</td>
                          <td className="py-4 px-4">{a.date}</td>
                          <td className="py-4 px-4">{a.time}</td>
                          <td className="py-4 px-4 flex gap-3">
                            <button onClick={() => setConfirmationModal({ isOpen: true, appointment: a })}
                              className="px-4 py-2 rounded-md bg-teal-400 text-white hover:brightness-90">Confirm</button>
                            <button onClick={() => handleAppointmentAction(a, "rejected")}
                              className="px-4 py-2 rounded-md border bg-white text-gray-700">Reject</button>
                            <button onClick={() => setSelectedBooking(a)}
                              className="px-4 py-2 rounded-md border bg-white text-gray-700">Consult</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Consultation Panel */}
                <AnimatePresence>
                  {selectedBooking && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 border rounded-xl p-6 bg-gray-50 shadow-inner"
                    >
                      <h4 className="text-lg font-semibold mb-4">{selectedBooking.patient} - Consultation</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="font-medium text-sm flex items-center gap-2"><User /> Doctor's Notes</label>
                          <textarea value={notes} onChange={e => setNotes(e.target.value)}
                            className="w-full border rounded-md p-2 mt-2 h-24 text-sm" placeholder="Write notes..." />
                        </div>
                        <div>
                          <label className="font-medium text-sm flex items-center gap-2"><FlaskRound /> Lab Orders</label>
                          <textarea value={labOrders} onChange={e => setLabOrders(e.target.value)}
                            className="w-full border rounded-md p-2 mt-2 h-20 text-sm" placeholder="Request lab tests..." />
                          <button onClick={sendLabRequest} className="mt-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:brightness-90">Send Lab Request</button>
                        </div>
                        <div>
                          <label className="font-medium text-sm flex items-center gap-2"><Pill /> Prescription</label>
                          <textarea value={prescriptions} onChange={e => setPrescriptions(e.target.value)}
                            className="w-full border rounded-md p-2 mt-2 h-20 text-sm" placeholder="Prescribe medicine..." />
                          <button onClick={sendPharmaRequest} className="mt-2 px-4 py-2 rounded-md bg-purple-500 text-white hover:brightness-90">Send to Pharmacist</button>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                          <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 rounded-md border bg-gray-200 text-gray-700">Cancel</button>
                          <button onClick={handleSaveRecord} className="px-6 py-2 rounded-md bg-teal-400 text-white hover:brightness-95">Save Record</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}

            {/* Patient Records */}
            {activeTab === "records" && (
              <section className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Patient Records</h3>
                <div className="mb-4 flex gap-2">
                  <input value={accessKey} onChange={e => setAccessKey(e.target.value)}
                    placeholder="Enter access key for remote records" className="border rounded-md p-2 w-64" />
                  <button onClick={fetchRemoteRecords} className="px-4 py-2 bg-teal-400 text-white rounded-md">Access</button>
                </div>
                <div className="space-y-3">
                  {filteredRecords.length === 0 && <div className="text-gray-500 py-6">No records found.</div>}
                  {filteredRecords.map(r => (
                    <div key={r.id} className="border rounded-md p-4 flex flex-col">
                      <p className="font-medium">{r.patient}</p>
                      <p className="text-xs text-gray-500">{r.date} • {r.doctor}</p>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{r.notes}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <aside className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex flex-col items-center">
                <img src={profilePic} alt="Doctor" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
                <label className="mt-3 cursor-pointer text-sm text-teal-500 underline">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <div className="mt-4 text-center">
                  <h4 className="font-semibold">{doctorName}</h4>
                  <p className="text-xs text-gray-500">{specialty}</p>
                </div>
                <div className="mt-4 w-full">
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full mt-2 border rounded-md p-2 text-sm">
                    <option>Available</option>
                    <option>On Break</option>
                    <option>In Lunch</option>
                    <option>Offline</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Futuristic Calendar */}
            <aside className="bg-gray-900 text-white p-6 rounded-xl shadow-inner">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><Calendar /> Appointments Calendar</h4>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, i) => {
                  const dateStr = `2025-10-${(i + 1).toString().padStart(2, "0")}`;
                  const count = getAppointmentsCount(dateStr);
                  return (
                    <div key={i} className={`p-3 text-center rounded-lg cursor-pointer transition-transform hover:scale-105 ${count ? "bg-teal-600/80 ring-2 ring-teal-400" : "bg-white/10"}`}>
                      <span className="font-medium">{i + 1}</span>
                      {count ? <span className="block text-xs mt-1">{count} appt</span> : null}
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Confirm Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-xl w-11/12 max-w-sm p-6 shadow-lg z-60">
            <h3 className="text-lg font-semibold mb-2">Confirm Appointment</h3>
            <p className="text-sm text-gray-500 mb-4">Do you want to confirm {confirmationModal.appointment.patient}'s appointment?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmationModal({ isOpen: false, appointment: null })}
                className="px-4 py-2 rounded-md border bg-gray-200 text-gray-700">Cancel</button>
              <button onClick={() => handleAppointmentAction(confirmationModal.appointment, "confirmed")}
                className="px-4 py-2 rounded-md bg-teal-400 text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
