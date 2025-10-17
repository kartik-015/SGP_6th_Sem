import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useCallback } from "react";
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
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = Number(localStorage.getItem('sidebarWidth'));
    return Number.isFinite(saved) && saved >= 200 && saved <= 500 ? saved : 260;
  });
  const [dragging, setDragging] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Apply CSS variable for sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', `${sidebarWidth}px`);
  }, [sidebarWidth]);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;
    const min = 200;
    const max = Math.max(300, window.innerWidth - 320);
    const next = Math.min(max, Math.max(min, e.clientX));
    setSidebarWidth(next);
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    localStorage.setItem('sidebarWidth', String(Math.round(sidebarWidth)));
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [dragging, onPointerMove, sidebarWidth]);

  const startDrag = useCallback((e) => {
    e.preventDefault();
    // capture pointer so we keep getting events even if pointer leaves the handle
    try { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    setDragging(true);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }, [onPointerMove, onPointerUp]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      {/* Resizer handle between sidebar and content */}
      <div
        className="sidebar-resizer"
        onPointerDown={startDrag}
        aria-label="Resize sidebar"
        role="separator"
        aria-orientation="vertical"
      />
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