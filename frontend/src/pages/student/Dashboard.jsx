import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listRequests } from "../../api/borrow.js";

export default function StudentDashboard() {
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    loadBorrowings();
  }, []);

  const loadBorrowings = async () => {
    try {
      const data = await listRequests({ mine: true });
      setBorrowings(data?.items || []);
    } catch (error) {
      console.error('Failed to load borrowings:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'returned': return 'muted';
      case 'overdue': return 'danger';
      default: return 'muted';
    }
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2 style={{ margin: 0 }}>Student Dashboard</h2>
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>Manage your equipment borrowings</div>
      </div>

      <div className="stats" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>📦</div>
          <div>
            <div className="stat-title">Active Borrowings</div>
            <div className="stat-value">{borrowings.filter(b => b.status === 'active').length}</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>✅</div>
          <div>
            <div className="stat-title">Total Returns</div>
            <div className="stat-value">{borrowings.filter(b => b.status === 'returned').length}</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>⚠️</div>
          <div>
            <div className="stat-title">Overdue Items</div>
            <div className="stat-value">{borrowings.filter(b => b.status === 'overdue').length}</div>
          </div>
        </div>
      </div>

      <div className="categories" style={{ marginBottom: 24 }}>
        <Link to="/student/equipment" className="category-card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🏓</span>
          Browse Equipment
        </Link>
        <Link to="/student/borrowings" className="category-card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>📋</span>
          My Borrowings
        </Link>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Recent Borrowings</h3>
        {borrowings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--muted)' }}>
            No borrowings yet. Visit the Equipment page to borrow items.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Borrowed Date</th>
                  <th>Return By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.slice(0, 5).map(borrowing => (
                  <tr key={borrowing._id}>
                    <td>{borrowing.equipmentId?.name || 'Unknown'}</td>
                    <td>{new Date(borrowing.borrowedAt).toLocaleDateString()}</td>
                    <td>{new Date(borrowing.returnBy).toLocaleDateString()}</td>
                    <td><span className={`badge ${getStatusColor(borrowing.status)}`}>{borrowing.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}