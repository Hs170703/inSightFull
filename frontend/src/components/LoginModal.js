import React, { useState } from 'react';

function LoginModal({ onLogin, onClose }) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        setLoginError(data.detail || 'Login failed');
        return;
      }
      const data = await response.json();
      onLogin(data.access_token, loginUsername);
    } catch (err) {
      setLoginError('Login failed: ' + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={e => setLoginUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            required
          />
          {loginError && <div className="status-error mb-4">{loginError}</div>}
          <button type="submit">Login</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
