import StatsCard from "../../components/StatsCard.jsx";
import { useEffect, useState } from "react";
import { getEquipment } from "../../api/equipment.js";
import { listRequests } from "../../api/borrow.js";
import { listPenalties } from "../../api/penalty.js";

export default function AdminDashboard() {
  const [totals, setTotals] = useState({ totalEquipment: 0, borrowed: 0, overdue: 0, penalties: 0 });

  async function loadStats() {
    try {
      const eq = await getEquipment({});
      const items = eq?.items || [];
      const totalEquipment = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);

      const borrowedRes = await listRequests({ status: 'active' });
      const borrowed = (borrowedRes?.items || []).length;

      const overdueRes = await listRequests({ status: 'overdue' });
      const overdue = (overdueRes?.items || []).length;

      // Penalties: use penalty API (aggregated by student)
      const pen = await listPenalties();
      const penaltyTotal = pen?.summary?.totalDue || 0;

      setTotals({ totalEquipment, borrowed, overdue, penalties: penaltyTotal });
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    }
  }

  useEffect(() => { loadStats(); }, []);

  const stats = [
    { title: "Total Equipment", value: totals.totalEquipment, icon: "🏓" },
    { title: "Borrowed Items", value: totals.borrowed, icon: "📦" },
    { title: "Overdue", value: totals.overdue, icon: "⚠️" },
    { title: "Penalties", value: `$${totals.penalties}`, icon: "💰" },
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
      
      <RecentActivity />
    </div>
  );
}

function RecentActivity(){
  const [rows, setRows] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try{
        // request all recent borrowings (server supports status=all)
        const data = await listRequests({ status: 'all' });
        const items = data?.items || [];
        // sort by createdAt desc and take top 6
        const recent = items.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0,6);
        setRows(recent);
      }catch(err){
        console.error('Failed to load recent activity', err);
      }
    })();
  },[]);

  const getStatusColor = (status, isOverdue) => {
    if (isOverdue) return 'danger';
    switch (status) {
      case 'active': return 'success';
      case 'returned': return 'muted';
      case 'overdue': return 'danger';
      case 'pending': return 'warning';
      default: return 'muted';
    }
  };

  return (
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
            {rows.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--muted)', padding: 24 }}>No recent activity</td></tr>
            )}
            {rows.map(row=> (
              <tr key={row._id}>
                <td>
                  <div>
                    <strong>{row.studentId?.name || 'Unknown'}</strong>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{row.studentId?.email}</div>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{row.equipmentId?.name || 'Unknown'}</strong>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{row.equipmentId?.category}</div>
                  </div>
                </td>
                <td>{row.returnBy ? new Date(row.returnBy).toLocaleDateString() : '—'}</td>
                <td><span className={`badge ${getStatusColor(row.status, row.isOverdue)}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}