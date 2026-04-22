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
    <form onSubmit={handleSubmit} className="">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" type="email" required />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input id="login-password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-primary" type="submit">Login</button>
        <a className="btn btn-link" href="#">Forgot?</a>
      </div>
    </form>
  );
}
