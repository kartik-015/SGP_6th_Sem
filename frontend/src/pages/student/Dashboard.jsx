import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="container">
      <div className="topbar"><h2>Student Dashboard</h2></div>
      <div className="categories">
        <Link to="/student/equipment" className="category-card">Browse Equipment</Link>
        <Link to="/student/borrowings" className="category-card">My Borrowings</Link>
      </div>
      <div style={{ marginTop: 16 }} className="card">
        <h3>Quick links</h3>
        <ul>
          <li><Link to="/student">Home</Link></li>
          <li><Link to="/student/equipment">Allowed Equipment</Link></li>
          <li><Link to="/student/borrowings">Borrowing History</Link></li>
        </ul>
      </div>
    </div>
  );
}