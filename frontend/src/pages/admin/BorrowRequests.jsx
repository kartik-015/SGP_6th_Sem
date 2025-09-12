import { useEffect, useState } from "react";
import { listRequests, approveBorrow, denyBorrow, returnItem } from "../../api/borrow.js";
import BorrowingTable from "../../components/BorrowingTable.jsx";

export default function BorrowRequests() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const data = await listRequests();
    setRows(data?.items || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Borrow Requests</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Equipment</th>
              <th>Category</th>
              <th>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row._id}>
                <td>{row.studentId?.name}</td>
                <td>{row.studentId?.studentId}</td>
                <td>{row.equipmentId?.name}</td>
                <td>{row.equipmentId?.category}</td>
                <td>{new Date(row.returnBy).toISOString().slice(0,10)}</td>
                <td><span className={`badge ${row.status === 'active' ? 'success' : row.status === 'returned' ? 'muted' : 'danger'}`}>{row.status}</span></td>
                <td>
                  {row.status === 'pending' && <button className="btn" onClick={() => approveBorrow(row._id).then(load)}>Approve</button>}
                  {row.status === 'pending' && <button className="btn danger" onClick={() => denyBorrow(row._id).then(load)} style={{ marginLeft: 6 }}>Deny</button>}
                  {row.status === 'active' && <button className="btn" onClick={() => returnItem(row._id).then(load)}>Return</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


