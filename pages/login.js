import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      if (onLogin) onLogin(data.token);
      if (remember) {
        localStorage.setItem('adminToken', data.token);
      }
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: 32,
          borderRadius: 12,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          minWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        <h2 style={{ textAlign: 'center', margin: 0 }}>LOGIN</h2>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#f3f3f3',
            fontSize: 16
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#f3f3f3',
            fontSize: 16
          }}
          required
        />
        <label style={{ display: 'flex', alignItems: 'center', fontSize: 15 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Remember me
        </label>
        <button
          type="submit"
          style={{
            background: '#e040fb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '12px 0',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 8
          }}
        >
          LOGIN
        </button>
      </form>
    </div>
  );
}