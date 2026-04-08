import { useState } from "react";
import type { User } from "../types/user";

interface Props {
  editing: User | null;
  onSave: (name: string, email: string) => void;
  onCancel: () => void;
}

export default function UserForm({ editing, onSave, onCancel }: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave(name.trim(), email.trim());
    setName("");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        style={{ marginRight: 8 }}
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={{ marginRight: 8 }}
      />
      <button type="submit">{editing ? "Update" : "Add"}</button>
      {editing && (
        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
    </form>
  );
}
