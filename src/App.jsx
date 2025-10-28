import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from "./pages/ResetPassword";
import SetupPasswordPage from './pages/SetupAccount';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/setup-password/:token" element={<SetupPasswordPage />} />
        {/* Dashboards */}
        <Route path="/superadmin/dashboard" element={<div>Superadmin Dashboard</div>} />
        <Route path="/doctor/dashboard" element={<div>Doctor Dashboard</div>} />
        <Route path="/technician/dashboard" element={<div>Technician Dashboard</div>} />
        <Route path="/patient/dashboard" element={<div>Patient Dashboard</div>} />
        <Route path="/hospital/dashboard" element={<div>Hospital Dashboard</div>} />
      </Routes>
    </Router>
  );
}
