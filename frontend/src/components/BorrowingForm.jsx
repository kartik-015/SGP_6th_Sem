import { useState } from "react";

export default function BorrowingForm({ onSubmit, equipmentId, maxCount = 1 }) {
  const [durationHours, setDurationHours] = useState(1);
  const [count, setCount] = useState(1);

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (count<=0 || durationHours<=0) return; onSubmit?.({ equipmentId, durationHours, count }); }} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap:'wrap' }}>
      <input className="input" type="number" min={1} placeholder="Duration (hours)" value={durationHours} onChange={(e) => setDurationHours(Math.max(1, Number(e.target.value)))} />
      <input className="input" type="number" min={1} max={maxCount || 1} placeholder="Count" value={count} onChange={(e)=> setCount(Math.max(1, Math.min(maxCount || 1, Number(e.target.value))))} />
      <div className="row" style={{ gap:6 }}>
        <button className="btn" type="submit">Borrow</button>
        <button className="btn secondary" type="button" onClick={()=> { setDurationHours(1); setCount(1); }}>Cancel</button>
      </div>
    </form>
  );
}


