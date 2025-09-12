import { useEffect, useState } from "react";
import { getEquipment } from "../../api/equipment.js";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import BorrowingForm from "../../components/BorrowingForm.jsx";
import { requestBorrow } from "../../api/borrow.js";

export default function EquipmentList() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");

  const load = async () => {
    const data = await getEquipment({ category: filter, allowedOnly: true });
    setItems(data?.items || []);
  };

  useEffect(() => { load(); }, [filter]);

  return (
    <div>
      <h2>Allowed Equipment</h2>
      <CategoryFilter value={filter} onChange={setFilter} />
      <ul>
        {items.map(i => (
          <li key={i._id || i.id}>{i.name} ({i.category}) - Available: {i.available}</li>
        ))}
      </ul>
      <h3>Request Borrow</h3>
      <BorrowingForm onSubmit={requestBorrow} />
    </div>
  );
}


