import { useState } from "react";

export default function BorrowingForm({ onSubmit }) {
  const [equipmentId, setEquipmentId] = useState("");
  const [durationDays, setDurationDays] = useState(7);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.({ equipmentId, durationDays }); }} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input placeholder="Equipment ID" value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} />
      <input type="number" placeholder="Duration (days)" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} />
      <button type="submit">Request</button>
    </form>
  );
}


