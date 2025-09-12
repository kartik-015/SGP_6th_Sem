import { useState } from "react";
import ScannerInput from "../../components/ScannerInput.jsx";
import { getUserByBarcode } from "../../api/users.js";
import { requestBorrow } from "../../api/borrow.js";

export default function ScanBorrow() {
  const [student, setStudent] = useState(null);
  const [equipmentId, setEquipmentId] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [message, setMessage] = useState("");

  const onScan = async (barcode) => {
    const data = await getUserByBarcode(barcode);
    setStudent(data?.data?.user || data?.user || null);
  };

  const assign = async (e) => {
    e.preventDefault();
    if (!student) return;
    const res = await requestBorrow({ studentId: student._id, equipmentId, durationDays });
    setMessage("Request submitted");
  };

  return (
    <div>
      <h2>Scan Borrow</h2>
      <div className="scanner-box">
        <ScannerInput onScan={onScan} />
      </div>
      {student && (
        <div style={{ marginTop: 12 }}>
          <div>Student: {student.name} ({student.email}) — ID: {student.studentId}</div>
          <form onSubmit={assign} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <input placeholder="Equipment ID" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} />
            <input type="number" placeholder="Duration (days)" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
            <button type="submit">Assign</button>
          </form>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}


