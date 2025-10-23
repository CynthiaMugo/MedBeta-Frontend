// src/pages/DoctorsDashboard.jsx
import React, { useState, useMemo } from "react";
import { Calendar, User, FlaskRound, Pill, LogOut } from "lucide-react";
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
  ]);

  const [newPatient, setNewPatient] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const [records, setRecords] = useState([]);
  const [remoteRecords, setRemoteRecords] = useState([]);
  const [accessKey, setAccessKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    appointment: null,
  });

  // ===== Image Handler =====
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  // ===== Appointment Actions =====
  const handleAppointmentAction = (appointment, action) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointment.id ? { ...a, status: action } : a))
    );
    setConfirmationModal({ isOpen: false, appointment: null });
    if (action === "confirmed") {
      alert(`${appointment.patient}'s appointment confirmed!`);
    } else if (action === "rejected") {
      alert(`${appointment.patient}'s appointment was rejected!`);
    }
  };

  // ===== Save Record =====
  const handleSaveRecord = () => {
    if (!notes.trim() && !labOrders.trim() && !prescriptions.trim()) {
      return alert("Please enter consultation info.");
    }
    const newRec = {
      id: Date.now(),
      patient: selectedBooking?.patient || "New Patient",
      doctor: doctorName,
      date: new Date().toISOString().slice(0, 10),
      notes: `Notes: ${notes}\nLab Orders: ${labOrders}\nPrescription: ${prescriptions}`,
    };
    setRecords((prev) => [newRec, ...prev]);
    setNotes("");
    setLabOrders("");
    setPrescriptions("");
    alert("Record saved successfully!");
  };

  // ===== Add Booking from Receptionist =====
  const handleAddBooking = () => {
    if (!newPatient || !newDate || !newTime)
      return alert("Please fill all fields to add booking.");
    const newAppointment = {
      id: Date.now(),
      patient: newPatient,
      date: newDate,
      time: newTime,
      status: "pending",
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setNewPatient("");
    setNewDate("");
    setNewTime("");
    alert("New booking added from receptionist!");
  };

  // ===== Filtered Records =====
  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [...records, ...remoteRecords];
    return [...records, ...remoteRecords].filter(
      (r) =>
        r.patient.toLowerCase().includes(q) ||
        (r.notes || "").toLowerCase().includes(q)
    );
  }, [records, remoteRecords, searchQuery]);

  // ===== Appointments Count =====
  const getAppointmentsCount = (dateStr) =>
    appointments.filter((a) => a.date === dateStr && a.status === "confirmed").length;

  // ===== Logout =====
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.location.href = "/";
    }
  };

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-teal-500 rounded-full shadow">
            <span className="font-bold text-white text-lg">+</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">MedBeta</h2>
            <p className="text-xs text-gray-500">Doctor Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right mr-3">
            <div className="text-sm font-medium">{doctorName}</div>
            <div className="text-xs text-gray-500">{specialty}</div>
          </div>
          <label className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
            />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </label>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 shadow-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">
              Welcome back, <span className="text-black">{doctorName}</span>
            </h1>
            <p className="mt-2 text-gray-500">
              Manage bookings, patient records, and consultation panels below.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-5 py-2 rounded-xl border ${
                activeTab === "bookings"
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-gray-800 border-gray-200"
              }`}
            >
              Manage Bookings
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-5 py-2 rounded-xl border ${
                activeTab === "records"
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-gray-800 border-gray-200"
              }`}
            >
              View Records
            </button>
          </div>
        </div>

        {/* Bookings Section */}
        {activeTab === "bookings" && (
          <section className="mt-8 bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-2xl font-bold mb-4">Manage Bookings</h3>

            {/* Add new booking (Receptionist Simulation) */}
            <div className="flex flex-wrap gap-3 mb-6">
              <input
                type="text"
                placeholder="Patient Name"
                value={newPatient}
                onChange={(e) => setNewPatient(e.target.value)}
                className="border rounded-md p-2 w-40 text-sm"
              />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="border rounded-md p-2 text-sm"
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="border rounded-md p-2 text-sm"
              />
              <button
                onClick={handleAddBooking}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:brightness-95"
              >
                Add Booking
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-gray-600 border-b">
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-gray-100/50">
                      <td className="py-3 px-4 font-medium">{a.patient}</td>
                      <td className="py-3 px-4">{a.date}</td>
                      <td className="py-3 px-4">{a.time}</td>
                      <td className="py-3 px-4 capitalize">
                        {a.status === "confirmed" ? (
                          <span className="text-teal-600 font-semibold">Confirmed</span>
                        ) : (
                          <span className="text-yellow-600">{a.status}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() =>
                            setConfirmationModal({ isOpen: true, appointment: a })
                          }
                          className="px-3 py-1 bg-teal-500 text-white rounded-md"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(a, "rejected")}
                          className="px-3 py-1 border rounded-md"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => setSelectedBooking(a)}
                          className="px-3 py-1 border rounded-md"
                        >
                          Consult
                        </button>
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
                  className="mt-6 bg-white border rounded-xl p-6 shadow-sm"
                >
                  <h4 className="text-lg font-semibold mb-4">
                    Consultation - {selectedBooking.patient}
                  </h4>
                  <div className="space-y-4">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Doctor's Notes..."
                      className="w-full border rounded-md p-3 text-sm h-20"
                    />
                    <textarea
                      value={labOrders}
                      onChange={(e) => setLabOrders(e.target.value)}
                      placeholder="Lab Orders..."
                      className="w-full border rounded-md p-3 text-sm h-20"
                    />
                    <textarea
                      value={prescriptions}
                      onChange={(e) => setPrescriptions(e.target.value)}
                      placeholder="Prescription..."
                      className="w-full border rounded-md p-3 text-sm h-20"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedBooking(null)}
                        className="px-4 py-2 bg-gray-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveRecord}
                        className="px-4 py-2 bg-teal-500 text-white rounded-md"
                      >
                        Save Record
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Patient Records */}
        {activeTab === "records" && (
          <section className="mt-8 bg-gray-50 p-6 rounded-xl shadow-inner">
            <h3 className="text-2xl font-bold mb-4">Patient Records</h3>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded-full px-4 py-3 text-sm mb-4"
              placeholder="Search patient..."
            />
            <div className="space-y-3">
              {filteredRecords.length === 0 && (
                <div className="text-gray-500 text-center py-6">No records found.</div>
              )}
              {filteredRecords.map((r) => (
                <div key={r.id} className="border rounded-md p-4 bg-white shadow-sm">
                  <p className="font-medium">{r.patient}</p>
                  <p className="text-xs text-gray-500">
                    {r.date} • {r.doctor}
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{r.notes}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Improved Calendar */}
        <section className="mt-10 bg-gray-900 text-white p-6 rounded-xl shadow-inner">
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Calendar /> Appointment Calendar
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => {
              const dateStr = `2025-10-${String(i + 1).padStart(2, "0")}`;
              const count = getAppointmentsCount(dateStr);
              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-center cursor-pointer transition-transform hover:scale-105 ${
                    count
                      ? "bg-teal-600 ring-2 ring-teal-400"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <span className="font-semibold text-sm">{i + 1}</span>
                  {count > 0 && (
                    <span className="block text-xs text-teal-200 mt-1">{count} appt</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-xl w-11/12 max-w-sm p-6 shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-3">Confirm Appointment</h3>
            <p className="text-gray-600 mb-6">
              Confirm appointment for{" "}
              <span className="font-semibold">
                {confirmationModal.appointment?.patient}
              </span>{" "}
              on {confirmationModal.appointment?.date} at{" "}
              {confirmationModal.appointment?.time}?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  handleAppointmentAction(confirmationModal.appointment, "confirmed")
                }
                className="px-5 py-2 bg-teal-500 text-white rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() =>
                  setConfirmationModal({ isOpen: false, appointment: null })
                }
                className="px-5 py-2 border rounded-md bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
