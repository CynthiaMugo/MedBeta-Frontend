import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import PatientAuth from "./pages/PatientAuth";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorAuth from "./pages/DoctorAuth";
import DoctorDashboard from "./pages/DoctorsDashboard";

// Components
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<PatientAuth />} />
        <Route path="/doctor-auth" element={<DoctorAuth />} />

        {/* Patient Dashboard (Protected) */}
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        {/* Doctor Dashboard (Protected) */}
        <Route
          path="/doctors-dashboard"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
