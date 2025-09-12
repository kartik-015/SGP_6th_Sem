export default function EquipmentTable({ items = [], onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Sport</th>
          <th>Category</th>
          <th>Barcode</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Available</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item._id || item.id}>
            <td>{item.name}</td>
            <td>{item.sport}</td>
            <td>{item.category}</td>
            <td>{item.barcode}</td>
            <td>{item.price}</td>
            <td>{item.quantity}</td>
            <td>{item.available}</td>
            <td>
              <button onClick={() => onEdit?.(item)}>Edit</button>
              <button onClick={() => onDelete?.(item)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


