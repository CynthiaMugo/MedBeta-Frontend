// src/components/PortalSelect.jsx
import React from "react";
import { Link } from "react-router-dom";

function PortalSelect() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Select Your Portal</h1>
      <div className="flex gap-6">
        <Link to="/auth?role=doctor" className="px-6 py-3 bg-blue-500 text-white rounded-lg">
          Doctor
        </Link>
        <Link to="/auth?role=patient" className="px-6 py-3 bg-green-500 text-white rounded-lg">
          Patient
        </Link>
        <Link to="/auth?role=lab" className="px-6 py-3 bg-yellow-500 text-white rounded-lg">
          Lab Tech
        </Link>
        <Link to="/auth?role=pharmacist" className="px-6 py-3 bg-purple-500 text-white rounded-lg">
          Pharmacist
        </Link>
        <Link to="/auth?role=admin" className="px-6 py-3 bg-gray-700 text-white rounded-lg">
          Administration
        </Link>
      </div>
    </div>
  );
}

export default PortalSelect;
