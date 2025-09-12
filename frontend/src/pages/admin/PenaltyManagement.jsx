import { useEffect, useState } from "react";
import { listPenalties, settlePenalty } from "../../api/penalty.js";

export default function PenaltyManagement() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const data = await listPenalties();
    setRows(data?.items || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Penalty Management</h2>
      <table border="1" cellPadding="6" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Student</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r._id || r.id}>
              <td>{r.studentName}</td>
              <td>{r.itemName}</td>
              <td>{r.amount}</td>
              <td>{r.status}</td>
              <td>
                {r.status !== "settled" && (
                  <button onClick={() => settlePenalty(r._id).then(load)}>Settle</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


