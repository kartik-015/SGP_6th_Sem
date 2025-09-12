import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Logout from "../pages/auth/Logout.jsx";
import Navbar from "../components/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/student/Dashboard.jsx";
import EquipmentList from "../pages/student/EquipmentList.jsx";
import MyBorrowings from "../pages/student/MyBorrowings.jsx";

export default function StudentLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route index element={<StudentDashboard />} />
          <Route path="equipment" element={<EquipmentList />} />
          <Route path="borrowings" element={<MyBorrowings />} />
        </Routes>
      </main>
    </div>
  );
}