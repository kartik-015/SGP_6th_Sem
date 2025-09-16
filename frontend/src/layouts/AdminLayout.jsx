import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Sidebar from "../components/Sidebar.jsx";

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard.jsx"));
const ManageEquipment = lazy(() => import("../pages/admin/ManageEquipment.jsx"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers.jsx"));
const BorrowRequests = lazy(() => import("../pages/admin/BorrowRequests.jsx"));
const ScanBorrow = lazy(() => import("../pages/admin/ScanBorrow.jsx"));
const PenaltyManagement = lazy(() => import("../pages/admin/PenaltyManagement.jsx"));

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className="content">
        <header className="topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>Admin Panel</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--muted)' }}>
              Sports Equipment Management System
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
              Welcome, Admin
            </span>
            <button className="btn secondary" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </header>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="loading">
              <div>Loading...</div>
            </div>
          }>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="equipment" element={<ManageEquipment />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="borrowings" element={<BorrowRequests />} />
              <Route path="scan" element={<ScanBorrow />} />
              <Route path="penalties" element={<PenaltyManagement />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}