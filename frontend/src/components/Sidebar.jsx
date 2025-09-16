import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
          Admin Menu
        </h3>
      </div>
      <nav style={{ padding: '12px 0' }}>
        <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/admin" end>
          📊 Dashboard
        </NavLink>
        <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/admin/equipment">
          🏓 Manage Equipment
        </NavLink>
        <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/admin/users">
          👥 Manage Users
        </NavLink>
        <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/admin/borrowings">
          📋 Borrow Requests
        </NavLink>
        <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/admin/scan">
          📱 Scan Borrow
        </NavLink>
        <NavLink className={({isActive})=>`nav-link${isActive?' active':''}`} to="/admin/penalties">
          💰 Penalty Management
        </NavLink>
      </nav>
    </aside>
  );
}


