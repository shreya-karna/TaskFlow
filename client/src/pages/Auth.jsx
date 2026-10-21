import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Auth({ mode, onAuth }) {
  const signup = mode === 'signup';
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { onAuth(await api('/auth/' + mode, { method: 'POST', body: f })); }
    catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <main className="auth">
      <form onSubmit={submit} className="auth-card">
        <Link to="/" className="logo">TaskFlow</Link>
        <h1>{signup ? 'Create your account' : 'Welcome back'}</h1>
        {signup && <label>Name<input value={f.name} onChange={set('name')} autoComplete="name" required /></label>}
        <label>Email<input type="email" value={f.email} onChange={set('email')} autoComplete="email" required /></label>
        <label>Password<input type="password" value={f.password} onChange={set('password')} minLength={6} autoComplete={signup ? 'new-password' : 'current-password'} required /></label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn primary" disabled={busy}>{signup ? 'Create account' : 'Log in'}</button>
        <p className="muted">{signup ? 'Already have an account?' : 'New to TaskFlow?'} <Link to={signup ? '/login' : '/signup'}>{signup ? 'Log in' : 'Create an account'}</Link></p>
      </form>
    </main>
  );
}
