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
    await createUser({ ...form, role: "user" });
    setForm({ name: "", email: "" });
    load();
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2 style={{ margin:0 }}>Manage Users</h2>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <form onSubmit={add} className="row" style={{ gap: 12, alignItems: "center", flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:8, flex:1, minWidth: 240 }}>
            <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <button className="btn" type="submit">Add Student</button>
        </form>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width:'40%' }}>Name</th>
                <th style={{ width:'40%' }}>Email</th>
                <th style={{ width:'20%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign:'center', color:'var(--muted)', padding: 24 }}>No users found</td></tr>
              )}
              {users.map(u => (
                <tr key={u._id || u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button className="btn danger" onClick={() => deleteUser(u._id).then(load)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


