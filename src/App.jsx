import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ===== Public Pages =====
import Landing from "./pages/Landing";
import PatientAuth from "./pages/PatientAuth";
import DoctorAuth from "./pages/DoctorAuth";
import PharmacistAuth from "./pages/PharmacistAuth";
import LabAuth from "./pages/LabAuth";
import AdminAuth from "./pages/AdminAuth";
import HospitalAuth from "./pages/HospitalAuth";
import SetupAccount from "./pages/SetupAccount";

// ===== Dashboards =====
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorsDashboard";
import LabDashboard from "./pages/LabDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

// ===== Private Route =====
import PrivateRoute from "./components/PrivateRoute";

// ====== Auth Forms ======
import PatientAuthForm from "./pages/PatientAuth"; // <-- your fixed form

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Public Pages ===== */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<PatientAuth />} />
        <Route path="/patient-auth" element={<PatientAuthForm />} /> {/* ✅ Optional: direct access to the form */}
        <Route path="/doctor-auth" element={<DoctorAuth />} />
        <Route path="/pharmacist-auth" element={<PharmacistAuth />} />
        <Route path="/lab-auth" element={<LabAuth />} />
        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/hospital-auth" element={<HospitalAuth />} />
        <Route path="/setup-password/:token" element={<SetupAccount />} />


        {/* ===== Protected Dashboards ===== */}
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

        {/* ===== Catch-All ===== */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
