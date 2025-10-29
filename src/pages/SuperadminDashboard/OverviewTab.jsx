import {API_URL} from "../../config";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function OverviewTab() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOverview(res.data);
      } catch (err) {
        console.error("Failed to fetch overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <p className="text-gray-600">Loading dashboard...</p>;
  if (!overview) return <p className="text-red-600">Failed to load data.</p>;

  const COLORS = ["#2563eb", "#16a34a", "#f97316", "#eab308", "#9333ea"];

  const chartData = [
    { name: "Doctors", value: overview.total_doctors },
    { name: "Patients", value: overview.total_patients },
    { name: "Hospitals", value: overview.total_hospitals },
    { name: "Pending Invites", value: overview.pending_invites },
  ];

  const cards = [
    { label: "Total Users", value: overview.total_users, color: "bg-blue-100 text-blue-800" },
    { label: "Doctors", value: overview.total_doctors, color: "bg-green-100 text-green-800" },
    { label: "Patients", value: overview.total_patients, color: "bg-orange-100 text-orange-800" },
    { label: "Hospitals", value: overview.total_hospitals, color: "bg-yellow-100 text-yellow-800" },
    { label: "Pending Invites", value: overview.pending_invites, color: "bg-purple-100 text-purple-800" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-blue-800">Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl shadow p-4 flex flex-col items-center ${card.color}`}
          >
            <span className="text-sm font-medium">{card.label}</span>
            <span className="text-2xl font-bold mt-1">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Pie Chart Section */}
      {/* Pie Chart Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          User Distribution Overview
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                labelLine={false} // ✅ remove awkward lines
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, `${name}`]}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
