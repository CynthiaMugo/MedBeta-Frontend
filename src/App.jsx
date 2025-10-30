import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing1";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SetupPasswordPage from "./pages/SetupAccount";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import DoctorDashboard from "./pages/DocDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/setup-password/:token" element={<SetupPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/superadmin/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperadminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/dashboard"
          element={
            <ProtectedRoute allowedRoles={["hospital_admin"]}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/dashboard"
          element={
            <ProtectedRoute allowedRoles={["technician"]}>
              <div>Technician Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacy/dashboard"
          element={
            <ProtectedRoute allowedRoles={["pharmacist"]}>
              <div>Pharmacist Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <div>Patient Dashboard</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
