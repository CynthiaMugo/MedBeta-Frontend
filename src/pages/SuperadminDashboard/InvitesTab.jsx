import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { Search } from "lucide-react";

export default function InvitesTab() {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/admin/pending-staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingStaff(res.data);
        setFilteredStaff(res.data);
      } catch (err) {
        console.error("Error fetching pending staff:", err);
        setError("Failed to load pending invites.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStaff();
  }, []);

  // Filter logic
  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = pendingStaff.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
    );
    setFilteredStaff(filtered);
  }, [search, pendingStaff]);

  const handleInvite = async (user) => {
    try {
      setSending(user.id);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/admin/invite-user`,
        {
          email: user.email,
          name: user.name,
          role: user.role,
          hospital_id: user.hospital_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message || "Invite sent successfully!");
    } catch (err) {
      console.error("Error sending invite:", err);
      alert(err.response?.data?.error || "Failed to send invite.");
    } finally {
      setSending(null);
    }
  };

  if (loading) return <p className="text-gray-600">Loading pending invites...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Pending Invites</h2>

        {/* 🔍 Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {filteredStaff.length === 0 ? (
        <p className="text-gray-700">No pending staff found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Hospital</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">{user.hospital_name || "—"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleInvite(user)}
                      disabled={sending === user.id}
                      className={`${
                        sending === user.id
                          ? "bg-green-300"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white font-medium px-3 py-1 rounded-md transition`}
                    >
                      {sending === user.id ? "Sending..." : "Invite"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
