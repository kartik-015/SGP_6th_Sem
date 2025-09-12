// src/pages/auth/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear auth tokens / user info
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Optional: notify user
    toast.success("You have been logged out");

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return null; // nothing to render
};

export default Logout;
