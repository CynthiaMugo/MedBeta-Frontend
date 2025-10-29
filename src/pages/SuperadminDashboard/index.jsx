// src/pages/SuperadminDashboard/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../../components/superadmin/DashboardLayout";
import HospitalsTab from "./HospitalsTab";
import InvitesTab from "./InvitesTab";
import UsersTab from "./UsersTab";
import OverviewTab from "./OverviewTab";
import LogsTab from "./LogsTab";

export default function SuperadminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="overview" />} />
        <Route path="overview" element={<OverviewTab />} />
        <Route path="hospitals" element={<HospitalsTab />} />
        <Route path="invites" element={<InvitesTab />} />
        <Route path="users" element={<UsersTab />} />
        <Route path="logs" element={<LogsTab />} />
      </Routes>
    </DashboardLayout>
  );
}
