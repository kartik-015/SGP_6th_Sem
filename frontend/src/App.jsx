
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StudentLayout from "./layouts/studentLayout.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
    return (
    <BrowserRouter>
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
