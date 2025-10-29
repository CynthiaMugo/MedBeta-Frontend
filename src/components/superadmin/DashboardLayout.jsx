import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Home, Users, Mail, LayoutDashboard } from "lucide-react";
import { ScrollText } from "lucide-react";
import AdminHeader from "./AdminHeader";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
  
    <div className="flex h-screen bg-gray-50 text-gray-800">
     
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-blue-800 text-white flex flex-col fixed h-full shadow-lg`}
      >
        <div className="flex items-center justify-center h-16 border-b border-blue-700">
          <h1 className="text-xl font-bold tracking-wide">
            {collapsed ? "M" : "MedBeta"}
          </h1>
        </div>

        <nav className="flex-1 mt-6 space-y-2">
          {/* Overview link */}
          <NavLink
            to="/superadmin/dashboard/overview"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <LayoutDashboard size={20} />
            {!collapsed && <span>Overview</span>}
          </NavLink>

          <NavLink
            to="/superadmin/dashboard/hospitals"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <Home size={20} />
            {!collapsed && <span>Hospitals</span>}
          </NavLink>

          <NavLink
            to="/superadmin/dashboard/invites"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <Mail size={20} />
            {!collapsed && <span>Invites</span>}
          </NavLink>

          <NavLink
            to="/superadmin/dashboard/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <Users size={20} />
            {!collapsed && <span>Users</span>}
          </NavLink>
          <NavLink
            to="/superadmin/dashboard/logs"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition ${
                isActive ? "bg-blue-700" : ""
              }`
            }
          >
            <ScrollText size={20} />
            {!collapsed && <span>Logs</span>}
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 mt-auto mb-4 hover:bg-blue-700 transition"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-blue-800">Dashboard</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition">
            Quick Action
          </button>
          <AdminHeader />
        </header>

        <div>{children}</div>
      </main>
    </div>
  );
}
