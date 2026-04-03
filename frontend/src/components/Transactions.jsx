import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

export default function Transactions({ user }) {
  const [records, setRecords] = useState([]);
  
  useEffect(() => {
    axios.get(`${BASE_URL}/records`, { headers: { 'x-user-id': user._id } })
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, [user]);

  return (
    <div className="dark-panel">
       <div className="panel-header" style={{marginBottom: '1rem'}}>
           <h3>All Transactions</h3>
       </div>
       <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
         <thead>
           <tr style={{borderBottom: '1px solid var(--border-color)'}}>
             <th style={{padding: '1rem'}}>Date</th>
             <th style={{padding: '1rem'}}>Category</th>
             <th style={{padding: '1rem'}}>Type</th>
             <th style={{padding: '1rem'}}>Amount</th>
           </tr>
         </thead>
         <tbody>
           {records.length === 0 ? (
               <tr><td colSpan="4" style={{padding:'2rem', textAlign:'center', color:'var(--text-gray)'}}>No transactions found.</td></tr>
           ) : records.map(r => (
             <tr key={r._id} style={{borderBottom: '1px solid var(--border-color)'}}>
               <td style={{padding: '1rem', color: 'var(--text-gray)'}}>{new Date(r.date).toLocaleDateString()}</td>
               <td style={{padding: '1rem'}}>{r.category}</td>
               <td style={{padding: '1rem', textTransform: 'capitalize'}} className={r.type}>{r.type}</td>
               <td style={{padding: '1rem', fontWeight: '600'}}>${r.amount.toLocaleString()}</td>
             </tr>
           ))}
         </tbody>
       </table>
    </div>
  );
}
