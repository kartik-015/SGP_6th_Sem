import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../../api/users.js";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  const load = async () => {
    const data = await getUsers();
    setUsers(data?.users || []);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await createUser({ ...form, role: "student" });
    setForm({ name: "", email: "" });
    load();
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <form onSubmit={add} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit">Add Student</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u._id || u.id}>
            {u.name} - {u.email}
            <button onClick={() => deleteUser(u._id).then(load)} style={{ marginLeft: 8 }}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


