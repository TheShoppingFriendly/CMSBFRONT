import React, { useState, useEffect } from 'react';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const getStores = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_BASE}/stores`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        
        // DEBUG: Check your browser console to see what 'data' is
        console.log("Raw data from server:", data);

        // If your backend sends 'result.rows', data IS the array.
        setStores(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    getStores();
  }, [API_BASE]);

  if (loading) return <div style={{padding: '20px'}}>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Stores ({stores.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {stores.map(store => (
          <div key={store.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
            <strong>{store.name}</strong>
            <p style={{ fontSize: '12px', color: '#666' }}>{store.slug}</p>
          </div>
        ))}
      </div>
      {stores.length === 0 && <p>No stores found in the database.</p>}
    </div>
  );
};

export default StoreList;