import { useState } from "react";
import { login as loginApi } from "../../api/auth.js";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state on new submission
    try {
      const data = await loginApi({ email, password });
      // backend wraps in apiResponse: { statusCode, data: { user, accessToken } }
      const user = data?.user;
      const token = data?.accessToken;
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }

      // Redirect by role
      if (user?.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      // Provide more specific feedback to the user
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="title">Welcome back</h2>
        <div className="panel">
          <form onSubmit={handleLogin} className="space-y">
            {error && <div className="error">{error}</div>}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>
            <div className="actions">
              <button className="btn" type="submit">Login</button>
              <span style={{ marginLeft: 12 }}>
                No account? <Link to="/register">Create one</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
