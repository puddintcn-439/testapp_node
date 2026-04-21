import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const BASE = `${API_URL}/api/users`;

function authHeaders() {
  try {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (err) {
    return {};
  }
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(BASE, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<User[]>;
}

export async function createUser(name: string, email: string): Promise<User> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json() as Promise<User>;
}

export async function updateUser(id: number, name: string, email: string): Promise<User> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json() as Promise<User>;
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE", headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to delete user");
}
