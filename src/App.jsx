import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

// Import dashboards
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorsDashboard";
import LabDashboard from "./pages/LabDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/lab-dashboard"
          element={
            <PrivateRoute role="lab">
              <LabDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pharmacist-dashboard"
          element={
            <PrivateRoute role="pharmacist">
              <PharmacistDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/hospital-dashboard"
          element={
            <PrivateRoute role="hospital">
              <HospitalDashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
