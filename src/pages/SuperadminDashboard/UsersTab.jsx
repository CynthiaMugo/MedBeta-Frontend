import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("all");

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "doctor",
    hospital_id: "", // for doctors
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");

  // Hospital list for doctor invites
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/admin/hospitals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHospitals(res.data);
      } catch (err) {
        console.error("Failed to fetch hospitals", err);
      }
    };

    fetchUsers();
    fetchHospitals();
  }, []);

  const roles = ["all", ...new Set(users.map((u) => u.role))];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      activeRole === "all" || user.role.toLowerCase() === activeRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleInviteChange = (e) => {
    setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
  };

  const handleInviteSubmit = async (e) => {
      e.preventDefault();
      setInviteLoading(true);
      setInviteMessage("");

      try {
        const token = localStorage.getItem("token");

        // Prepare payload
        const payload = {
          name: inviteForm.name,
          email: inviteForm.email,
          role: inviteForm.role,
          hospital_id: inviteForm.role === "doctor" ? inviteForm.hospital_id : null,
        };

        const res = await axios.post(`${API_URL}/admin/invite-user`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setInviteMessage(res.data.message || "Invite sent successfully!");
        setInviteForm({ name: "", email: "", role: "doctor", hospital_id: "" });
      } catch (err) {
        setInviteMessage(err.response?.data?.error || "Failed to send invitation.");
      } finally {
        setInviteLoading(false);
      }
    };


  if (loading) return <p className="text-gray-600">Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4 flex justify-between items-center">
        System Users
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
        >
          + Invite User
        </button>
      </h2>

      {/* Search + Role Tabs */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeRole === role
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-gray-700">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      user.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.status}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity ${
          showInviteModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-20"
          onClick={() => setShowInviteModal(false)}
        ></div>
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative z-10 transition-transform transform scale-100">
          <button
            onClick={() => setShowInviteModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Invite New User
          </h3>
          <form onSubmit={handleInviteSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <input
                name="name"
                value={inviteForm.name}
                onChange={handleInviteChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={inviteForm.email}
                onChange={handleInviteChange}
                required
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Role</label>
              <select
                name="role"
                value={inviteForm.role}
                onChange={handleInviteChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="doctor">Doctor</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            {/* Show hospital dropdown only if role is doctor */}
            {inviteForm.role === "doctor" && (
              <div>
                <label className="block text-sm text-gray-700">Hospital</label>
                <select
                  name="hospital_id"
                  value={inviteForm.hospital_id}
                  onChange={handleInviteChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a hospital</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {inviteMessage && (
              <p
                className={`text-sm ${
                  inviteMessage.toLowerCase().includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {inviteMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={inviteLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-2 transition"
            >
              {inviteLoading ? "Sending..." : "Send Invite"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

