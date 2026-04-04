import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://finance-dashboard-399e.onrender.com/api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Viewer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const res = await axios.post(`${BASE_URL}/users`, {
          name,
          email,
          password,
          role
        });
        if (res.data) {
          onLogin(res.data);
        }
      } else {
        const res = await axios.post(`${BASE_URL}/users/login`, { email, password });
        if (res.data) {
          onLogin(res.data);
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          alert('Error: ' + err.response.data.message);
        } else if (err.response.data.errors && err.response.data.errors.length > 0) {
          alert('Error: ' + err.response.data.errors[0].msg);
        } else {
          alert('Server Error');
        }
      } else {
        alert('Server is offline or unreachable.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <div className="logo-icon"></div>
          <h2>FinDash</h2>
        </div>
        <p>{isRegister ? 'Create a new account' : 'Welcome back, please login'}</p>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input 
              type="text" 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="login-input"
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="login-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="login-input"
          />
          {isRegister && (
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="login-input"
              required
            >
              <option value="Viewer">Viewer</option>
              <option value="Analyst">Analyst</option>
              <option value="Admin">Admin</option>
            </select>
          )}
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <p className="toggle-register" onClick={() => setIsRegister(!isRegister)} style={{marginTop: '15px', cursor: 'pointer', textAlign: 'center', color: '#6366f1'}}>
          {isRegister ? 'Already have an account? Sign In' : 'No account? Create one'}
        </p>
      </div>
    </div>
  );
}
