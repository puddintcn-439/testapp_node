import { useState } from "react";
import { login as apiLogin } from "../api/authApi";

interface Props {
  onSuccess?: (token: string) => void;
}

export default function LoginForm({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const data = await apiLogin(email, password);
      const token = data.token;
      try { localStorage.setItem("token", token); } catch (err) {}
      onSuccess?.(token);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error">{error}</div>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button className="btn btn-primary" type="submit">Login</button>
    </form>
  );
}
