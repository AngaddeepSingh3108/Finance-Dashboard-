import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://finance-dashboard-399e.onrender.com/api';

export default function Users({ user }) {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    axios.get(`${BASE_URL}/users`, { headers: { 'x-user-id': user._id } })
      .then(res => setUsers(res.data))
      .catch(err => alert("Error: Unauthorized to view users."));
  }, [user]);

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
           </tr>
         </thead>
         <tbody>
           {users.length === 0 ? (
               <tr><td colSpan="3" style={{padding:'2rem', textAlign:'center', color:'var(--text-gray)'}}>Loading...</td></tr>
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
             </tr>
           ))}
         </tbody>
       </table>
    </div>
  );
}
