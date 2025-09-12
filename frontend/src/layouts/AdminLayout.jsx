import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
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
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 16 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Admin Panel</h1>
          <button onClick={handleLogout}>Logout</button>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="equipment" element={<ManageEquipment />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="borrowings" element={<BorrowRequests />} />
            <Route path="scan" element={<ScanBorrow />} />
            <Route path="penalties" element={<PenaltyManagement />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}