// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ role, children }) {
  const location = useLocation();

  // Try to load the user safely from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  // No user? Redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role mismatch → redirect to correct dashboard
  if (user.role !== role) {
    console.warn(`Access denied. User role: ${user.role}, expected: ${role}`);

    const roleRedirects = {
      patient: "/patient-dashboard",
      doctor: "/doctor-dashboard",
      lab: "/lab-dashboard",
      pharmacist: "/pharmacist-dashboard",
      admin: "/admin-dashboard",
      hospital: "/hospital-dashboard",
    };

    return <Navigate to={roleRedirects[user.role] || "/login"} replace />;
  }

  // Optional: Check if verified
  if (user.isVerified === false) {
    alert("Your account is not verified yet.");
    return <Navigate to="/login" replace />;
  }

  // ✅ All good — allow access
  return children;
}
