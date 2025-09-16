import { useEffect, useState } from "react";
import { listRequests, approveBorrow, denyBorrow, returnItem } from "../../api/borrow.js";
import { toast } from "react-toastify";

export default function BorrowRequests() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('active');

  const load = async () => {
    const params = filter !== 'all' ? { status: filter } : {};
    const data = await listRequests(params);
    setRows(data?.items || []);
  };

  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (id) => {
    await approveBorrow(id);
    toast.success('Request approved');
    load();
  };

  const handleDeny = async (id) => {
    await denyBorrow(id);
    toast.success('Request denied');
    load();
  };

  const handleReturn = async (id) => {
    await returnItem(id);
    toast.success('Item returned');
    load();
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

  return (
    <div className="container">
      <div className="topbar">
        <h2 style={{ margin: 0 }}>Borrowed Items</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label>Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input"
            style={{ width: 'auto', margin: 0 }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Equipment</th>
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
                <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--muted)', padding: 24 }}>
                  No items found for this filter. Try switching to "Pending" to see new requests.
                </td></tr>
              )}
              {rows.map(row => (
                <tr key={row._id}>
                  <td>
                    <div>
                      <strong>{row.studentId?.name || 'Unknown'}</strong>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{row.studentId?.email}</div>
                    </div>
                  </td>
                  <td>{row.studentId?.studentId || 'N/A'}</td>
                  <td>
                    <div>
                      <strong>{row.equipmentId?.name || 'Unknown'}</strong>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{row.equipmentId?.category}</div>
                    </div>
                  </td>
                  <td>{row.count || 1}</td>
                  <td>{new Date(row.borrowedAt).toLocaleDateString()}</td>
                  <td>
                    <div>
                      {new Date(row.returnBy).toLocaleDateString()}
                      {row.isOverdue && <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 'bold' }}>OVERDUE</div>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(row.status, row.isOverdue)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.penaltyAmount > 0 && (
                      <div>
                        <strong style={{ color: 'var(--danger)' }}>${row.penaltyAmount}</strong>
                        {row.penaltyPaid && <div style={{ fontSize: 12, color: 'var(--success)' }}>Paid</div>}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {row.status === 'pending' && (
                        <>
                          <button className="btn success" onClick={() => handleApprove(row._id)}>
                            Approve
                          </button>
                          <button className="btn danger" onClick={() => handleDeny(row._id)}>
                            Deny
                          </button>
                        </>
                      )}
                      {row.status === 'active' && (
                        <button className="btn" onClick={() => handleReturn(row._id)}>
                          Return
                        </button>
                      )}
                      {row.status === 'overdue' && !row.penaltyPaid && (
                        <button className="btn warning" onClick={() => {/* TODO: Implement penalty payment */}}>
                          Pay Penalty
                        </button>
                      )}
                    </div>
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


