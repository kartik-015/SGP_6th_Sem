import { useEffect, useState } from "react";
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from "../../api/equipment.js";
import { API } from "../../api/client.js";
import EquipmentTable from "../../components/EquipmentTable.jsx";
import EquipmentForm from "../../components/EquipmentForm.jsx";
import CategoryFilter from "../../components/CategoryFilter.jsx";

export default function ManageEquipment() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const data = await getEquipment({ category: filter });
    setItems(data?.items || []);
  };

  useEffect(() => { load(); }, [filter]);

  const handleSave = async (form) => {
    if (editing) await updateEquipment(editing._id, form); else await createEquipment(form);
    setEditing(null);
    load();
  };

  return (
    <div>
      <h2>Manage Equipment</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <CategoryFilter value={filter} onChange={setFilter} />
        <EquipmentForm initial={editing} onSubmit={handleSave} onCancel={() => setEditing(null)} />
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h3>Import from Excel</h3>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const file = e.target.elements.file.files[0];
          if (!file) return;
          const fd = new FormData();
          fd.append('file', file);
          await API.post('/equipment/import', fd);
          e.target.reset();
          load();
        }}>
          <input type="file" name="file" accept=".xlsx,.xls" />
          <button className="btn" type="submit" style={{ marginLeft: 8 }}>Upload</button>
        </form>
      </div>
      <EquipmentTable items={items} onEdit={setEditing} onDelete={(item) => deleteEquipment(item._id).then(load)} />
    </div>
  );
}


