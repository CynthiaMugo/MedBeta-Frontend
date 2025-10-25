// src/pages/DoctorPortal.jsx
import React, { useState, useMemo } from "react";
import { Calendar, User, FlaskRound, Pill } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorPortal() {
  const [doctorName] = useState("Dr. Ian Mabruk");
  const [specialty] = useState("Cardiologist");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");

  const [activeTab, setActiveTab] = useState("appointments");
  const [status, setStatus] = useState("Available");
  const [searchQuery, setSearchQuery] = useState("");

  const [appointments, setAppointments] = useState([
    { id: 1, date: "2025-10-21", time: "10:00 AM", patient: "Jane Doe", status: "pending" },
    { id: 2, date: "2025-10-21", time: "11:30 AM", patient: "John Smith", status: "confirmed" },
    { id: 3, date: "2025-10-22", time: "02:00 PM", patient: "Alice Johnson", status: "pending" },
  ]);

  const [records, setRecords] = useState([]);
  const [remoteRecords, setRemoteRecords] = useState([]);
  const [accessKey, setAccessKey] = useState("");
  const [notes, setNotes] = useState("");
  const [labOrders, setLabOrders] = useState("");
  const [prescriptions, setPrescriptions] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, appointment: null });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleAppointmentAction = (appointment, action) => {
    setAppointments(prev => prev.map(a => a.id === appointment.id ? { ...a, status: action } : a));
    setConfirmationModal({ isOpen: false, appointment: null });
    alert(`${appointment.patient}'s appointment ${action}`);
  };

  const handleSaveRecord = () => {
    if (!notes && !labOrders && !prescriptions) return alert("Add consultation info.");
    const newRec = {
      id: Date.now(),
      patient: selectedBooking?.patient || "New Patient",
      doctor: doctorName,
      date: new Date().toISOString().slice(0, 10),
      notes,
      labOrders,
      prescriptions,
    };
    setRecords(prev => [newRec, ...prev]);
    setNotes(""); setLabOrders(""); setPrescriptions("");
    alert("Record saved!");
  };

  const sendLabRequest = () => { if (!labOrders) return alert("Add lab orders."); alert(`Lab request sent:\n${labOrders}`); };
  const sendPharmaRequest = () => { if (!prescriptions) return alert("Add prescription."); alert(`Prescription sent:\n${prescriptions}`); };

  const fetchRemoteRecords = () => {
    if (!accessKey) return alert("Enter access key.");
    const remote = [
      { id: 101, patient: "Remote Patient A", doctor: "Dr. Remote", date: "2025-08-15", notes: "Follow-up on previous tests", labOrders: "Blood Test, X-Ray", prescriptions: "Vitamin D, Aspirin" },
      { id: 102, patient: "Remote Patient B", doctor: "Dr. Remote", date: "2025-09-10", notes: "Annual checkup", labOrders: "Cholesterol, ECG", prescriptions: "Statins" },
    ];
    setRemoteRecords(remote);
    alert("Remote records loaded!");
  };

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [...records, ...remoteRecords];
    return [...records, ...remoteRecords].filter(r => r.patient.toLowerCase().includes(q) || r.notes.toLowerCase().includes(q));
  }, [records, remoteRecords, searchQuery]);

  const groupedAppointments = useMemo(() => ({
    pending: appointments.filter(a => a.status === "pending"),
    confirmed: appointments.filter(a => a.status === "confirmed"),
    rejected: appointments.filter(a => a.status === "rejected"),
  }), [appointments]);

  const getAppointmentsCount = (dateStr) => appointments.filter(a => a.date === dateStr && a.status === "confirmed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-400 to-green-100 p-6 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl font-bold text-green-900">MedBeta</h2>
          <p className="text-sm text-green-700">Doctor Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="relative cursor-pointer">
            <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-green-500 shadow" />
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
          </label>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 grid lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-3 mb-4">
            <button onClick={() => setActiveTab("appointments")} className={`px-4 py-2 rounded-xl font-semibold ${activeTab === "appointments" ? "bg-green-600 text-white" : "bg-white text-green-800 border border-green-300"}`}>Appointments</button>
            <button onClick={() => setActiveTab("records")} className={`px-4 py-2 rounded-xl font-semibold ${activeTab === "records" ? "bg-green-600 text-white" : "bg-white text-green-800 border border-green-300"}`}>Patient Records</button>
          </div>

          {/* Kanban Appointments */}
          {activeTab === "appointments" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["pending", "confirmed", "rejected"].map(statusKey => (
                <div key={statusKey} className="bg-white p-3 rounded-xl shadow flex flex-col">
                  <h4 className="font-semibold text-green-900 capitalize mb-2">{statusKey}</h4>
                  <div className="space-y-3 overflow-y-auto max-h-[400px]">
                    {groupedAppointments[statusKey].map(a => (
                      <motion.div
                        key={a.id}
                        layout
                        className="p-3 bg-green-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                      >
                        <div>
                          <h5 className="font-semibold text-green-900">{a.patient}</h5>
                          <p className="text-sm text-green-800">{a.date} • {a.time}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {statusKey !== "confirmed" && <button onClick={() => handleAppointmentAction(a, "confirmed")} className="px-2 py-1 bg-green-500 text-white rounded text-sm">Confirm</button>}
                          {statusKey !== "rejected" && <button onClick={() => handleAppointmentAction(a, "rejected")} className="px-2 py-1 border text-green-800 rounded text-sm">Reject</button>}
                          <button onClick={() => setSelectedBooking(a)} className="px-2 py-1 bg-green-700 text-white rounded text-sm">Consult</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Patient Records */}
          {activeTab === "records" && (
            <div className="space-y-3">
              <div className="flex gap-2 mb-3">
                <input value={accessKey} onChange={e => setAccessKey(e.target.value)} placeholder="Access Key" className="p-2 border rounded w-64" />
                <button onClick={fetchRemoteRecords} className="px-3 py-1 bg-green-500 text-white rounded hover:brightness-95">Fetch Records</button>
              </div>

              {filteredRecords.length === 0 ? (
                <p className="text-green-800">No records found</p>
              ) : (
                <div className="space-y-3">
                  {filteredRecords.map(r => (
                    <motion.div
                      key={r.id}
                      layout
                      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                      onClick={() => setExpandedRecord(expandedRecord?.id === r.id ? null : r)}
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-semibold text-green-900">{r.patient}</h5>
                        <span className="text-sm text-green-700">{r.date}</span>
                      </div>
                      <AnimatePresence>
                        {expandedRecord?.id === r.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 space-y-2">
                            <div>
                              <h6 className="text-sm font-medium text-green-800 flex items-center gap-2"><User /> Doctor Notes</h6>
                              <p className="text-sm text-green-700 whitespace-pre-wrap">{r.notes}</p>
                            </div>
                            <div>
                              <h6 className="text-sm font-medium text-green-800 flex items-center gap-2"><FlaskRound /> Lab Tests</h6>
                              <p className="text-sm text-green-700 whitespace-pre-wrap">{r.labOrders}</p>
                            </div>
                            <div>
                              <h6 className="text-sm font-medium text-green-800 flex items-center gap-2"><Pill /> Prescriptions</h6>
                              <p className="text-sm text-green-700 whitespace-pre-wrap">{r.prescriptions}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <img src={profilePic} alt="Doctor" className="w-24 h-24 mx-auto rounded-full border-4 border-green-400 shadow" />
            <h4 className="mt-3 font-semibold text-green-900">{doctorName}</h4>
            <p className="text-sm text-green-800">{specialty}</p>
            <div className="mt-3">
              <label className="text-sm font-medium text-green-700">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 w-full border rounded p-2">
                <option>Available</option>
                <option>On Break</option>
                <option>In Lunch</option>
                <option>Offline</option>
              </select>
            </div>
          </div>

          <div className="bg-green-900 text-white p-4 rounded-xl shadow">
            <h5 className="font-semibold mb-2 flex items-center gap-2"><Calendar /> Appointments Calendar</h5>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }).map((_, i) => {
                const dateStr = `2025-10-${(i + 1).toString().padStart(2, "0")}`;
                const count = getAppointmentsCount(dateStr);
                return (
                  <div key={i} className={`p-2 text-center rounded cursor-pointer ${count ? "bg-green-500" : "bg-green-800/50"}`}>
                    <span className="text-sm font-medium">{i + 1}</span>
                    {count ? <span className="block text-xs">{count} appt</span> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Confirm Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30" />
          <div className="bg-white p-6 rounded-xl shadow relative z-60">
            <h3 className="font-semibold text-lg mb-2">Confirm Appointment</h3>
            <p className="text-green-800 mb-4">Confirm {confirmationModal.appointment.patient}'s appointment?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmationModal({ isOpen: false, appointment: null })} className="px-3 py-1 border rounded text-green-800">Cancel</button>
              <button onClick={() => handleAppointmentAction(confirmationModal.appointment, "confirmed")} className="px-3 py-1 bg-green-600 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Panel */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 bg-white rounded-xl shadow p-6 z-40">
            <h4 className="font-semibold text-green-900 mb-3">{selectedBooking.patient} - Consultation</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><User /> Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border rounded p-2 mt-1" placeholder="Doctor notes..." />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><FlaskRound /> Lab Orders</label>
                <textarea value={labOrders} onChange={e => setLabOrders(e.target.value)} className="w-full border rounded p-2 mt-1" placeholder="Lab orders..." />
                <button onClick={sendLabRequest} className="mt-1 px-3 py-1 bg-green-500 text-white rounded hover:brightness-95">Send Lab Request</button>
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Pill /> Prescription</label>
                <textarea value={prescriptions} onChange={e => setPrescriptions(e.target.value)} className="w-full border rounded p-2 mt-1" placeholder="Prescriptions..." />
                <button onClick={sendPharmaRequest} className="mt-1 px-3 py-1 bg-green-700 text-white rounded hover:brightness-95">Send to Pharmacist</button>
              </div>
              <div className="flex justify-end gap-3 mt-3">
                <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 rounded border text-green-800">Cancel</button>
                <button onClick={handleSaveRecord} className="px-5 py-2 bg-green-600 text-white rounded hover:brightness-110">Save Record</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
