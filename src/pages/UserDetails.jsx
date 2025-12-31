import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const UserDetails = ({ wp_user_id }) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [userData, setUserData] = useState({ clicks: [], conversions: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setLoading(true);
        // We use a try-catch block specifically for the fetch
        const res = await api.get(`/users/${wp_user_id}/activity`);
        setUserData(res.data);
      } catch (err) {
        console.error("Activity fetch failed, user might have no history yet:", err);
      } finally {
        setLoading(false); // This ensures the "Loading" screen goes away
      }
    };

    if (wp_user_id) {
      fetchUserActivity();
    } else {
      setLoading(false);
    }
  }, [wp_user_id]);

  const handleUpdateBalance = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch(`/users/update-balance`, {
        wp_user_id: parseInt(wp_user_id),
        amount: parseFloat(amount),
        reason: reason
      });
      alert("Success: Balance Updated!");
      setAmount("");
      setReason("");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Update failed"));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
      <div className="spinner"></div> 
      <p>Fetching User Ledger...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px" }}>
      
      {/* Balance Adjustment Section */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, color: "#111827" }}>Quick Action: User #{wp_user_id}</h3>
        <form onSubmit={handleUpdateBalance} style={{ display: "flex", gap: "12px" }}>
          <input 
            type="number" step="0.01" placeholder="0.00" 
            value={amount} onChange={(e) => setAmount(e.target.value)}
            style={inputStyle} required 
          />
          <input 
            type="text" placeholder="Reason (e.g. Compensation)" 
            value={reason} onChange={(e) => setReason(e.target.value)}
            style={{ ...inputStyle, flex: 1 }} required 
          />
          <button type="submit" disabled={updating} style={buttonStyle}>
            {updating ? "Saving..." : "Update Balance"}
          </button>
        </form>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={statCard}>
          <small style={labelStyle}>Tracked Clicks</small>
          <div style={valueStyle}>{userData.clicks?.length || 0}</div>
        </div>
        <div style={statCard}>
          <small style={labelStyle}>Conversions</small>
          <div style={{ ...valueStyle, color: "#10b981" }}>{userData.conversions?.length || 0}</div>
        </div>
      </div>

      {/* Tables Section */}
      <div style={cardStyle}>
        <h4 style={{ marginTop: 0 }}>Recent Conversions</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={thStyle}>Campaign</th>
                <th style={thStyle}>Payout</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {userData.conversions?.map((conv, i) => (
                <tr key={i} style={rowStyle}>
                  <td style={tdStyle}>{conv.campaign_name}</td>
                  <td style={{ ...tdStyle, color: "#059669", fontWeight: "bold" }}>${conv.payout}</td>
                  <td style={tdStyle}>{new Date(conv.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!userData.conversions || userData.conversions.length === 0) && (
            <p style={emptyStyle}>No conversions recorded for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const cardStyle = { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" };
const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" };
const buttonStyle = { padding: "10px 20px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" };
const statCard = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", textAlign: "center" };
const labelStyle = { textTransform: "uppercase", color: "#6b7280", fontWeight: "700", letterSpacing: "0.05em" };
const valueStyle = { fontSize: "32px", fontWeight: "800", marginTop: "8px", color: "#1f2937" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
const headerRowStyle = { borderBottom: "2px solid #f3f4f6", textAlign: "left" };
const thStyle = { padding: "12px", color: "#6b7280", fontSize: "12px" };
const tdStyle = { padding: "12px", fontSize: "14px", borderBottom: "1px solid #f9fafb" };
const rowStyle = { transition: "background 0.2s" };
const emptyStyle = { textAlign: "center", padding: "20px", color: "#9ca3af", fontSize: "14px" };

export default UserDetails;