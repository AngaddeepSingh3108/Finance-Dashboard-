import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://finance-dashboard-399e.onrender.com/api';

export default function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [pendingRoles, setPendingRoles] = useState({});
  const [loadingAction, setLoadingAction] = useState(null);

  const fetchUsers = () => {
    axios.get(`${BASE_URL}/users`, { headers: { 'x-user-id': user._id } })
      .then(res => setUsers(res.data))
      .catch(() => alert("Error: Unauthorized to view users."));
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const pendingUsers = users.filter(u => u.status === 'Pending');
  const activeUsers = users.filter(u => u.status === 'Active' || (!u.status && u._id));
  const inactiveUsers = users.filter(u => u.status === 'Inactive');

  const approveUser = async (id) => {
    const selectedRole = pendingRoles[id] || 'Viewer';
    setLoadingAction(id);
    try {
      await axios.put(`${BASE_URL}/users/${id}`, {
        status: 'Active',
        role: selectedRole,
      }, { headers: { 'x-user-id': user._id } });
      fetchUsers();
    } catch {
      alert("Error approving user.");
    }
    setLoadingAction(null);
  };

  const rejectUser = async (id) => {
    if (!window.confirm("Reject and delete this registration request?")) return;
    setLoadingAction(id);
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, { headers: { 'x-user-id': user._id } });
      fetchUsers();
    } catch {
      alert("Error rejecting user.");
    }
    setLoadingAction(null);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setLoadingAction(id);
    try {
      await axios.put(`${BASE_URL}/users/${id}`, { status: newStatus }, { headers: { 'x-user-id': user._id } });
      fetchUsers();
    } catch {
      alert("Error changing status.");
    }
    setLoadingAction(null);
  };

  const changeRole = async (id, newRole) => {
    setLoadingAction(id);
    try {
      await axios.put(`${BASE_URL}/users/${id}`, { role: newRole }, { headers: { 'x-user-id': user._id } });
      fetchUsers();
    } catch {
      alert("Error changing role.");
    }
    setLoadingAction(null);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    setLoadingAction(id);
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, { headers: { 'x-user-id': user._id } });
      fetchUsers();
    } catch {
      alert("Error deleting user.");
    }
    setLoadingAction(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="users-page">

      {/* Pending Approvals Section */}
      <div className="dark-panel approvals-section">
        <div className="panel-header">
          <div className="panel-title-group">
            <h3>Pending Approvals</h3>
            {pendingUsers.length > 0 && (
              <span className="pending-badge">{pendingUsers.length}</span>
            )}
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#38383e" strokeWidth="2"/>
              <path d="M14 20L18 24L26 16" stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>No pending requests</p>
          </div>
        ) : (
          <div className="pending-cards">
            {pendingUsers.map(u => (
              <div className="pending-card" key={u._id}>
                <div className="pending-card-info">
                  <div className="pending-avatar">{u.name.charAt(0).toUpperCase()}</div>
                  <div className="pending-details">
                    <h4>{u.name}</h4>
                    <span>{u.email}</span>
                    <span className="pending-date">Requested {formatDate(u.createdAt)}</span>
                  </div>
                </div>
                <div className="pending-card-actions">
                  <div className="role-selector">
                    <label>Assign Role</label>
                    <select
                      value={pendingRoles[u._id] || 'Viewer'}
                      onChange={(e) => setPendingRoles(prev => ({ ...prev, [u._id]: e.target.value }))}
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="pending-buttons">
                    <button
                      className="btn-approve"
                      onClick={() => approveUser(u._id)}
                      disabled={loadingAction === u._id}
                    >
                      {loadingAction === u._id ? '...' : 'Approve'}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => rejectUser(u._id)}
                      disabled={loadingAction === u._id}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Users Table */}
      <div className="dark-panel">
        <div className="panel-header">
          <h3>Active Users</h3>
          <span className="user-count">{activeUsers.length}</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th style={{textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.length === 0 ? (
                <tr><td colSpan="4" className="table-empty">No active users</td></tr>
              ) : activeUsers.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                      <div className="user-cell-info">
                        <span className="user-name">{u.name}{u._id === user._id && <span className="you-badge">You</span>}</span>
                        <span className="user-email">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {u._id !== user._id ? (
                      <select
                        className="role-badge-select"
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <span className="role-badge">{u.role}</span>
                    )}
                  </td>
                  <td className="date-cell">{formatDate(u.createdAt)}</td>
                  <td style={{textAlign: 'right'}}>
                    {u._id !== user._id && (
                      <div className="action-buttons">
                        <button
                          className="btn-action deactivate"
                          onClick={() => toggleStatus(u._id, 'Active')}
                          disabled={loadingAction === u._id}
                          title="Deactivate user"
                        >
                          Deactivate
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => deleteUser(u._id)}
                          disabled={loadingAction === u._id}
                          title="Delete user permanently"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive Users */}
      {inactiveUsers.length > 0 && (
        <div className="dark-panel">
          <div className="panel-header">
            <h3>Inactive Users</h3>
            <span className="user-count inactive-count">{inactiveUsers.length}</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{textAlign: 'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inactiveUsers.map(u => (
                  <tr key={u._id} className="inactive-row">
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar inactive-avatar">{u.name.charAt(0).toUpperCase()}</div>
                        <div className="user-cell-info">
                          <span className="user-name">{u.name}</span>
                          <span className="user-email">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="role-badge">{u.role}</span></td>
                    <td className="date-cell">{formatDate(u.createdAt)}</td>
                    <td style={{textAlign: 'right'}}>
                      <div className="action-buttons">
                        <button
                          className="btn-action activate"
                          onClick={() => toggleStatus(u._id, 'Inactive')}
                          disabled={loadingAction === u._id}
                        >
                          Reactivate
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => deleteUser(u._id)}
                          disabled={loadingAction === u._id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
