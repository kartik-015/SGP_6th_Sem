import { useEffect, useMemo, useState } from "react";
import ScannerInput from "../../components/ScannerInput.jsx";
import { getUserByBarcode, createUser } from "../../api/users.js";
import { requestBorrow } from "../../api/borrow.js";
import { getByBarcode as getEquipmentByBarcode, getEquipment } from "../../api/equipment.js";
import { toast } from "react-toastify";

export default function ScanBorrow() {
  const [student, setStudent] = useState(null);
  const [equipmentId, setEquipmentId] = useState("");
  const [category, setCategory] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [durationHours, setDurationHours] = useState(1);
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [item, setItem] = useState(null);

  const onScan = async (barcode) => {
    try{
      const data = await getUserByBarcode(barcode);
      const u = data?.data?.user || data?.user || null;
  setStudent(u);
  setStudentName(u?.name || "");
  setStudentIdInput(u?.studentId || barcode || "");
      toast.success('Student found');
    }catch(err){
      // Auto-create user if not found
      const id = barcode;
      const email = `${id}@charusat.edu.in`;
      const created = await createUser({ name: id, email, role:'user', studentId: id, password: id });
      const u = created?.user || created?.data?.user || null;
      if (u){
  setStudent(u);
  setStudentName(u.name);
  setStudentIdInput(u.studentId);
        toast.success('Student created');
      } else {
        toast.error('Failed to create student');
      }
    }
  };

  const assignItem = async () => {
    if (!student || !equipmentId) {
      toast.error('Please scan student ID and enter equipment unique ID');
      return;
    }
    try {
      // Create pending request
      const created = await requestBorrow({ 
        studentId: student._id, 
        barcode: equipmentId, // use unique ID (barcode)
        durationHours, 
        verifiedName: student.name 
      });
      const borrowId = created?.borrow?._id || created?._id;
      // Approve immediately so it shows as Active in admin and student lists
      if (borrowId) {
        const { approveBorrow } = await import("../../api/borrow.js");
        await approveBorrow(borrowId);
      }
      toast.success('Item assigned successfully (approved)');
      setMessage('Item assigned');
      // Reset form
      setStudent(null);
      setStudentName("");
      setStudentIdInput("");
  setEquipmentId("");
      setItem(null);
    } catch (error) {
      toast.error('Failed to assign item');
      console.error('Assign error:', error);
    }
  };


  // Load equipment list for dropdown when category changes
  useEffect(() => {
    (async () => {
      const data = await getEquipment(category ? { category } : {});
      const list = data?.items || data?.data?.items || [];
      setEquipments(list);
    })();
  }, [category]);

  const equipmentOptions = useMemo(() => equipments.map(e => ({
    value: e.barcode || e._id,
    label: `${e.name} — ${e.category}${e.sport ? ' / ' + e.sport : ''} (Avail: ${e.available})`,
    item: e,
  })), [equipments]);

  return (
    <div className="container">
      <div className="topbar"><h2 style={{ margin:0 }}>Scan Borrow</h2></div>

      <div className="card" style={{ marginBottom:12 }}>
        <div className="scanner-box" style={{ padding:8 }}>
          <div style={{ marginTop:8 }}>
            <ScannerInput onScan={onScan} />
          </div>
        </div>
      </div>

      {(studentIdInput || student) && (
        <div className="card">
          {!student && (
            <div className="row" style={{ gap:8, marginBottom:8, alignItems:'center', flexWrap:'wrap' }}>
              <input className="input" placeholder="Enter/Scan Student ID" value={studentIdInput} onChange={(e)=> setStudentIdInput(e.target.value)} />
              <button className="btn" onClick={async()=>{
                if (!studentIdInput) { toast.error('Enter Student ID'); return; }
                try { await onScan(studentIdInput); } catch { toast.error('Student not found'); }
              }} type="button">Find student</button>
            </div>
          )}
          {student && (
            <div className="card" style={{ marginBottom: 8, padding: 12, background:'var(--bg-elevated)' }}>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontWeight:600 }}>{student.name}</div>
                  <div style={{ color:'var(--muted)', fontSize:13 }}>{student.email}</div>
                </div>
                <div style={{ color:'var(--muted)', fontSize:13 }}>Student ID: <strong style={{ color:'var(--text)' }}>{student.studentId}</strong></div>
                <div style={{ color:'var(--muted)', fontSize:13 }}>Role: <strong style={{ color:'var(--text)' }}>{student.role}</strong></div>
              </div>
            </div>
          )}
          <div className="row" style={{ gap: 8, alignItems: "center", flexWrap:'wrap' }}>
            <select className="input" value={category} onChange={(e)=>{ setCategory(e.target.value); setItem(null); }} style={{ width:'auto' }}>
              <option value="">All categories</option>
              <option value="Ball">Ball</option>
              <option value="Racket">Racket</option>
              <option value="Fitness">Fitness</option>
              <option value="Protective Gear">Protective Gear</option>
            </select>
            <select className="input" value={equipmentId} onChange={(e)=>{
              const val = e.target.value;
              setEquipmentId(val);
              const opt = equipmentOptions.find(o => o.value === val);
              setItem(opt?.item || null);
            }} style={{ minWidth: 340, flex:'1 1 360px' }}>
              <option value="">Select equipment…</option>
              {equipmentOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <input className="input" type="number" min={1} placeholder="Duration (hours)" value={durationHours} onChange={(e) => setDurationHours(Math.max(1, Number(e.target.value)))} />
            <button className="btn" disabled={!item} onClick={assignItem}>Assign Item</button>
          </div>
      {item && (
            <div style={{ marginTop:6, color:'var(--muted)' }}>
        Matched: <strong>{item.name}</strong> — {item.category} ({item.sport}) · Qty: {item.quantity} · Available: {item.available}
        {Number(item.available) <= 0 && (
          <span className="badge danger" style={{ marginLeft:8 }}>Out of stock</span>
        )}
        {Number(item.available) > 0 && (
          <span className="badge success" style={{ marginLeft:8 }}>In stock</span>
        )}
            </div>
          )}
        </div>
      )}
      {message && <p style={{ color:'var(--muted)' }}>{message}</p>}
    </div>
  );
}


