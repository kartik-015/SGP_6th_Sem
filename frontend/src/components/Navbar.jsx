import { Link } from "react-router-dom";

export default function Navbar({ onLogout }) {
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/student">Dashboard</Link>
      <Link to="/student/equipment">Equipment</Link>
      <Link to="/student/borrowings">My Borrowings</Link>
      <span style={{ marginLeft: "auto" }}>
        <button onClick={onLogout}>Logout</button>
      </span>
    </nav>
  );
}


