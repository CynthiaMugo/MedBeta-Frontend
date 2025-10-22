// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ===== Components =====
import Landing from "./pages/Landing";
import PortalSelect from "./pages/PortalSelect"; // 
import Auth from "./pages/PatientAuth";
import PatientDashboard from "./pages/PatientDashboard";

// ===== Pages / Dashboards =====
import DoctorDashboard from "./pages/DoctorsDashboard";
import LabDashboard from "./pages/LabDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OTPVerification from "./pages/OTPVerification";

// ===== Routes =====
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Public Pages ===== */}
        <Route path="/" element={<Landing />} />
        <Route path="/portal-select" element={<PortalSelect />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/otp" element={<OTPVerification />} />

        {/* ===== Dashboards (Private Routes) ===== */}
        <Route
          path="/doctor-dashboard"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <PrivateRoute role="patient">
              <PatientDashboard />
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
      </Routes>
    </Router>
  );
}

export default App;
