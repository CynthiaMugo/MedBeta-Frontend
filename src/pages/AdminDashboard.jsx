// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPending() {
    setLoading(true);
    const res = await fetch("http://localhost:5000/users?role=doctor&status=pending");
    const data = await res.json();
    setPending(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPending();
  }, []);

  async function approveDoctor(id) {
    if (!window.confirm("Approve this doctor and send credentials via email?")) return;

    // send adminName & loginUrl so email contains correct login link
    const res = await fetch(`http://localhost:5000/users/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminName: "Admin", loginUrl: "http://localhost:3000/auth" }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Doctor approved and email sent (if email config is correct).");
      fetchPending();
    } else {
      alert("Could not approve: " + (data.error || JSON.stringify(data)));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hospital Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <RegisterDoctorForm onCreated={() => fetchPending()} />
        </div>

        <div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Pending Doctors</h3>
            {loading ? <p>Loading...</p> : pending.length === 0 ? <p>No pending doctors</p> : (
              <ul>
                {pending.map((d) => (
                  <li key={d.id} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-sm text-gray-600">{d.email} • {d.meta?.department || "—"}</div>
                    </div>
                    <div>
                      <button onClick={() => approveDoctor(d.id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
