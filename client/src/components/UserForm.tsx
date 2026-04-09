import { useState, useEffect } from "react";
import type { User } from "../types/user";

interface Props {
  editing: User | null;
  onSave: (name: string, email: string) => void;
  onCancel: () => void;
}

export default function UserForm({ editing, onSave, onCancel }: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [email, setEmail] = useState(editing?.email ?? "");

  useEffect(() => {
    setName(editing?.name ?? "");
    setEmail(editing?.email ?? "");
  }, [editing]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave(name.trim(), email.trim());
    setName("");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <input
        className=""
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        className=""
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-primary" type="submit">{editing ? "Update" : "Add"}</button>
        {editing && (
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
