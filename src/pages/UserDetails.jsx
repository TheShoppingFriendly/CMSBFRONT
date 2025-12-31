import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
  const { wp_user_id } = useParams();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    try {
      const res = await fetch(`${API_BASE}/users/update-balance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          wp_user_id: parseInt(wp_user_id),
          amount: parseFloat(amount),
          reason: reason
        })
      });

      if (res.ok) {
        alert("Balance Updated!");
        window.location.reload();
      }
    } catch (err) {
      alert("Error updating balance");
    }
  };

  return (
    <div className="detail-container">
      <h2>Manage User: {wp_user_id}</h2>
      
      <div className="card">
        <h3>Adjust Cashback Balance</h3>
        <form onSubmit={handleUpdateBalance}>
          <input 
            type="number" 
            placeholder="Amount (e.g. 5.00 or -2.00)" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="Reason for change" 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required 
          />
          <button type="submit">Update Balance</button>
        </form>
      </div>

      {/* Future: Add a table here to fetch and show balance_logs for this user */}
    </div>
  );
};

export default UserDetails; 