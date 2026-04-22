import { useEffect, useState } from "react";
import type { User } from "./types/user";
import * as api from "./api/userApi";
import UserForm from "./components/UserForm";
import UserTable from "./components/UserTable";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    load();
    try {
      setIsLoggedIn(!!localStorage.getItem("token"));
    } catch (err) {}
  }, []);

  async function load() {
    try {
      setUsers(await api.fetchUsers());
    } catch {
      setError("Failed to load users");
    }
  }

  async function handleSave(name: string, email: string) {
    try {
      if (editing) {
        await api.updateUser(editing.id, name, email);
        setEditing(null);
      } else {
        await api.createUser(name, email);
      }
      await load();
    } catch {
      setError("Failed to save user");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this user?")) return;
    try {
      await api.deleteUser(id);
      await load();
    } catch {
      setError("Failed to delete user");
    }
  }

  function handleAuthSuccess(token: string) {
    try { localStorage.setItem('token', token); } catch (err) {}
    setIsLoggedIn(true);
    setShowAuth(false);
    load();
  }

  function handleLogout() {
    try { localStorage.removeItem('token'); } catch (err) {}
    setIsLoggedIn(false);
    load();
  }

  return (
    <div className="app">
      <div className="card">
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <h1 className="header">Users</h1>
            <div>
              {isLoggedIn ? (
                <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
              ) : (
                <button className="btn btn-ghost" onClick={() => { setAuthMode('login'); setShowAuth(true); }} title="Login">
                  <i className="fa fa-user" aria-hidden />
                </button>
              )}
            </div>
          </div>
        {error && (
          <div className="error">
            <span>{error}</span>
            <button className="btn btn-ghost" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div style={{ height: 12 }} />

        <UserForm
          editing={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />

        {showAuth && (
          <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{background:'#fff', padding:20, borderRadius:6, minWidth:320}}>
              <div style={{display:'flex', gap:8, marginBottom:12}}>
                <button className={authMode === 'login' ? 'btn btn-primary' : 'btn btn-ghost'} onClick={() => setAuthMode('login')}>Login</button>
                <button className={authMode === 'register' ? 'btn btn-primary' : 'btn btn-ghost'} onClick={() => setAuthMode('register')}>Register</button>
              </div>
              {authMode === 'login' ? (
                <LoginForm onSuccess={handleAuthSuccess} />
              ) : (
                <RegisterForm onRegistered={handleAuthSuccess} />
              )}
              <div style={{textAlign:'right', marginTop:12}}>
                <button className="btn btn-ghost" onClick={() => setShowAuth(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        <UserTable users={users} onEdit={setEditing} onDelete={handleDelete} />
      </div>
    </div>
  );
}
