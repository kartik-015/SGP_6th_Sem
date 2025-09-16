
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
