import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    doctor_id: "",
    hospital_id: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
    fetchMedicalRecords();
    fetchPrescriptions();
    fetchHospitals();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/medical-records`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(res.data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    }
  };

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients/hospitals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHospitals(res.data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  const handleHospitalChange = async (e) => {
    const hospitalId = e.target.value;
    setNewAppointment({ ...newAppointment, hospital_id: hospitalId, doctor_id: "" });

    if (hospitalId) {
      const res = await axios.get(`${API_URL}/patients/hospitals/${hospitalId}/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilteredDoctors(res.data);
    } else {
      setFilteredDoctors([]);
    }
  };

  const handleAppointmentCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/patients/appointments`, newAppointment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      fetchAppointments();
      setNewAppointment({ doctor_id: "", hospital_id: "", date: "", time: "" });
    } catch (err) {
      alert("Failed to book appointment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Patient Dashboard</h1>

      {/* Book & View Appointments Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Appointment */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Book New Appointment</h2>
          <form onSubmit={handleAppointmentCreate} className="space-y-3">
            <select
              value={newAppointment.hospital_id}
              onChange={handleHospitalChange}
              className="border p-2 w-full rounded-md"
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.location}
                </option>
              ))}
            </select>

            <select
              value={newAppointment.doctor_id}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, doctor_id: e.target.value })
              }
              className="border p-2 w-full rounded-md"
              required
              disabled={!filteredDoctors.length}
            >
              <option value="">Select Doctor</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} — {d.specialization}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              className="border p-2 w-full rounded-md"
              required
            />
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              className="border p-2 w-full rounded-md"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="bg-white shadow p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Appointments</h2>
          {appointments.length > 0 ? (
            <ul className="space-y-2">
              {appointments.map((a) => (
                <li
                  key={a.id}
                  className="border p-3 rounded-md hover:bg-gray-100 transition"
                >
                  <p>
                    <strong>{a.date} at {a.time}</strong> — {a.status}
                  </p>
                  {a.doctor && (
                    <p className="text-sm text-gray-700">
                      Dr. {a.doctor.name} — {a.doctor.specialization}
                    </p>
                  )}
                  {a.hospital && (
                    <p className="text-sm text-gray-500">{a.hospital.name} — {a.hospital.location}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No appointments found.</p>
          )}
        </div>
      </div>

      {/* Medical Records */}
      <div className="bg-white shadow p-6 rounded-xl mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Medical Records</h2>
        {records.length > 0 ? (
          <ul className="space-y-3">
            {records.map((r) => (
              <li key={r.id} className="border p-4 rounded-md bg-gray-50 hover:bg-gray-100 transition">
                <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
                <p><strong>Treatment:</strong> {r.treatment}</p>
                {r.doctor && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p><strong>Doctor:</strong> Dr. {r.doctor.name}</p>
                    <p><strong>Specialization:</strong> {r.doctor.specialization}</p>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  <strong>Date:</strong>{" "}
                  {new Date(r.created_at).toLocaleDateString()}{" "}
                  {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No medical records available.</p>
        )}
      </div>

      {/* Prescriptions */}
      <div className="bg-white shadow p-6 rounded-xl mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Prescriptions</h2>
        {prescriptions.length > 0 ? (
          <ul className="space-y-2">
            {prescriptions.map((p) => (
              <li key={p.id} className="border p-3 rounded-md">
                <p><strong>Medication:</strong> {p.medication_details}</p>
                <p><strong>Issued:</strong> {p.issued_date}</p>
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
