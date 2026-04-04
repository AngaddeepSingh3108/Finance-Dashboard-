import axios from 'axios';

const BASE_URL = import.meta.env.DEV ? 'http://localhost:5001/api' : 'https://finance-dashboard-399e.onrender.com/api';

export default function Reports({ user }) {
  const downloadCsv = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/records`, { headers: { 'x-user-id': user._id } });
      const records = res.data;
      if (!records || records.length === 0) {
        alert("No records to download.");
        return;
      }

      // Convert records to CSV
      const headers = ['Date', 'Category', 'Type', 'Amount', 'Notes'];
      const csvRows = [headers.join(',')];

      for (const record of records) {
        const row = [
          new Date(record.date).toLocaleDateString(),
          `"${record.category || ''}"`,
          record.type,
          record.amount,
          `"${record.notes || ''}"`
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'financial_report.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to download CSV: " + err.message);
    }
  };

  return (
    <div className="dark-panel" style={{textAlign: 'center', padding: '5rem'}}>
       <div className="logo-icon" style={{margin: '0 auto 1.5rem', width: '60px', height: '60px', borderRadius: '16px'}}></div>
       <h2 style={{fontSize: '2rem', fontWeight: '600'}}>Export Financial Reports</h2>
       <p style={{color: 'var(--text-gray)', marginTop: '1rem', marginBottom: '2.5rem', fontSize: '1.1rem'}}>
         Generate comprehensive CSV or PDF financial records for your tax summaries.
       </p>
       <button className="btn-primary" style={{padding: '1.2rem 3rem', fontSize: '1.1rem'}} onClick={downloadCsv}>
         Download Annual Report
       </button>
    </div>
  );
}
