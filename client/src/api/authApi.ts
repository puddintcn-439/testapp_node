const API_URL = import.meta.env.VITE_API_URL ?? "";
const BASE = `${API_URL}/api/auth`;

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Failed to register");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Failed to login");
  return res.json();
}
