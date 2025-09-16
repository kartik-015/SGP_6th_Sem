export default function EquipmentTable({ items = [], onEdit, onDelete }) {
  const hasItems = items && items.length > 0;
  const copy = async (text) => { try { await navigator.clipboard.writeText(String(text||'')); } catch {} };
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sport</th>
            <th>Category</th>
            <th>ID</th>
            <th>Barcode</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!hasItems && (
            <tr>
              <td colSpan={8} style={{ textAlign:'center', color:'var(--muted)' }}>No equipment found</td>
            </tr>
          )}
          {hasItems && items.map(item => (
            <tr key={item._id || item.id}>
              <td>{item.name}</td>
              <td>{item.sport}</td>
              <td>{item.category}</td>
              <td>
                <span style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{item._id || item.id}</span>
                <button
                  className="btn tiny secondary"
                  style={{ marginLeft:6 }}
                  onClick={() => copy(item._id || item.id)}
                  title="Copy database ID"
                >Copy</button>
              </td>
              <td>
                <span style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{item.barcode}</span>
                <button
                  className="btn tiny secondary"
                  style={{ marginLeft:6 }}
                  onClick={() => copy(item.barcode)}
                  title="Copy unique ID"
                >Copy</button>
              </td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td><span className={`badge ${item.available ? 'success' : 'danger'}`}>{String(item.available)}</span></td>
              <td className="actions">
                <button className="btn secondary" onClick={() => onEdit?.(item)}>Edit</button>
                <button className="btn danger" onClick={() => onDelete?.(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


