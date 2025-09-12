const SPORTS = ["Cricket", "Football", "Volleyball", "Tennis", "Chess", "Frisbee"];

export default function CategoryFilter({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange?.(e.target.value)}>
      <option value="">All Sports</option>
      {SPORTS.map(s => (
        <option key={s} value={s.toLowerCase()}>{s}</option>
      ))}
    </select>
  );
}


