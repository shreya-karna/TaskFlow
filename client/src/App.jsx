import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const nav = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('tf_user') || 'null'));
  const login = ({ token, user }) => {
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', JSON.stringify(user));
    setUser(user);
    nav('/app');
  };
 const logout = () => {
  localStorage.removeItem('tf_token');
  localStorage.removeItem('tf_user');
  setUser(null);
  nav('/');
};
  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/login" element={<Auth mode="login" onAuth={login} />} />
      <Route path="/signup" element={<Auth mode="signup" onAuth={login} />} />
      <Route path="/app" element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} />
    </Routes>
  );
}
