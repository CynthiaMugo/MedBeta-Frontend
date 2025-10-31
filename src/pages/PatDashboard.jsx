// src/pages/PatientDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../config";

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("book");
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const formatDateForAPI = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    fetchAppointments();
    fetchMedicalRecords();
    fetchPrescriptions();
    fetchHospitals();
    fetchDoctorsAll();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/appointments`, authHeader());
      setAppointments(res.data || []);
    } catch {
      setAppointments([]);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/medical-records`, authHeader());
      setRecords(res.data || []);
    } catch {
      setRecords([]);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/prescriptions`, authHeader());
      setPrescriptions(res.data || []);
    } catch {
      setPrescriptions([]);
    }
  };

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/hospitals`, authHeader());
      setHospitals(res.data || []);
    } catch {
      setHospitals([]);
    }
  };

  const fetchDoctorsAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/doctors`, authHeader());
      setDoctors(res.data || []);
    } catch {
      setDoctors([]);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedTime) {
      alert("Please select both a doctor and time.");
      return;
    }

    const payload = {
      doctor_id: selectedDoctor,
      hospital_id: selectedHospital || null,
      date: formatDateForAPI(selectedDate),
      time: selectedTime,
    };

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/patients/appointments`, payload, authHeader());
      alert(res.data?.message || "Appointment scheduled.");
      fetchAppointments();
      setSelectedHospital("");
      setSelectedDoctor("");
      setSelectedTime("");
      setSelectedDate(new Date());
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to schedule appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderTabs = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[
        { key: "book", label: "Book Appointment" },
        { key: "history", label: "Appointment History" },
        { key: "records", label: "Medical Records" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
            activeTab === key
              ? "bg-blue-700 text-white shadow-md"
              : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/auth";
        }}
        className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition"
      >
        Logout
      </button>

      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800 drop-shadow-sm">
        Patient Dashboard
      </h1>

      {renderTabs()}

      {/* Book View */}
      {activeTab === "book" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 border-t-4 border-blue-600">
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Select Date</h2>
            <Calendar
              onChange={(d) => setSelectedDate(Array.isArray(d) ? d[0] : d)}
              value={selectedDate}
              className="react-calendar"
            />
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2 bg-white shadow-lg rounded-2xl p-6 border-t-4 border-blue-600">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Schedule Appointment</h2>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.name} — {d.specialization || d.speciality || "General"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Time</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">
                  <strong>Selected:</strong> {formatDateForAPI(selectedDate)}{" "}
                  {selectedTime && `at ${selectedTime}`}
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {loading ? "Scheduling…" : "Schedule Appointment"}
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm text-blue-800">
              💡 Tip: Pick a date and doctor, then choose a time slot to schedule instantly.
            </div>
          </div>
        </div>
      )}

      {/* History View */}
      {activeTab === "history" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Appointment History</h2>
          {appointments.length > 0 ? (
            <ul className="space-y-3">
              {appointments.map((a) => (
                <li
                  key={a.id}
                  className="border p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-blue-800">
                        {a.date} {a.time && `at ${a.time}`}
                      </p>
                      <p className="text-sm text-gray-700">
                        {a.doctor ? `Dr. ${a.doctor.name}` : "Doctor"}
                      </p>
                      <p className="text-sm text-gray-500">{a.hospital?.name || ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{a.status}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No appointments found.</p>
          )}
        </div>
      )}

      {/* Medical Records View */}
      {activeTab === "records" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Medical Records</h2>
          {records.length > 0 ? (
            <ul className="space-y-4">
              {records.map((r) => (
                <li
                  key={r.id}
                  className="border p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                >
                  <p>
                    <strong>Diagnosis:</strong> {r.diagnosis}
                  </p>
                  <p>
                    <strong>Treatment:</strong> {r.treatment}
                  </p>
                  {r.doctor && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>
                        <strong>Doctor:</strong> Dr. {r.doctor.name}
                      </p>
                      <p>
                        <strong>Specialization:</strong> {r.doctor.specialization}
                      </p>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    <strong>Date:</strong>{" "}
                    {new Date(r.created_at).toLocaleDateString()}{" "}
                    {new Date(r.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No medical records available.</p>
          )}
        </div>
      )}

      {/* Prescriptions */}
      <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 border-t-4 border-blue-600">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">Prescriptions</h2>
        {prescriptions.length > 0 ? (
          <ul className="space-y-2">
            {prescriptions.map((p) => (
              <li key={p.id} className="border p-3 rounded-md bg-blue-50">
                <p>
                  <strong>Medication:</strong> {p.medication_details || p.medication || "—"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Issued:</strong> {p.issued_date || p.created_at || "—"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No prescriptions found.</p>
        )}
      </div>
    </div>
  );
}
