import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export default function LogsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/admin/access-logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.doctor_name?.toLowerCase().includes(term) ||
      log.patient_name?.toLowerCase().includes(term) ||
      log.purpose?.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="text-gray-600">Loading access logs...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-800">
          Access Logs
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by doctor, patient, or purpose..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 text-left">Doctor</th>
              <th className="px-4 py-2 text-left">Patient</th>
              <th className="px-4 py-2 text-left">Purpose</th>
              <th className="px-4 py-2 text-left">Accessed At</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2">{log.doctor_name || "—"}</td>
                <td className="px-4 py-2">{log.patient_name || "—"}</td>
                <td className="px-4 py-2">{log.purpose || "—"}</td>
                <td className="px-4 py-2 text-gray-600">
                  {new Date(log.accessed_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <p className="text-center text-gray-600 py-4">No matching logs found.</p>
        )}
      </div>
    </div>
  );
}
