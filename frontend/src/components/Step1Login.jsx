import React, { useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Step1Login({ onLoginSuccess, apiBase }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle standard login fallback submission
  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${apiBase}/api/login`, { email, password });
      if (res.data.success) onLoginSuccess(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication handshake blocked.');
    }
  };

  // 🌟 Handles successful Google verification handoffs
  // 🌟 Handles successful Google verification handoffs
  // Change only the handleGoogleSuccess function to match this entry cleanly:
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post(`${apiBase}/api/auth/google`, {
      credential: credentialResponse.credential
    });
    
    if (res.data.success) {
      console.log(`Welcome back, ${res.data.user.name}!`);
      onLoginSuccess(res.data.token);
    }
  } catch (err) {
    console.error("Backend login error details:", err);
    setError('Google Cloud identity verification dropped out.');
  }
};

  return (
    // Pass your Google Cloud Client ID key here to initialize the framework
    <GoogleOAuthProvider clientId="700152121138-48d3ccms0vnqr3hq53g26dsb8b52o4k5.apps.googleusercontent.com">
      <div style={{ maxWidth: '420px', margin: '40px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ textAlign: 'center', margin: '0 0 8px 0', color: '#1e293b' }}>Enterprise Portal Gateway</h3>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>Log in to initialize offer letter dispatch tracking schedules.</p>

        {error && <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: '6px', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

        {/* 🌟 GOOGLE SINGLE SIGN-ON BUTTON CONTAINER */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Identity handshake execution terminated.')}
            useOneTap
            shape="pill"
            theme="filled_blue"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '20px 0', color: '#cbd5e1' }}>
          <hr style={{ flexGrow: 1, border: 'none', height: '1px', backgroundColor: '#e2e8f0' }} />
          <span style={{ padding: '0 10px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Or Email Standard Access</span>
          <hr style={{ flexGrow: 1, border: 'none', height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        <form onSubmit={handleStandardLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Work Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px' }} placeholder="admin@company.com" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontSize: '14px' }} placeholder="••••••••" />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '8px', fontSize: '14px' }}>Authorize Session</button>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}