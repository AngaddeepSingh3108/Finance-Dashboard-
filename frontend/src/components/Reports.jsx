import React from 'react';

export default function Reports() {
  return (
    <div className="dark-panel" style={{textAlign: 'center', padding: '5rem'}}>
       <div className="logo-icon" style={{margin: '0 auto 1.5rem', width: '60px', height: '60px', borderRadius: '16px'}}></div>
       <h2 style={{fontSize: '2rem', fontWeight: '600'}}>Export Financial Reports</h2>
       <p style={{color: 'var(--text-gray)', marginTop: '1rem', marginBottom: '2.5rem', fontSize: '1.1rem'}}>
         Generate comprehensive CSV or PDF financial records for your tax summaries.
       </p>
       <button className="btn-primary" style={{padding: '1.2rem 3rem', fontSize: '1.1rem'}} onClick={() => alert("Your report is being generated and will download shortly!")}>
         Download Annual Report
       </button>
    </div>
  );
}
