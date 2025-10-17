import StatsCard from "../../components/StatsCard.jsx";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Equipment", value: 50, icon: "🏓" },
    { title: "Borrowed Items", value: 12, icon: "📦" },
    { title: "Overdue", value: 3, icon: "⚠️" },
    { title: "Penalties", value: "$120", icon: "💰" },
  ];

  return (
    <div className="container fluid">
      <div className="topbar">
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>Welcome back, Admin</div>
      </div>
      
      <div className="stats" style={{ marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.title} className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div>
              <div className="stat-title">{s.title}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card full-bleed" style={{ padding: 0 }}>
        <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
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
                <td><span className="badge success">Active</span></td>
              </tr>
              <tr>
                <td>John Smith</td>
                <td>Football</td>
                <td>2025-09-18</td>
                <td><span className="badge danger">Overdue</span></td>
              </tr>
              <tr>
                <td>Alice Johnson</td>
                <td>Tennis Racket</td>
                <td>2025-09-22</td>
                <td><span className="badge success">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}