import { useEffect, useState } from "react";
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from "../../api/equipment.js";
import { API } from "../../api/client.js";
import EquipmentTable from "../../components/EquipmentTable.jsx";
import EquipmentForm from "../../components/EquipmentForm.jsx";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import { toast } from "react-toastify";

export default function ManageEquipment() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const data = await getEquipment({ category: filter });
    setItems(data?.items || []);
  };

  useEffect(() => { load(); }, [filter]);

  const handleSave = async (form) => {
    if (editing) await updateEquipment(editing._id, form); else await createEquipment(form);
    setEditing(null);
    setShowForm(false);
    toast.success("Equipment saved");
    load();
  };

  return (
    <div className="container fluid">
      <div className="topbar">
        <h2 style={{ margin:0 }}>Manage Equipment</h2>
      </div>

      {/* Compact toolbar: small filter, add button */}
      <div className="card" style={{ marginBottom: 12, padding: 10, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontWeight:500, fontSize:13, color:'var(--muted)' }}>Filter</span>
          <div style={{ width: 200 }}>
            <CategoryFilter value={filter} onChange={setFilter} />
          </div>
        </div>
        <div style={{ flex:1 }} />
        <button
          className="btn"
          onClick={() => { setEditing(null); setShowForm((v) => !v); }}
          title={showForm ? "Hide form" : "Add new equipment"}
        >
          {showForm ? 'Close Form' : 'Add Equipment'}
        </button>
      </div>

      {/* Full-width table comes first for maximum space */}
      <div className="full-bleed" style={{ width:'100%', marginBottom: 16 }}>
        <EquipmentTable
          items={items}
          onEdit={(item) => { setEditing(item); setShowForm(true); }}
          onDelete={(item) => deleteEquipment(item._id).then(()=>{ toast.success('Deleted'); load(); })}
        />
      </div>

      {/* Import below the table */}
      <div className="card" style={{ marginBottom: 12, padding: 16 }}>
        <h3 style={{ marginTop:0, marginBottom: 12 }}>Import from Excel</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const file = e.target.elements.file.files[0];
          if (!file) return toast.info("Choose a file first");
          const fd = new FormData();
          fd.append('file', file);
          await API.post('/equipment/import', fd);
          e.target.reset();
          toast.success("File imported");
          load();
        }} className="row" style={{ gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <input className="input" type="file" name="file" accept=".xlsx,.xls" />
          <button className="btn" type="submit">Upload</button>
        </form>
      </div>

      {/* Collapsible add/edit form below, out of the way */}
      {showForm && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <h3 style={{ margin:0 }}>{editing ? 'Edit Equipment' : 'Add Equipment'}</h3>
            <button className="btn" onClick={() => { setEditing(null); setShowForm(false); }}>Close</button>
          </div>
          <div style={{ maxWidth: 560 }}>
            <EquipmentForm
              initial={editing}
              onSubmit={handleSave}
              onCancel={() => { setEditing(null); setShowForm(false); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}


