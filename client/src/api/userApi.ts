import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const BASE = `${API_URL}/api/users`;

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<User[]>;
}

export async function createUser(name: string, email: string): Promise<User> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json() as Promise<User>;
}

export async function updateUser(id: number, name: string, email: string): Promise<User> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json() as Promise<User>;
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
}
