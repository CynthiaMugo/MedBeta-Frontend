// routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ role, children }) {
  // Get role from localStorage (set after login)
  const userRole = localStorage.getItem("userRole"); // e.g., "doctor", "lab", "pharmacist", "patient", "admin"

  // If user is not logged in or role does not match
  if (!userRole) {
    return <Navigate to="/auth" replace />; // send to login page
  }

  if (userRole !== role) {
    return <Navigate to="/" replace />; // redirect to landing page if wrong role
  }

  // Role matches — allow access
  return children;
}
