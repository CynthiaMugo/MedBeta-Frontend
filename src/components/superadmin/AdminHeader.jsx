
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState("superadmin");

  // Load the saved role if user has previously switched
  useEffect(() => {
    const storedRole = localStorage.getItem("viewAs");
    if (storedRole) setCurrentRole(storedRole);
  }, []);

  const handleViewAs = (role) => {
    setCurrentRole(role);
    localStorage.setItem("viewAs", role);

    // Navigate to that role’s dashboard
    switch (role) {
      case "doctor":
        navigate("/doctor/dashboard");
        break;
      case "patient":
        navigate("/patient/dashboard");
        break;
      case "lab":
        navigate("/lab/dashboard");
        break;
      case "pharmacist":
        navigate("/pharmacist/dashboard");
        break;
      case "hospital":
        navigate("/hospital/dashboard");
        break;
      default:
        navigate("/superadmin/dashboard");
    }
  };

  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-3">
      {/* <h1 className="text-2xl font-bold text-blue-700">Portals </h1> */}

      <div className="flex items-center gap-4">
        <label htmlFor="viewAs" className="text-gray-600 font-medium">
          View As:
        </label>
        <select
          id="viewAs"
          value={currentRole}
          onChange={(e) => handleViewAs(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="hospital">Hospital</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="lab">Lab Tech</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
      </div>
    </header>
  );
}
