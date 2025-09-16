import { useEffect, useState } from "react";
import { listRequests, returnItem } from "../../api/borrow.js";
import { toast } from "react-toastify";

export default function MyBorrowings() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all');
  const [summary, setSummary] = useState({ total:0, pending:0, active:0, overdue:0, returned:0 });

  const load = async () => {
    try {
      const params = { mine: true };
      if (filter !== 'all') params.status = filter;
      const data = await listRequests(params);
      const items = data?.items || [];
      setRows(items);
      const s = data?.summary || {
        total: items.length,
        pending: items.filter(i => i.status === 'pending').length,
        active: items.filter(i => i.status === 'active').length,
        overdue: items.filter(i => i.status === 'overdue' || i.isOverdue).length,
        returned: items.filter(i => i.status === 'returned').length,
      };
      setSummary(s);
    } catch (error) {
      toast.error('Failed to load borrowings');
      console.error('Load error:', error);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleReturn = async (id) => {
    try {
      await returnItem(id);
      toast.success('Item returned successfully');
      load();
    } catch (error) {
      toast.error('Failed to return item');
    }
  };

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

  const activeCount = summary.active;
  const overdueCount = summary.overdue;
  const totalPenalty = rows.reduce((sum, r) => sum + (r.penaltyAmount || 0), 0);

  return (
    <div className="container">
      <div className="topbar">
        <h2 style={{ margin: 0 }}>My Borrowings</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label>Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input"
            style={{ width: 'auto', margin: 0 }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="stats" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>📦</div>
          <div>
            <div className="stat-title">Active Items</div>
            <div className="stat-value">{activeCount}</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>⚠️</div>
          <div>
            <div className="stat-title">Overdue</div>
            <div className="stat-value">{overdueCount}</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>🕓</div>
          <div>
            <div className="stat-title">Pending</div>
            <div className="stat-value">{summary.pending}</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>✅</div>
          <div>
            <div className="stat-title">Returned</div>
            <div className="stat-value">{summary.returned}</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>💰</div>
          <div>
            <div className="stat-title">Total Penalty</div>
            <div className="stat-value">${totalPenalty}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Count</th>
                <th>Borrowed Date</th>
                <th>Return By</th>
                <th>Status</th>
                <th>Penalty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign:'center', color:'var(--muted)', padding: 24 }}>No borrowings found</td></tr>
              )}
              {rows.map(r => (
                <tr key={r._id}>
                  <td>
                    <div>
                      <strong>{r.equipmentId?.name || 'Unknown'}</strong>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.equipmentId?.sport}</div>
                    </div>
                  </td>
                  <td>{r.equipmentId?.category || 'N/A'}</td>
                  <td>{r.count || 1}</td>
                  <td>{new Date(r.borrowedAt).toLocaleDateString()}</td>
                  <td>
                    <div>
                      {new Date(r.returnBy).toLocaleDateString()}
                      {r.isOverdue && <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 'bold' }}>OVERDUE</div>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(r.status, r.isOverdue)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.penaltyAmount > 0 && (
                      <div>
                        <strong style={{ color: 'var(--danger)' }}>${r.penaltyAmount}</strong>
                        {r.penaltyPaid && <div style={{ fontSize: 12, color: 'var(--success)' }}>Paid</div>}
                      </div>
                    )}
                  </td>
                  <td>
                    {r.status === 'active' && (
                      <button className="btn" onClick={() => handleReturn(r._id)}>
                        Return Item
                      </button>
                    )}
                    {r.status === 'overdue' && !r.penaltyPaid && (
                      <button className="btn warning" onClick={() => {/* TODO: Implement penalty payment */}}>
                        Pay Penalty
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


