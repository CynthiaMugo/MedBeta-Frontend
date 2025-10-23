import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/doctor-auth" replace />;

  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
