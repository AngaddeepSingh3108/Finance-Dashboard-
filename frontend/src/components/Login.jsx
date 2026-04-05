import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://finance-dashboard-399e.onrender.com/api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        });
        if (res.data && res.data.pending) {
          setIsPendingApproval(true);
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

  const handleBackToLogin = () => {
    setIsPendingApproval(false);
    setIsRegister(false);
    setName('');
    setEmail('');
    setPassword('');
  };

  if (isPendingApproval) {
    return (
      <div className="login-container">
        <div className="login-box pending-box">
          <div className="pending-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#cfff5e" strokeWidth="3" fill="rgba(207,255,94,0.08)" />
              <path d="M32 18V34L42 40" stroke="#cfff5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="pending-title">Account Created!</h2>
          <p className="pending-message">
            Your account is pending admin approval. You'll receive access once an administrator reviews and approves your registration.
          </p>
          <div className="pending-steps">
            <div className="pending-step">
              <div className="step-number completed">1</div>
              <div className="step-text">
                <strong>Account Created</strong>
                <span>Registration submitted successfully</span>
              </div>
            </div>
            <div className="pending-step">
              <div className="step-number active">2</div>
              <div className="step-text">
                <strong>Awaiting Approval</strong>
                <span>Admin will review your request</span>
              </div>
            </div>
            <div className="pending-step">
              <div className="step-number">3</div>
              <div className="step-text">
                <strong>Access Granted</strong>
                <span>You can log in after approval</span>
              </div>
            </div>
          </div>
          <button className="btn-outline full-width" onClick={handleBackToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

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
              placeholder="Full Name" 
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
            <p className="signup-note">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{verticalAlign: 'middle', marginRight: '6px'}}>
                <circle cx="7" cy="7" r="6" stroke="#a0a0a5" strokeWidth="1.2"/>
                <path d="M7 4.5V7.5M7 9.5V9.5" stroke="#a0a0a5" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Your role will be assigned by an administrator after approval.
            </p>
          )}
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Request Access' : 'Sign In')}
          </button>
        </form>
        <p className="toggle-register" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Sign In' : 'No account? Request Access'}
        </p>
      </div>
    </div>
  );
}
