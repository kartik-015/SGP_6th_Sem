export default function StatsCard({ title, value }) {
  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
    </div>
  );
}


