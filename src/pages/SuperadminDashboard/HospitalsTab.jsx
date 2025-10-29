import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import DataTable from "../../components/superadmin/DataTable";
import InviteModal from "../../components/superadmin/InviteModal";

export default function HospitalsTab() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/hospitals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHospitals(res.data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (email, name) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/admin/invite-user`,
        { email, name, role: "hospital" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Invitation sent successfully!");
      setShowInviteModal(false);
      fetchHospitals();
    } catch (error) {
      console.error("Error sending invite:", error);
      alert(error.response?.data?.error || "Failed to send invite");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Hospitals</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          + Add Hospital
        </button>
      </div>

      {loading ? (
        <p>Loading hospitals...</p>
      ) : hospitals.length > 0 ? (
        <DataTable
          columns={["Name", "Email", "Address", "License"]}
          data={hospitals.map((h) => [
            h.name,
            h.email,
            h.location || "—",
            h.license_number || "—"
            // new Date(h.created_at).toLocaleDateString(),
          ])}
        />
      ) : (
        <p className="text-gray-600">No hospitals found.</p>
      )}

      {showInviteModal && (
        <InviteModal
          title="Invite Hospital"
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInvite}
        />
      )}
    </div>
  );
}
