import { useState, useEffect } from "react";

export default function EquipmentForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: "", sport: "", category: "", barcode: "", price: 0, status: "available", quantity: 1 });

  useEffect(() => {
    if (initial) setForm({
      name: initial.name || "",
      sport: initial.sport || "",
      category: initial.category || "",
      barcode: initial.barcode || "",
      price: initial.price || 0,
      status: initial.status || "available",
      quantity: initial.quantity || 1
    });
  }, [initial]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(form); }} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <input className="input" placeholder="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" placeholder="Sport (e.g., cricket)" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
      <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input className="input" placeholder="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
      <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
        <option value="maintenance">Maintenance</option>
      </select>
      <input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
      <button type="submit">Save</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}


