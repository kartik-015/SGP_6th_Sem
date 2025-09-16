import { useState } from "react";
import { register as registerApi } from "../../api/auth.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("user"); // user | admin
  const [adminCode, setAdminCode] = useState("");
  const [formError, setFormError] = useState("");
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setFormError("");
      let role = accountType;
      if (accountType === "admin") {
        const expected = import.meta.env.VITE_ADMIN_CODE || "SPORTSADMIN";
        if (adminCode.trim() !== expected) {
          const msg = "Invalid admin code. Register as Student or provide the correct code.";
          setFormError(msg);
          toast.error(msg);
          return;
        }
      }

      await registerApi({
        name,
        email,
        password,
        role,
        studentId: accountType === 'user' ? studentId : undefined
      });

      toast.success("Registration successful. Please login.");
      // On success, route to login instead of auto-login
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="title">Create your account</h2>
        <div className="panel">
          <form onSubmit={handleRegister} className="space-y">
            {formError && <div className="error">{formError}</div>}
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
            </div>
            {accountType === 'user' && (
              <div className="field">
                <label htmlFor="studentId">Student ID</label>
                <input id="studentId" className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Enter your student ID" required />
              </div>
            )}
            <div className="field">
              <label htmlFor="role">Account Type</label>
              <select id="role" className="input" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="user">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {accountType === "admin" && (
              <div className="field">
                <label htmlFor="adminCode">Admin Code</label>
                <input id="adminCode" className="input" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Enter admin code" />
              </div>
            )}
            <div className="actions">
              <button className="btn" type="submit">Sign Up</button>
              <span style={{ marginLeft: 12 }}>
                Already have an account? <Link to="/login">Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
