import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside style={{ width: 220, borderRight: "1px solid #eee", padding: 12 }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/equipment">Manage Equipment</Link>
        <Link to="/admin/users">Manage Users</Link>
        <Link to="/admin/borrowings">Borrow Requests</Link>
        <Link to="/admin/scan">Scan Borrow</Link>
        <Link to="/admin/penalties">Penalty Management</Link>
      </nav>
    </aside>
  );
}


