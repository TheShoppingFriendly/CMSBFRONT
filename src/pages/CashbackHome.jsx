import React from 'react';
import { useNavigate } from 'react-router-dom';

const CashbackHome = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '60px', marginBottom: '20px' }}>💸</div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Cashback Hub</h2>
      <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
        Manage and verify user settlements, adjust balances, and monitor the global financial health of the platform.
      </p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate('users')}
          style={{ padding: '12px 24px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
        >
          Process Settlements
        </button>
        <button 
          onClick={() => navigate('accounting')}
          style={{ padding: '12px 24px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
        >
          View Accounting
        </button>
      </div>
    </div>
  );
};

export default CashbackHome;