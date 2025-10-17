import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StudentLayout from "./layouts/studentLayout.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useEffect, useState } from 'react';

function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }, [theme]);

    return (
    <BrowserRouter>
      <button
        aria-label="Toggle theme"
        className="btn"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1000 }}
      >
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student/*"
          element={
            <PrivateRoute allowedRoles={["user"]}>
              <StudentLayout />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
>>>>>>> main
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const StudentLogin = React.lazy(() => import('./pages/StudentLogin'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const StudentRegistration = React.lazy(() => import('./pages/StudentRegistration'));
const EquipmentCatalog = React.lazy(() => import('./pages/EquipmentCatalog'));
const EquipmentDetails = React.lazy(() => import('./pages/EquipmentDetails'));
const RequestForm = React.lazy(() => import('./pages/RequestForm'));
const RequestHistory = React.lazy(() => import('./pages/RequestHistory'));
const AdminRequests = React.lazy(() => import('./pages/AdminRequests'));
const AdminEquipment = React.lazy(() => import('./pages/AdminEquipment'));
const AdminStudents = React.lazy(() => import('./pages/AdminStudents'));
const AdminNotifications = React.lazy(() => import('./pages/AdminNotifications'));
const Profile = React.lazy(() => import('./pages/Profile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Components
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Sports Equipment Management System</title>
        <meta name="description" content="University sports equipment borrowing and management platform" />
      </Helmet>
      
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              <LandingPage />
            </Suspense>
          } />
          
          <Route path="/login/student" element={
            <Suspense fallback={<PageLoader />}>
              <StudentLogin />
            </Suspense>
          } />
          
          <Route path="/login/admin" element={
            <Suspense fallback={<PageLoader />}>
              <AdminLogin />
            </Suspense>
          } />
          
          <Route path="/register" element={
            <Suspense fallback={<PageLoader />}>
              <StudentRegistration />
            </Suspense>
          } />
          
          <Route path="/equipment" element={
            <Suspense fallback={<PageLoader />}>
              <EquipmentCatalog />
            </Suspense>
          } />
          
          <Route path="/equipment/:id" element={
            <Suspense fallback={<PageLoader />}>
              <EquipmentDetails />
            </Suspense>
          } />
          
          {/* Protected Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute userType="student">
              <Suspense fallback={<PageLoader />}>
                <StudentDashboard />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/student/request" element={
            <ProtectedRoute userType="student">
              <Suspense fallback={<PageLoader />}>
                <RequestForm />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/student/history" element={
            <ProtectedRoute userType="student">
              <Suspense fallback={<PageLoader />}>
                <RequestHistory />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/student/profile" element={
            <ProtectedRoute userType="student">
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          } />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute userType="admin">
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/requests" element={
            <ProtectedRoute userType="admin">
              <Suspense fallback={<PageLoader />}>
                <AdminRequests />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/equipment" element={
            <ProtectedRoute userType="admin">
              <Suspense fallback={<PageLoader />}>
                <AdminEquipment />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students" element={
            <ProtectedRoute userType="admin">
              <Suspense fallback={<PageLoader />}>
                <AdminStudents />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/notifications" element={
            <ProtectedRoute userType="admin">
              <Suspense fallback={<PageLoader />}>
                <AdminNotifications />
              </Suspense>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/profile" element={
            <ProtectedRoute userType="admin">
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App; 
>>>>>>> main
