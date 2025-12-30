import React, { useState, useEffect } from 'react';

const Campaigns = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');

        // URL points to /api/stores as defined in your server.js
        const res = await fetch(`${API_BASE}/stores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Error: ${res.status}`);
        }

        const data = await res.json();
        // Since backend sends result.rows, data is the array directly
        setStores(Array.isArray(data) ? data : []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [API_BASE]);

  // --- Inline Styles ---
  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' },
    title: { color: '#333', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    card: { background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    storeName: { margin: '0', fontSize: '1.25rem', color: '#2c3e50' },
    slug: { fontSize: '0.85rem', color: '#7f8c8d', display: 'block', marginBottom: '15px' },
    statsRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '15px' },
    statItem: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '0.75rem', textTransform: 'uppercase', color: '#95a5a6', marginBottom: '4px' },
    valSales: { fontWeight: 'bold', fontSize: '1.1rem', color: '#27ae60' },
    valComm: { fontWeight: 'bold', fontSize: '1.1rem', color: '#2980b9' },
    info: { textAlign: 'center', padding: '40px', fontSize: '1.2rem' }
  };

  if (loading) return <div style={styles.info}>Loading stores...</div>;
  if (error) return <div style={{...styles.info, color: 'red'}}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Store Performance</h1>
      
      {stores.length === 0 ? (
        <p style={styles.info}>No stores found. Please sync from WordPress.</p>
      ) : (
        <div style={styles.grid}>
          {stores.map((store) => (
            <div key={store.id} style={styles.card}>
              <h2 style={styles.storeName}>{store.name}</h2>
              <span style={styles.slug}>{store.slug}</span>
              
              <div style={styles.statsRow}>
                <div style={styles.statItem}>
                  <span style={styles.label}>Total Payout</span>
                  <span style={styles.valSales}>
                    ${Number(store.total_sales).toFixed(2)}
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.label}>Commission</span>
                  <span style={styles.valComm}>
                    ${Number(store.total_commission).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;