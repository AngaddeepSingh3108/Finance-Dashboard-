import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://finance-dashboard-399e.onrender.com/api';

export default function Users({ user }) {
  const [users, setUsers] = useState([]);
  
  const fetchUsers = () => {
    axios.get(`${BASE_URL}/users`, { headers: { 'x-user-id': user._id } })
      .then(res => setUsers(res.data))
      .catch(err => alert("Error: Unauthorized to view users."));
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`${BASE_URL}/users/${id}`, { status: newStatus }, { headers: { 'x-user-id': user._id } });
      fetchUsers();
    } catch (err) {
      alert("Error changing status.");
    }
  };

  const deleteUser = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, { headers: { 'x-user-id': user._id } });
      fetchUsers();
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  return (
    <div className="dark-panel">
       <div className="panel-header" style={{marginBottom: '1rem'}}>
           <h3>System Users (Admin Only)</h3>
       </div>
       <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
         <thead>
           <tr style={{borderBottom: '1px solid var(--border-color)'}}>
             <th style={{padding: '1rem'}}>Name</th>
             <th style={{padding: '1rem'}}>Email</th>
             <th style={{padding: '1rem'}}>Role</th>
             <th style={{padding: '1rem'}}>Status</th>
             <th style={{padding: '1rem', textAlign: 'right'}}>Actions</th>
           </tr>
         </thead>
         <tbody>
           {users.length === 0 ? (
               <tr><td colSpan="5" style={{padding:'2rem', textAlign:'center', color:'var(--text-gray)'}}>Loading...</td></tr>
           ) : users.map(u => (
             <tr key={u._id} style={{borderBottom: '1px solid var(--border-color)'}}>
               <td style={{padding: '1rem', fontWeight: '500'}}>{u.name}</td>
               <td style={{padding: '1rem', color: 'var(--text-gray)'}}>{u.email}</td>
               <td style={{padding: '1rem'}}>
                  <span style={{
                      background: 'rgba(140, 130, 252, 0.15)', 
                      color: 'var(--primary-purple)', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: '600'
                  }}>
                     {u.role}
                  </span>
               </td>
               <td style={{padding: '1rem'}}>
                  <span style={{
                      color: u.status === 'Active' ? '#4caf50' : '#ff9800',
                      fontWeight: '600'
                  }}>
                     {u.status || 'Active'}
                  </span>
               </td>
               <td style={{padding: '1rem', textAlign: 'right'}}>
                  {u._id !== user._id && (
                    <>
                      <button className="btn-outline" style={{padding:'0.4rem 0.8rem', fontSize:'0.8rem', marginRight:'0.5rem'}} onClick={() => toggleStatus(u._id, u.status || 'Active')}>
                        {u.status === 'Active' ? 'Deactivate' : 'Approve/Activate'}
                      </button>
                      <button className="btn-outline" style={{padding:'0.4rem 0.8rem', fontSize:'0.8rem', borderColor:'#ff6b6b', color:'#ff6b6b'}} onClick={() => deleteUser(u._id)}>
                        Delete
                      </button>
                    </>
                  )}
               </td>
             </tr>
           ))}
         </tbody>
       </table>
    </div>
  );
}
