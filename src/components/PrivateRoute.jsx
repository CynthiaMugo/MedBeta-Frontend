// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user found
  if (!user) {
    const authPages = {
      patient: "/auth",
      doctor: "/doctor-auth",
      pharmacist: "/pharmacist-auth",
      lab: "/lab-auth",
      admin: "/admin-auth",
      hospital: "/hospital-auth",
    };
    return <Navigate to={authPages[role] || "/auth"} replace />;
  }

  // If user role doesn't match the required role
  if (user.role !== role) {
    console.warn("User role mismatch:", user.role, "!==", role);
    return <Navigate to="/" replace />;
  }

  // If user is not verified (optional)
  if (user.isVerified === false) {
    return <Navigate to={`/${role}-auth`} replace />;
  }

  // Otherwise, access granted
  return children;
}
