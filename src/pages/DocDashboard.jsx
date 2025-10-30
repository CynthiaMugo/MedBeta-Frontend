import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { FaUserMd, FaClipboardList, FaFileMedical, FaPrescriptionBottleAlt, FaCalendarCheck, FaSearch } from "react-icons/fa";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState({ id: "", name: "", email: "" });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchPatientId, setSearchPatientId] = useState("");
  const [newRecord, setNewRecord] = useState({ patient_id: "", diagnosis: "", treatment: "", notes: "" });
  const [newPrescription, setNewPrescription] = useState({ patient_id: "", medication_details: "" });
  const [editingRecord, setEditingRecord] = useState(null);
  const [editValues, setEditValues] = useState({ diagnosis: "", treatment: "", notes: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctors/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setDoctor(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctors/appointments`, { headers: { Authorization: `Bearer ${token}` } });
      setAppointments(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctors/patients`, { headers: { Authorization: `Bearer ${token}` } });
      setPatients(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchRecordsForPatient = async (patientId) => {
    if (!patientId) return setRecords([]);
    try {
      const res = await axios.get(`${API_URL}/medical-records/patient/${patientId}`, { headers: { Authorization: `Bearer ${token}` } });
      setRecords(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.patient_id) return alert("Select a patient!");
    try {
      await axios.post(`${API_URL}/medical-records/`, newRecord, { headers: { Authorization: `Bearer ${token}` } });
      setNewRecord({ patient_id: "", diagnosis: "", treatment: "", notes: "" });
      fetchRecordsForPatient(searchPatientId);
    } catch (err) { console.error(err); }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!newPrescription.patient_id) return alert("Select a patient!");
    try {
      await axios.post(`${API_URL}/prescriptions`, { doctor_id: doctor.id, ...newPrescription }, { headers: { Authorization: `Bearer ${token}` } });
      setNewPrescription({ patient_id: "", medication_details: "" });
      alert("Prescription added successfully!");
    } catch (err) { console.error(err); }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/doctors/appointments/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAppointments();
    } catch (err) { console.error(err); }
  };

  const updateRecord = async () => {
    try {
      await axios.put(`${API_URL}/medical-records/${editingRecord.id}`, editValues, { headers: { Authorization: `Bearer ${token}` } });
      fetchRecordsForPatient(searchPatientId);
      setEditingRecord(null);
    } catch (err) { console.error(err); }
  };

  

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500 text-lg animate-pulse">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8 space-y-8">
      {/* Doctor Header */}
      <div className="flex items-center justify-between bg-white shadow-sm p-6 rounded-2xl border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-700 rounded-full p-4">
            <FaUserMd size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-blue-800">{doctor.name}</h1>
            <p className="text-gray-600">{doctor.email}</p>
            {doctor.specialization && (
              <p className="text-sm italic text-blue-600">
                Specialization: {doctor.specialization}
              </p>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/auth"; 
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Appointments */}
      <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-4"><FaCalendarCheck className="mr-2 text-blue-500" /> Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500 italic flex items-center"><FaClipboardList className="mr-2" /> No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm table-fixed">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th className="p-2 w-1/4 text-left">Patient</th>
                  <th className="p-2 w-1/4 text-left">Date & Time</th>
                  <th className="p-2 w-1/4 text-left">Status</th>
                  <th className="p-2 w-1/4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-2 truncate">{a.patient_name}</td>
                    <td className="p-2 truncate">{new Date(a.date).toLocaleString()}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-white text-xs ${a.status==="pending"?"bg-yellow-500":a.status==="accepted"?"bg-green-500":"bg-red-500"}`}>{a.status}</span>
                    </td>
                    <td className="p-2 space-x-2">
                      {a.status==="pending" && (
                        <>
                          <button onClick={()=>updateAppointmentStatus(a.id,"accepted")} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                          <button onClick={()=>updateAppointmentStatus(a.id,"declined")} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Decline</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Records + Prescriptions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Medical Records */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-4"><FaFileMedical className="mr-2 text-blue-500" /> Medical Records</h2>

          {/* Patient Search */}
          <div className="flex items-center mb-4 space-x-2">
            <select
              value={searchPatientId}
              onChange={(e)=>{ setSearchPatientId(e.target.value); fetchRecordsForPatient(e.target.value); }}
              className="border rounded-lg p-2"
            >
              <option value="">Select Patient</option>
              {patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <FaSearch className="text-gray-500" />
          </div>

          {records.length===0 ? (
            <p className="text-gray-500 italic flex items-center mb-4"><FaClipboardList className="mr-2" /> No records found.</p>
          ) : (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm border">
                <thead className="bg-blue-100 text-blue-900">
                  <tr>
                    <th className="p-2">Doctor</th>
                    <th className="p-2">Diagnosis</th>
                    <th className="p-2">Treatment</th>
                    <th className="p-2">Notes</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map(r => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">
                        {r.doctor ? r.doctor.name : "—"}
                        {r.doctor?.specialization && (
                          <span className="block text-xs text-gray-500 italic">
                            {r.doctor.specialization}
                          </span>
                        )}
                      </td>
                      <td className="p-2">{r.diagnosis}</td>
                      <td className="p-2">{r.treatment}</td>
                      <td className="p-2">{r.notes}</td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setEditingRecord(r);
                            setEditValues({
                              diagnosis: r.diagnosis,
                              treatment: r.treatment,
                              notes: r.notes
                            });
                          }}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}

          {/* Edit Form */}
          {editingRecord && (
            <div className="bg-gray-50 border border-gray-300 p-4 rounded mt-4">
              <h3 className="font-semibold text-blue-600 mb-2">Update Record</h3>
              <input type="text" placeholder="Diagnosis" value={editValues.diagnosis} onChange={e=>setEditValues({...editValues, diagnosis:e.target.value})} className="w-full border rounded-lg p-2 mb-2"/>
              <input type="text" placeholder="Treatment" value={editValues.treatment} onChange={e=>setEditValues({...editValues, treatment:e.target.value})} className="w-full border rounded-lg p-2 mb-2"/>
              <textarea placeholder="Notes" value={editValues.notes} onChange={e=>setEditValues({...editValues, notes:e.target.value})} className="w-full border rounded-lg p-2 mb-2"/>
              <div className="flex space-x-2">
                <button onClick={updateRecord} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
                <button onClick={()=>setEditingRecord(null)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
              </div>
            </div>
          )}

          {/* Add Record Form */}
          <form onSubmit={handleAddRecord} className="space-y-2 mt-4">
            <h3 className="font-semibold text-blue-600">Add New Record</h3>
            <select value={newRecord.patient_id} onChange={e=>setNewRecord({...newRecord, patient_id:e.target.value})} className="w-full border rounded-lg p-2" required>
              <option value="">Select Patient</option>
              {patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="text" placeholder="Diagnosis" value={newRecord.diagnosis} onChange={e=>setNewRecord({...newRecord, diagnosis:e.target.value})} className="w-full border rounded-lg p-2" required/>
            <input type="text" placeholder="Treatment" value={newRecord.treatment} onChange={e=>setNewRecord({...newRecord, treatment:e.target.value})} className="w-full border rounded-lg p-2"/>
                        <textarea
              placeholder="Notes"
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Record
            </button>
          </form>
        </section>

        {/* Prescriptions */}
        <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center mb-4">
            <FaPrescriptionBottleAlt className="mr-2 text-blue-500" /> Create Prescription
          </h2>
          <form onSubmit={handleAddPrescription} className="space-y-2">
            <select
              value={newPrescription.patient_id}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, patient_id: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Medication Details (e.g., medicine + dosage)"
              value={newPrescription.medication_details}
              onChange={(e) =>
                setNewPrescription({ ...newPrescription, medication_details: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Prescription
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

