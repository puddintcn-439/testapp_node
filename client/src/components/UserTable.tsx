import type { User } from "../types/user";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr style={{ background: "#f4f4f4" }}>
          <th style={th}>ID</th>
          <th style={th}>Name</th>
          <th style={th}>Email</th>
          <th style={th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td style={td}>{u.id}</td>
            <td style={td}>{u.name}</td>
            <td style={td}>{u.email}</td>
            <td style={td}>
              <button onClick={() => onEdit(u)} style={{ marginRight: 8 }}>
                Edit
              </button>
              <button onClick={() => onDelete(u.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
};
