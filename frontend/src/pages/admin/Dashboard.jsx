import StatsCard from "../../components/StatsCard.jsx";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Equipment", value: 50 },
    { title: "Borrowed Items", value: 12 },
    { title: "Overdue", value: 3 },
    { title: "Penalties", value: "$120" },
  ];

  return (
    <div className="container">
      <div className="topbar"><h2>Admin Dashboard</h2></div>
      <div className="stats">
        {stats.map(s => (
          <div key={s.title} className="stat-card">
            <div className="stat-title">{s.title}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Item</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jane Doe</td>
              <td>Cricket Bat</td>
              <td>2025-09-20</td>
              <td><span className="badge success">Pending</span></td>
            </tr>
            <tr>
              <td>John Smith</td>
              <td>Football</td>
              <td>2025-09-18</td>
              <td><span className="badge danger">Overdue</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}