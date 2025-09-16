import { NavLink } from "react-router-dom";

export default function Navbar({ onLogout }) {
  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      background: 'var(--card)', 
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow)'
    }}>
      <div className="container" style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
              Sports Equipment
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--muted)' }}>
              Student Portal
            </p>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/student" end>
              📊 Dashboard
            </NavLink>
            <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/student/equipment">
              🏓 Equipment
            </NavLink>
            <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/student/borrowings">
              📋 My Borrowings
            </NavLink>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Student Portal
          </span>
          <button className="btn secondary" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}


