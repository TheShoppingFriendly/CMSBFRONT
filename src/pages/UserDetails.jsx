import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const UserDetails = ({ wp_user_id, setActiveTab }) => {
  const [userData, setUserData] = useState({ clicks: [], conversions: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Settlement State
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterDate, setFilterDate] = useState(""); 
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchUserActivity = async () => {
    if (!wp_user_id) return;
    try {
      setLoading(true);
      const res = await api.get(`/users/${wp_user_id}/activity`);
      setUserData(res.data);
    } catch (err) {
      setError(`Could not load activity: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, [wp_user_id]);

  // Filter conversions based on the Admin's chosen T&C date window
  const filteredConversions = userData.conversions.filter(c => {
    if (!filterDate) return true;
    return new Date(c.created_at) <= new Date(filterDate);
  });

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleProcessSettlement = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return alert("Please select conversions to pay.");
    
    setUpdating(true);
    try {
      await api.patch(`/users/update-balance`, {
        wp_user_id: parseInt(wp_user_id),
        conversion_ids: selectedIds,
        reason: reason || "Standard Settlement"
      });
      
      alert("Settlement Successful! Balance updated and items tagged.");
      setSelectedIds([]);
      setReason("");
      fetchUserActivity(); // Refresh to show new balance and updated logs
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || "Server error"));
    } finally {
      setUpdating(false);
    }
  };

  const totalSelectedPayout = userData.conversions
    .filter(c => selectedIds.includes(c.id))
    .reduce((sum, c) => sum + parseFloat(c.payout), 0);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading Activity...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px", maxWidth: "100%" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button 
          onClick={() => setActiveTab("users-list")}
          style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
        >
          ← Back to Users List
        </button>
        <span style={{ color: "#6b7280" }}>Managing Payouts for User <strong>#{wp_user_id}</strong></span>
      </div>

      {/* SECTION 1: SETTLEMENT CONTROL CENTER */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: "18px" }}>Process New Settlement</h3>
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}>T&C Filter (Conversions older than):</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{...inputStyle, width: "100%"}} />
          </div>
          <div style={{ flex: "2 1 300px" }}>
            <label style={labelStyle}>Settlement Note / Reference:</label>
            <input 
               type="text" placeholder="e.g. Jan Week 1 Payout" 
               value={reason} onChange={e => setReason(e.target.value)} 
               style={{...inputStyle, width: "100%"}} 
            />
          </div>
        </div>

        <div style={{ background: "#f0f9ff", padding: "15px", borderRadius: "8px", border: "1px solid #bae6fd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "14px", color: "#0369a1" }}>Selected Items: <strong>{selectedIds.length}</strong></span>
            <span style={{ marginLeft: "20px", fontSize: "14px", color: "#0369a1" }}>Total Settlement: <strong style={{fontSize: "18px"}}>${totalSelectedPayout.toFixed(2)}</strong></span>
          </div>
          <button 
             onClick={handleProcessSettlement} 
             disabled={updating || selectedIds.length === 0} 
             style={{ ...btnStyle, backgroundColor: selectedIds.length > 0 ? "#0284c7" : "#94a3b8" }}
          >
            {updating ? "Processing..." : "Approve & Update Balance"}
          </button>
        </div>
      </div>

      {/* SECTION 2: CONVERSIONS TABLE (WITH CHECKBOXES) */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Conversions & Payout Status</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Settle</th>
                <th style={thStyle}>Campaign ID</th>
                <th style={thStyle}>Payout</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Settlement</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversions.length > 0 ? (
                filteredConversions.map((c) => (
                  <tr key={c.id} style={trStyle}>
                    <td style={tdStyle}>
                      {c.payout_status === 'approved' ? (
                        <span title="Already Paid">✅</span>
                      ) : (
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(c.id)} 
                          onChange={() => toggleSelect(c.id)} 
                          style={{width: "18px", height: "18px"}}
                        />
                      )}
                    </td>
                    <td style={tdStyle}>{c.campaign_id || "N/A"}</td>
                    <td style={{ ...tdStyle, color: "#059669", fontWeight: "bold" }}>${c.payout}</td>
                    <td style={tdStyle}><span style={statusBadge(c.status)}>{c.status}</span></td>
                    <td style={tdStyle}>
                        <span style={{...statusBadge(c.payout_status), backgroundColor: c.payout_status === 'approved' ? '#dcfce7' : '#f1f5f9'}}>
                            {c.payout_status}
                        </span>
                    </td>
                    <td style={tdStyle}>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={emptyStyle}>No conversions found for this date range.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: AUDIT LEDGER (BEFORE/AFTER SNAPSHOTS) */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Financial Audit Ledger</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Previous Bal</th>
                <th style={thStyle}>Amount Added</th>
                <th style={thStyle}>New Balance</th>
                <th style={thStyle}>Details / Reason</th>
              </tr>
            </thead>
            <tbody>
              {userData.logs?.length > 0 ? (
                userData.logs.map((log, i) => (
                  <tr key={i} style={trStyle}>
                    <td style={tdStyle}>{new Date(log.created_at).toLocaleDateString()}</td>
                    <td style={tdStyle}>${log.previous_balance}</td>
                    <td style={{ ...tdStyle, color: "#16a34a", fontWeight: "bold" }}>+${log.amount_changed}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold" }}>${log.new_balance}</td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#64748b" }}>
                        <strong>{log.reason}</strong><br/>
                        {log.campaign_summary}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={emptyStyle}>No balance history found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- STYLES (Kept consistent with your UI) ---
const cardStyle = { backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" };
const labelStyle = { display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "#4b5563" };
const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" };
const btnStyle = { padding: "10px 24px", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tableTitleStyle = { marginTop: 0, paddingBottom: "12px", borderBottom: "1px solid #f3f4f6", marginBottom: "15px", fontSize: "16px" };
const theadStyle = { backgroundColor: "#f9fafb", textAlign: "left" };
const thStyle = { padding: "12px", fontSize: "12px", color: "#6b7280", textTransform: "uppercase" };
const tdStyle = { padding: "12px", fontSize: "14px", color: "#374151" };
const trStyle = { borderBottom: "1px solid #f3f4f6" };
const emptyStyle = { padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" };

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