import React, { useState, useEffect } from "react";
import { FlaskRound, LogOut, User, UploadCloud } from "lucide-react";

export default function LabDashboard() {
  // ----- State -----
  const [loggedIn, setLoggedIn] = useState(false);
  const [technician, setTechnician] = useState({
    name: "",
    profilePic: null,
    notes: "",
  });
  const [nameInput, setNameInput] = useState("");

  const [doctors] = useState([
    { id: 1, name: "Dr. John Doe", specialty: "Pathology" },
    { id: 2, name: "Dr. Jane Smith", specialty: "Microbiology" },
  ]);

  const [patients] = useState([
    { id: 1, name: "Patient A" },
    { id: 2, name: "Patient B" },
  ]);

  const [testRequests, setTestRequests] = useState([
    { id: 1, patientId: 1, test: "Blood Test", doctorId: 1, status: "Pending" },
    { id: 2, patientId: 2, test: "Urine Test", doctorId: 2, status: "Pending" },
  ]);

  // ----- Effects -----
  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("technician", JSON.stringify(technician));
    }
  }, [loggedIn, technician]);

  // ----- Handlers -----
  const handleLogin = () => {
    if (!nameInput.trim()) return alert("Please enter your name.");
    setTechnician({ ...technician, name: nameInput.trim() });
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setTechnician({ name: "", profilePic: null, notes: "" });
    setNameInput("");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("technician");
  };

  const handleProfilePic = (e) => {
    setTechnician({ ...technician, profilePic: URL.createObjectURL(e.target.files[0]) });
  };

  const handleNotesChange = (e) => {
    setTechnician({ ...technician, notes: e.target.value });
  };

  const completeTest = (id) => {
    setTestRequests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t))
    );
  };

  const getPatientName = (id) => patients.find((p) => p.id === id)?.name;
  const getDoctorName = (id) => doctors.find((d) => d.id === id)?.name;

  // ----- Render -----
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-white">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center border-t-4 border-green-500">
          <h2 className="text-3xl font-bold mb-6 text-green-700">Lab Technician Login</h2>

          <input
            type="text"
            placeholder="Enter Your Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="border px-4 py-3 rounded-lg w-full mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-6 px-8 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Laboratory Dashboard</h1>
        <button
          className="flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg shadow hover:bg-emerald-100"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* MAIN DASHBOARD */}
      <main className="p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Technician Profile */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
          <h2 className="font-semibold text-lg mb-3">Your Profile</h2>
          <div className="flex flex-col items-center">
            {technician.profilePic ? (
              <img
                src={technician.profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-3 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <User size={36} className="text-gray-400" />
              </div>
            )}
            <span className="font-semibold">{technician.name}</span>
            <label className="mt-3 cursor-pointer px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center gap-2">
              <UploadCloud size={18} /> Upload Picture
              <input type="file" className="hidden" onChange={handleProfilePic} />
            </label>

            <textarea
              placeholder="Add your private notes..."
              value={technician.notes}
              onChange={handleNotesChange}
              className="mt-4 border rounded-lg p-2 w-full h-24 resize-none"
            />
          </div>
        </div>

        {/* Test Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition col-span-1 md:col-span-3">
          <FlaskRound className="text-green-600 w-10 h-10 mb-3" />
          <h2 className="font-semibold text-lg mb-2">Lab Test Requests</h2>
          <p className="text-gray-600 mb-3">All tests requested by doctors.</p>
          <ul className="text-gray-700">
            {testRequests.map((tr) => (
              <li
                key={tr.id}
                className="mb-2 flex justify-between items-center border-b py-1"
              >
                <span>
                  {getPatientName(tr.patientId)} - {tr.test} ({getDoctorName(tr.doctorId)})
                  [{tr.status}]
                </span>
                {tr.status === "Pending" && (
                  <button
                    className="px-2 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                    onClick={() => completeTest(tr.id)}
                  >
                    Complete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
