import { useEffect, useState } from "react";
import type { User } from "./types/user";
import * as api from "./api/userApi";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setUsers(await api.fetchUsers());
    } catch {
      setError("Failed to load users");
    }
  }

  async function handleSave(name: string, email: string) {
    try {
      if (editing) {
        await api.updateUser(editing.id, name, email);
        setEditing(null);
      } else {
        await api.createUser(name, email);
      }
      await load();
    } catch {
      setError("Failed to save user");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.deleteUser(id);
      await load();
    } catch {
      setError("Failed to delete user");
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h1>Users</h1>
      {error && (
        <p style={{ color: "red" }}>
          {error}{" "}
          <button onClick={() => setError(null)}>Dismiss</button>
        </p>
      )}
      <UserForm
        editing={editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
      <UserTable users={users} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
