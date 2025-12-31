import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const UserDetails = ({ wp_user_id, setActiveTab }) => {
  const [userData, setUserData] = useState({ clicks: [], conversions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserActivity = async () => {
      // 1. Critical Check: If wp_user_id is missing, we stop here.
      if (!wp_user_id) {
        console.error("UserDetails received no wp_user_id prop");
        setError("No User ID selected. Please go back and select a user.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // 2. Fetch Data (Ensure this path matches your backend exactly)
        const res = await api.get(`/users/${wp_user_id}/activity`);
        
        console.log("Activity Data received:", res.data);
        setUserData(res.data);
      } catch (err) {
        console.error("API Error:", err);
        setError(`Could not load activity: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, [wp_user_id]);

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch(`/users/update-balance`, {
        wp_user_id: parseInt(wp_user_id),
        amount: parseFloat(amount),
        reason
      });
      alert("Balance Updated Successfully!");
      setAmount("");
      setReason("");
      
      // Refresh data to show new logs if applicable
      const res = await api.get(`/users/${wp_user_id}/activity`);
      setUserData(res.data);
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || "Server error"));
    } finally {
      setUpdating(false);
    }
  };

  // Error State Render
  if (error) return (
    <div style={{ padding: "40px", textAlign: "center", background: "#fff", borderRadius: "12px", border: "1px solid #feb2b2" }}>
      <h3 style={{ color: "#c53030" }}>Error</h3>
      <p style={{ color: "#742a2a" }}>{error}</p>
      <button 
        onClick={() => setActiveTab("users-list")}
        style={{ padding: "10px 20px", background: "#3182ce", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "10px" }}
      >
        Go Back to User List
      </button>
    </div>
  );

  // Loading State Render
  if (loading) return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <div className="spinner" style={spinnerStyle}></div>
      <p style={{ marginTop: "20px", color: "#666", fontWeight: "600" }}>
        Loading Ledger for User #{wp_user_id}...
      </p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px", maxWidth: "100%" }}>
      
      {/* HEADER WITH BACK BUTTON */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
          onClick={() => setActiveTab("users-list")}
          style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
        >
          ← Back to Users List
        </button>
        <span style={{ color: "#6b7280", fontSize: "14px" }}>User ID: <strong>#{wp_user_id}</strong></span>
      </div>

      {/* SECTION 1: BALANCE ADJUSTMENT */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: "18px", color: "#111827" }}>Manual Balance Adjustment</h3>
        <form onSubmit={handleUpdateBalance} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Amount ($)</label>
            <input 
              type="number" step="0.01" placeholder="e.g. 5.00 or -2.50" 
              value={amount} onChange={(e) => setAmount(e.target.value)}
              style={{ ...inputStyle, width: "100%" }} required 
            />
          </div>
          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Reason / Note</label>
            <input 
              type="text" placeholder="Adjustment reason..." 
              value={reason} onChange={(e) => setReason(e.target.value)}
              style={{ ...inputStyle, width: "100%" }} required 
            />
          </div>
          <button type="submit" disabled={updating} style={btnStyle}>
            {updating ? "Updating..." : "Apply Change"}
          </button>
        </form>
      </div>

      {/* SECTION 2: CONVERSIONS TABLE */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Recent Conversions</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Campaign</th>
                <th style={thStyle}>Payout</th>
                <th style={thStyle}>Commission</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {userData.conversions?.length > 0 ? (
                userData.conversions.map((c, i) => (
                  <tr key={i} style={trStyle}>
                    <td style={tdStyle}>{c.campaign_id || "N/A" }</td>
                    <td style={{ ...tdStyle, color: "#059669", fontWeight: "bold" }}>${c.payout}</td>
                    <td style={{ ...tdStyle, color: "#059669", fontWeight: "bold" }}>${c.commission}</td>
                    <td style={tdStyle}>
                       <span style={statusBadge(c.status)}>{c.status}</span>
                    </td>
                    <td style={tdStyle}>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={emptyStyle}>No conversions recorded for this user.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: CLICKS TABLE */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Click History</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Click ID</th>
                <th style={thStyle}>IP Address</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {userData.clicks?.length > 0 ? (
                userData.clicks.map((clk, i) => (
                  <tr key={i} style={trStyle}>
                    <td style={{ ...tdStyle, fontFamily: "monospace", color: "#3b82f6" }}>{clk.clickid}</td>
                    <td style={tdStyle}>{clk.ip_address}</td>
                    <td style={tdStyle}>{new Date(clk.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={emptyStyle}>No click tracking found for this user.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

// --- STYLES ---
const cardStyle = { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" };
const labelStyle = { display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "#4b5563" };
const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" };
const btnStyle = { padding: "10px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", height: "42px" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tableTitleStyle = { marginTop: 0, paddingBottom: "12px", borderBottom: "1px solid #f3f4f6", marginBottom: "15px", fontSize: "16px" };
const theadStyle = { backgroundColor: "#f9fafb", textAlign: "left" };
const thStyle = { padding: "12px", fontSize: "12px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.025em" };
const tdStyle = { padding: "12px", fontSize: "14px", color: "#374151" };
const trStyle = { borderBottom: "1px solid #f3f4f6" };
const emptyStyle = { padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" };
const spinnerStyle = { border: "4px solid #f3f3f3", borderTop: "4px solid #3498db", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" };

const statusBadge = (status) => ({
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    backgroundColor: status === 'approved' ? '#d1fae5' : '#fef3c7',
    color: status === 'approved' ? '#065f46' : '#92400e'
});

export default UserDetails;