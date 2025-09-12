import { useEffect, useState } from "react";
import { listRequests, returnItem } from "../../api/borrow.js";

export default function MyBorrowings() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const data = await listRequests({ mine: true });
    setRows(data?.items || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>My Borrowings</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Due</th>
            <th>Status</th>
            <th>Penalty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r._id || r.id}>
              <td>{r.equipmentId?.name || r.itemName}</td>
              <td>{r.dueDate}</td>
              <td><span className={`badge ${r.status === 'active' ? 'success' : r.status === 'returned' ? 'muted' : 'danger'}`}>{r.status}</span></td>
              <td>{r.penalty || 0}</td>
              <td>
                {r.status === "approved" && <button onClick={() => returnItem(r._id).then(load)}>Return</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


