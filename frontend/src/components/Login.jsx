import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const BASE_URL = 'http://localhost:5000/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('demo_react@example.com');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/users/login`, { email });
      if (res.data) {
        onLogin(res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        try {
          const resCreate = await axios.post(`${BASE_URL}/users`, {
            name: email.split('@')[0],
            email,
            role: 'Admin'
          });
          onLogin(resCreate.data);
        } catch (createErr) {
          alert('Login Error');
        }
      } else {
        alert('Server is offline. Start the backend with: node server.js');
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <div className="logo-icon"></div>
          <h2>FinDash React</h2>
        </div>
        <p>Welcome back, please login</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="login-input"
          />
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
