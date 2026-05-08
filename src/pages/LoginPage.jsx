import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin/styles/admin.css';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e){
    e.preventDefault();
    // Simulate successful login (no validation)
    navigate('/admin/dashboard');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p className="admin-muted">Sign in with your admin credentials to access the dashboard.</p>
        <form className="login-form" onSubmit={handleLogin}>
          <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
