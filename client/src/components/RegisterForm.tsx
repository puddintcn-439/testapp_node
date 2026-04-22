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
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label htmlFor="reg-name">Name</label>
        <input id="reg-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
      </div>

      <div className="form-group">
        <label htmlFor="reg-email">Email</label>
        <input id="reg-email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
      </div>

      <div className="form-group">
        <label htmlFor="reg-password">Password</label>
        <input id="reg-password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      </div>

      <div className="d-flex">
        <button className="btn btn-primary" type="submit">Register</button>
        <a href="/login.html" className="btn btn-link ml-3">Login</a>
      </div>
    </form>
  );
}
