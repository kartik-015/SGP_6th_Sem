import { useState } from "react";
import { login as loginApi } from "../../api/auth.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

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
        toast.success("Logged in successfully");
      }

      // Redirect by role
      if (user?.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>
              Welcome Back
            </h1>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '16px' }}>
              Sign in to your Sports Equipment account
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y" style={{ textAlign: 'left' }}>
            {error && (
              <div style={{ 
                background: 'rgba(239,68,68,0.1)', 
                color: 'var(--danger)', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}
            
            <div className="field" style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: 'var(--text)',
                fontSize: '14px'
              }}>
                Email Address
              </label>
              <input 
                id="email" 
                className="input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email"
                type="email"
                required
              />
            </div>
            
            <div className="field" style={{ marginBottom: '24px' }}>
              <label htmlFor="password" style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500', 
                color: 'var(--text)',
                fontSize: '14px'
              }}>
                Password
              </label>
              <input 
                id="password" 
                className="input" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button className="btn" type="submit" style={{ width: '100%', marginBottom: '20px' }}>
              🚀 Sign In
            </button>
            
            <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
