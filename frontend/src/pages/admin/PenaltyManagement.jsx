import { useEffect, useState } from "react";
import { listPenalties, settleStudentPenalties } from "../../api/penalty.js";

export default function PenaltyManagement() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ studentsDue: 0, totalDue: 0 });

  const load = async () => {
    const data = await listPenalties();
    setRows(data?.items || []);
    setSummary(data?.summary || { studentsDue: 0, totalDue: 0 });
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <div className="topbar" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <h2 style={{ margin:0 }}>Penalty Management</h2>
        <div style={{ display:'flex', gap:12, color:'var(--muted)', fontWeight:600 }}>
          <span>Students Due: <span style={{ color:'var(--fg)' }}>{summary.studentsDue}</span></span>
          <span>Total Due: <span style={{ color:'var(--danger)', fontWeight:700 }}>₹{summary.totalDue}</span></span>
        </div>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Items</th>
              <th>Net Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--muted)' }}>No penalties</td></tr>
            )}
            {rows.map(r => (
              <tr key={r.studentId}>
                <td>
                  <div style={{ display:'flex', flexDirection:'column' }}>
                    <strong>{r.studentName}</strong>
                    <span style={{ color:'var(--muted)', fontSize:12 }}>{r.studentEmail || r.studentCode}</span>
                  </div>
                </td>
                <td>
                  <span className="badge" title={r.items.map(i => `${i.itemName} (₹${i.amount})`).join(', ')}>
                    {r.count} item{r.count !== 1 ? 's' : ''}
                  </span>
                </td>
                <td><strong>₹{r.totalAmount}</strong></td>
                <td>
                  <button className="btn danger" onClick={() => settleStudentPenalties(r.studentId).then(load)}>Settle All</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


