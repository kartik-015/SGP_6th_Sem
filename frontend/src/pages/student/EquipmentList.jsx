import { useEffect, useState } from "react";
import { getEquipment } from "../../api/equipment.js";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import BorrowingForm from "../../components/BorrowingForm.jsx";
import { requestBorrow } from "../../api/borrow.js";
import { toast } from "react-toastify";

export default function EquipmentList() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");

  const load = async () => {
    try {
      const data = await getEquipment({ category: filter, allowedOnly: true });
      setItems(data?.items || []);
    } catch (error) {
      toast.error('Failed to load equipment');
      console.error('Load error:', error);
    }
  };

  const handleBorrow = async (payload) => {
    try {
      // payload includes { equipmentId, durationHours, count }
      const res = await requestBorrow(payload);
      if (res?.approvalRequired) {
        toast.info('Request created — approval required (counsellor will be notified)');
      } else {
        toast.success('Borrowing request submitted successfully');
      }
      load(); // Refresh the list to update availability
    } catch (error) {
      // Error is already handled by the API interceptor
      console.error('Borrow error:', error);
    }
  };

  useEffect(() => { load(); }, [filter]);

  return (
    <div className="container">
      <div className="topbar"><h2 style={{ margin:0 }}>Equipment</h2></div>
      <div className="row" style={{ gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:12 }}>
        <CategoryFilter value={filter} onChange={setFilter} />
        <input className="input" placeholder="Search by name/category" value={query} onChange={(e)=> setQuery(e.target.value)} />
      </div>
      <div className="grid cols-4" style={{ marginBottom:16 }}>
        {items.filter(i => i.name?.toLowerCase().includes(query.toLowerCase()) || i.category?.toLowerCase().includes(query.toLowerCase())).map(i => (
          <div key={i._id || i.id} className="card" style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {i.imageUrl && <img src={i.imageUrl} alt={i.name} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />}
            <div style={{ fontWeight:600 }}>{i.name}</div>
            <div style={{ color:'var(--muted)' }}>{i.category}</div>
            <div><span className={`badge ${i.available>0?'success':'danger'}`}>Available: {i.available}</span></div>
            <BorrowingForm equipmentId={i._id} maxCount={Number(i.available || i.quantity || 1)} onSubmit={(payload)=> handleBorrow({ ...payload, equipmentId: i._id })} />
          </div>
        ))}
      </div>
    </div>
  );
}


