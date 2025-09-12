export default function BorrowingTable({ items = [], onApprove, onDeny, onReturn }) {
  return (
    <table border="1" cellPadding="6" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Student</th>
          <th>Item</th>
          <th>Due</th>
          <th>Status</th>
          <th>Penalty</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(row => (
          <tr key={row._id || row.id}>
            <td>{row.studentName}</td>
            <td>{row.itemName}</td>
            <td>{row.dueDate}</td>
            <td>{row.status}</td>
            <td>{row.penalty || 0}</td>
            <td>
              {onApprove && row.status === "pending" && <button onClick={() => onApprove(row)}>Approve</button>}
              {onDeny && row.status === "pending" && <button onClick={() => onDeny(row)}>Deny</button>}
              {onReturn && row.status === "approved" && <button onClick={() => onReturn(row)}>Return</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


