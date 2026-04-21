import { useState } from "react";
import { register as apiRegister } from "../api/authApi";

interface Props {
  onRegistered?: (token: string) => void;
}

export default function RegisterForm({ onRegistered }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const data = await apiRegister(name, email, password);
      const token = data.token;
      try { localStorage.setItem("token", token); } catch (err) {}
      onRegistered?.(token);
    } catch (err: any) {
      setError(err.message || "Register failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error">{error}</div>}
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button className="btn btn-primary" type="submit">Register</button>
    </form>
  );
}
