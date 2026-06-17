import React, { useState, useEffect } from 'react';

// Pass the state functions as props from the Dashboard
const Users = ({ setActiveTab, setSelectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading Users...</div>;

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: "20px" }}>WordPress Users</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
            <th style={thStyle}>WP ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Balance</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{user.wp_user_id}</td>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={{ ...tdStyle, fontWeight: "bold", color: "#27ae60" }}>
                {Number(user.current_balance).toFixed(2)}
              </td>
              <td style={tdStyle}>
                {/* FIX: Use state setters instead of navigate() */}
                <button 
                  onClick={() => {
                    setSelectedUserId(user.wp_user_id); // Pass ID to Dashboard
                    setActiveTab("user-details");      // Switch tab
                  }}
                  style={manageBtnStyle}
                >
                  Manage Activity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Simple styles for the table
const tableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" };
const thStyle = { padding: "12px", borderBottom: "2px solid #eee", fontSize: "14px", color: "#666" };
const tdStyle = { padding: "12px", fontSize: "14px" };
const manageBtnStyle = { 
  backgroundColor: "#2563eb", 
  color: "white", 
  border: "none", 
  padding: "8px 12px", 
  borderRadius: "4px", 
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600"
};

export default Users;