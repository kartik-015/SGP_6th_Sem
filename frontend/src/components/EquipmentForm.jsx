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

  const isEditing = Boolean(initial && (initial._id || initial.id));

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(String(text || "")); } catch {}
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(form); }}
      style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(180px, 1fr))", gap: 10, alignItems: "start", width: "100%" }}
    >
      {isEditing && (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:12, color:'var(--muted)' }}>Database ID</label>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <input
              className="input"
              value={initial._id || initial.id}
              readOnly
              style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
            />
            <button type="button" className="btn secondary" onClick={() => copy(initial._id || initial.id)}>Copy</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, color:'var(--muted)' }}>Item Name</label>
        <input className="input" placeholder="e.g., Football" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>

      <div style={{ display: 'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, color:'var(--muted)' }}>Sport</label>
        <input className="input" placeholder="e.g., Cricket" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
      </div>

      <div style={{ display: 'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, color:'var(--muted)' }}>Category</label>
        <input className="input" placeholder="e.g., Ball, Kit, Net" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, color:'var(--muted)' }}>Unique ID (for Scan Borrow)</label>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <input
            className="input"
            placeholder={isEditing ? "Unique equipment barcode" : "Auto-generated on save"}
            value={form.barcode || ''}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            readOnly={!isEditing}
            style={{ fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
            title={isEditing ? "This is the unique ID students will enter on Scan Borrow" : "Leave blank to auto-generate"}
          />
          <button
            type="button"
            className="btn secondary"
            onClick={() => copy(form.barcode)}
            disabled={!form.barcode}
            title="Copy unique ID"
          >Copy</button>
        </div>
        <small style={{ color:'var(--muted)' }}>
          {isEditing ? "Use/copy this ID in the Scan Borrow page." : "Leave empty to auto-generate a unique ID when saving."}
        </small>
      </div>

      <div style={{ display: 'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, color:'var(--muted)' }}>Price</label>
        <input className="input" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      </div>

      <div style={{ display: 'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, color:'var(--muted)' }}>Status</label>
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, color:'var(--muted)' }}>Quantity</label>
        <input className="input" type="number" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
      </div>

      <div style={{ gridColumn: '1 / -1', display:'flex', gap:8, flexWrap:'wrap' }}>
        <button className="btn" type="submit">Save</button>
        {onCancel && <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}


