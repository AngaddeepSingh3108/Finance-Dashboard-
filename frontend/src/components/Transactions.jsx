import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://finance-dashboard-399e.onrender.com/api';

export default function Transactions({ user }) {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchRecords = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/records`, { headers: { 'x-user-id': user._id } })
      .then(res => { setRecords(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to permanently delete this record?")) return;
    try {
      await axios.delete(`${BASE_URL}/records/${id}`, { headers: { 'x-user-id': user._id } });
      fetchRecords(); // Refresh the list from the database
    } catch(err) {
      alert("Error: You do not have permission to delete this.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/records/${editingRecord._id}`, {
        amount: Number(editingRecord.amount),
        type: editingRecord.type,
        category: editingRecord.category
      }, { headers: { 'x-user-id': user._id } });
      setEditingRecord(null);
      fetchRecords(); // Quickly flush updates to UI
    } catch(err) {
      alert("Error: Failed to update this record.");
    }
  };

  return (
    <div className="dark-panel" style={{position:'relative'}}>
       <div className="panel-header" style={{marginBottom: '1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
           <h3>All Transactions</h3>
           <button className="btn-outline" onClick={fetchRecords} style={{padding: '0.4rem 1rem', fontSize:'0.9rem'}}>Reload Table</button>
       </div>
       
       {loading ? (
             <p style={{padding:'2rem', textAlign:'center', color:'var(--text-gray)'}}>Loading data...</p>
       ) : (
         <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
           <thead>
             <tr style={{borderBottom: '1px solid var(--border-color)'}}>
               <th style={{padding: '1rem'}}>Date</th>
               <th style={{padding: '1rem'}}>Category</th>
               <th style={{padding: '1rem'}}>Type</th>
               <th style={{padding: '1rem'}}>Amount</th>
               {(user.role === 'Admin' || user.role === 'Analyst') && <th style={{padding: '1rem', textAlign:'right'}}>Actions</th>}
             </tr>
           </thead>
           <tbody>
             {records.length === 0 ? (
                 <tr><td colSpan="5" style={{padding:'2rem', textAlign:'center', color:'var(--text-gray)'}}>No transactions safely logged yet.</td></tr>
             ) : records.map(r => (
               <tr key={r._id} style={{borderBottom: '1px solid var(--border-color)'}}>
                 <td style={{padding: '1rem', color: 'var(--text-gray)'}}>{new Date(r.date).toLocaleDateString()}</td>
                 <td style={{padding: '1rem'}}>{r.category}</td>
                 <td style={{padding: '1rem', textTransform: 'capitalize'}} className={r.type}>{r.type}</td>
                 <td style={{padding: '1rem', fontWeight: '600'}}>${r.amount.toLocaleString()}</td>
                 {(user.role === 'Admin' || user.role === 'Analyst') && (
                     <td style={{padding: '1rem', textAlign:'right'}}>
                         <button className="btn-outline" style={{padding:'0.4rem 0.8rem', fontSize:'0.8rem', marginRight:'0.5rem'}} onClick={() => setEditingRecord(r)}>Edit</button>
                         {user.role === 'Admin' && (
                             <button className="btn-outline" style={{padding:'0.4rem 0.8rem', fontSize:'0.8rem', borderColor:'#ff6b6b', color:'#ff6b6b'}} onClick={() => handleDelete(r._id)}>Delete</button>
                         )}
                     </td>
                 )}
               </tr>
             ))}
           </tbody>
         </table>
       )}

       {editingRecord && (
         <div className="modal" style={{zIndex: 200}}>
             <div className="modal-content">
                 <span className="close-btn" onClick={() => setEditingRecord(null)}>&times;</span>
                 <h2 style={{marginBottom: '1.5rem', fontWeight: '500'}}>Edit Record</h2>
                 <form onSubmit={handleUpdate}>
                     <div className="form-group">
                         <label>Amount</label>
                         <input type="number" required value={editingRecord.amount} onChange={e => setEditingRecord({...editingRecord, amount:e.target.value})} />
                     </div>
                     <div className="form-group">
                         <label>Type</label>
                         <select value={editingRecord.type} onChange={e => setEditingRecord({...editingRecord, type:e.target.value})}>
                             <option value="income">Income</option>
                             <option value="expense">Expense</option>
                         </select>
                     </div>
                     <div className="form-group">
                         <label>Category</label>
                         <input type="text" required value={editingRecord.category} onChange={e => setEditingRecord({...editingRecord, category:e.target.value})} />
                     </div>
                     <button type="submit" className="btn-primary full-width">Save Changes</button>
                 </form>
             </div>
         </div>
       )}
    </div>
  );
}
