import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("all");

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
    fetchUsers();
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

  if (loading) return <p className="text-gray-600">Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">System Users</h2>

      {/* Search bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Role Tabs */}
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeRole === role
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/*Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-blue-50">
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
                <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      user.status === "active" ? "text-green-600" : "text-red-600"
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
    </div>
  );
}
