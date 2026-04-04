import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

import Transactions from './Transactions';
import Users from './Users';
import Reports from './Reports';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://finance-dashboard-399e.onrender.com/api';

export default function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [record, setRecord] = useState({ amount: '', type: 'expense', category: '', notes: '' });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/summary`, { headers: { 'x-user-id': user._id } });
      setData(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/records`, {
        amount: Number(record.amount),
        type: record.type,
        category: record.category,
        notes: record.notes
      }, { headers: { 'x-user-id': user._id } });
      setShowModal(false);
      setRecord({ amount: '', type: 'expense', category: '', notes: '' });
      fetchData();
    } catch(err) {
      alert("Failed to add.");
    }
  };

  const chartData = {
    labels: data && Object.keys(data.categoryBreakdown).length ? Object.keys(data.categoryBreakdown) : ['No Data'],
    datasets: [
      {
        label: 'Amount ($)',
        data: data && Object.keys(data.categoryBreakdown).length ? Object.values(data.categoryBreakdown) : [0],
        backgroundColor: '#8c82fc',
        borderRadius: 8,
        barPercentage: 0.6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#38383e' }, ticks: { color: '#a0a0a5' } },
      x: { grid: { display: false }, ticks: { color: '#a0a0a5' } }
    }
  };

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
          <div className="logo">
              <div className="logo-icon"></div>
              <h2>FinDash</h2>
          </div>
          <ul className="nav-links">
              <li className={activeTab === 'Overview' ? 'active' : ''} onClick={() => setActiveTab('Overview')}>Overview</li>
              {(user.role === 'Admin' || user.role === 'Analyst') && (
                <li className={activeTab === 'Transactions' ? 'active' : ''} onClick={() => setActiveTab('Transactions')}>Transactions</li>
              )}
              {user.role === 'Admin' && (
                <>
                  <li className={activeTab === 'Users' ? 'active' : ''} onClick={() => setActiveTab('Users')}>Users</li>
                  <li className={activeTab === 'Reports' ? 'active' : ''} onClick={() => setActiveTab('Reports')}>Reports</li>
                </>
              )}
          </ul>
          <div className="sidebar-bottom">
              <div className="user-profile">
                  <div className="avatar"></div>
                  <div className="user-info">
                      <h4>{user.name.split(' ')[0]}</h4>
                      <p>{user.role}</p>
                  </div>
              </div>
          </div>
      </nav>
      
      <main className="main-content">
          <header className="topbar">
              <div className="header-titles">
                  <h1>{activeTab}</h1>
                  <p>{dateStr}</p>
              </div>
              <div className="actions">
                  <button className="btn-outline" onClick={onLogout}>Log out</button>
                  {activeTab !== 'Reports' && activeTab !== 'Users' && user.role !== 'Viewer' && (
                      <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Record</button>
                  )}
              </div>
          </header>

          {activeTab === 'Overview' && (
            !data ? (
                <div style={{padding:'3rem', textAlign:'center', color:'var(--text-gray)'}}>Loading dashboard...</div>
            ) : (
                <>
                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p>Total Income</p>
                            <h2>${data.totals.totalIncome.toLocaleString()}</h2>
                            <span className="trend positive">+ Current month</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <p>Total Expenses</p>
                            <h2>${data.totals.totalExpenses.toLocaleString()}</h2>
                            <span className="trend negative">- Current month</span>
                        </div>
                    </div>
                    <div className="stat-card highlight-card">
                        <div className="stat-info">
                            <p>Net Balance</p>
                            <h2>${data.totals.netBalance.toLocaleString()}</h2>
                            <span className="trend text-dark">Overall profit margin</span>
                        </div>
                    </div>
                </section>

                <div className="dashboard-bottom">
                    <section className="chart-section dark-panel">
                        <div className="panel-header">
                            <h3>Category Breakdown</h3>
                            <div className="toggles"><span className="active-toggle">All Time</span></div>
                        </div>
                        <div className="chart-container">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </section>

                    <section className="recent-section dark-panel">
                        <div className="panel-header">
                            <h3>Recent Activity</h3>
                        </div>
                        <div className="recent-list">
                            {data.recentActivity.length === 0 ? (
                                <p style={{color:'var(--text-gray)', textAlign:'center', marginTop:'2rem'}}>No current records.</p>
                            ) : data.recentActivity.map(item => (
                                <div className="recent-item" key={item._id}>
                                    <div className="item-left">
                                        <div className="item-icon">{item.type === 'income' ? '↓' : '↑'}</div>
                                        <div className="item-details">
                                            <h4>{item.category}</h4>
                                            <p>{new Date(item.date).toLocaleDateString()} &middot; {item.user?.name || 'Unknown User'}</p>
                                        </div>
                                    </div>
                                    <div className="item-right">
                                        <h4 className={item.type}>${item.amount.toLocaleString()}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                </>
            )
          )}

          {activeTab === 'Transactions' && (user.role === 'Admin' || user.role === 'Analyst') && <Transactions user={user} onRecordChange={fetchData} />}
          {activeTab === 'Users' && user.role === 'Admin' && <Users user={user} />}
          {activeTab === 'Reports' && user.role === 'Admin' && <Reports user={user} />}

      </main>

      {showModal && (
        <div className="modal">
            <div className="modal-content">
                <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
                <h2 style={{marginBottom: '1.5rem', fontWeight: '500'}}>Add New Record</h2>
                <form onSubmit={handleAddSubmit}>
                    <div className="form-group">
                        <label>Amount</label>
                        <input type="number" placeholder="e.g. 1500" required value={record.amount} onChange={e => setRecord({...record, amount:e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select value={record.type} onChange={e => setRecord({...record, type:e.target.value})}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input type="text" placeholder="e.g. Salary, Rent, Coffee" required value={record.category} onChange={e => setRecord({...record, category:e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea placeholder="e.g. Bought from Starbucks" value={record.notes} onChange={e => setRecord({...record, notes:e.target.value})} rows="3" style={{width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #38383e', background: '#1c1c1e', color: '#fff'}}></textarea>
                    </div>
                    <button type="submit" className="btn-primary full-width">Save Transaction</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
