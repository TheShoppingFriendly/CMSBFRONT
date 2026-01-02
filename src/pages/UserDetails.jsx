import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const UserDetails = ({ wp_user_id, setActiveTab }) => {
  const [userData, setUserData] = useState({ clicks: [], conversions: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Advanced Settlement State
  const [settlements, setSettlements] = useState([]); // Stores objects: { id, amount, originalPayout }
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

  // Filter conversions based on the Admin's chosen date window
  const filteredConversions = userData.conversions.filter(c => {
    if (!filterDate) return true;
    return new Date(c.created_at) <= new Date(filterDate);
  });

  // Toggle selection and initialize the editable amount
  const toggleSelect = (conv) => {
    const exists = settlements.find(s => s.id === conv.id);
    if (exists) {
      setSettlements(settlements.filter(s => s.id !== conv.id));
    } else {
      // Initialize with the tracked payout amount
      setSettlements([...settlements, { 
        id: conv.id, 
        amount: conv.payout, 
        campaign: conv.campaign_id 
      }]);
    }
  };

  // Handle live editing of the payout amount (allows for Cashback/Negative values)
  const updateItemAmount = (id, newVal) => {
    setSettlements(settlements.map(s => 
      s.id === id ? { ...s, amount: newVal } : s
    ));
  };

  const handleProcessSettlement = async (e) => {
    e.preventDefault();
    if (settlements.length === 0) return alert("Please select and verify conversions.");
    
    setUpdating(true);
    try {
      await api.patch(`/users/update-balance`, {
        wp_user_id: parseInt(wp_user_id),
        settlements: settlements.map(s => ({ id: s.id, amount: parseFloat(s.amount) })),
        reason: reason || "Manual Settlement/Adjustment"
      });
      
      alert("Success! Balance updated and activity history tagged.");
      setSettlements([]);
      setReason("");
      fetchUserActivity(); 
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || "Server error"));
    } finally {
      setUpdating(false);
    }
  };

  const totalDelta = settlements.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

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
        <span style={{ color: "#6b7280" }}>Settlement Ledger for User <strong>#{wp_user_id}</strong></span>
      </div>

      {/* SECTION 1: SETTLEMENT CONTROL CENTER */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: "18px" }}>Settlement & Cashback Manager</h3>
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}>T&C Filter (Conversions older than):</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{...inputStyle, width: "100%"}} />
          </div>
          <div style={{ flex: "2 1 300px" }}>
            <label style={labelStyle}>Global Note for this action:</label>
            <input 
               type="text" placeholder="e.g. Monthly Settlement with Cashback adjustments" 
               value={reason} onChange={e => setReason(e.target.value)} 
               style={{...inputStyle, width: "100%"}} 
            />
          </div>
        </div>

        <div style={{ 
            background: totalDelta >= 0 ? "#f0f9ff" : "#fff1f2", 
            padding: "15px", borderRadius: "8px", 
            border: `1px solid ${totalDelta >= 0 ? "#bae6fd" : "#fecdd3"}`, 
            display: "flex", justifyContent: "space-between", alignItems: "center" 
        }}>
          <div>
            <span style={{ fontSize: "14px" }}>Selected: <strong>{settlements.length}</strong> items</span>
            <span style={{ marginLeft: "20px", fontSize: "14px" }}>
                Net Balance Impact: <strong style={{fontSize: "18px", color: totalDelta >= 0 ? "#0369a1" : "#e11d48"}}>
                    {totalDelta >= 0 ? `+$${totalDelta.toFixed(2)}` : `-$${Math.abs(totalDelta).toFixed(2)}`}
                </strong>
            </span>
          </div>
          <button 
             onClick={handleProcessSettlement} 
             disabled={updating || settlements.length === 0} 
             style={{ ...btnStyle, backgroundColor: settlements.length > 0 ? (totalDelta >= 0 ? "#0284c7" : "#e11d48") : "#94a3b8" }}
          >
            {updating ? "Processing..." : "Commit Settlement"}
          </button>
        </div>
      </div>

      {/* SECTION 2: CONVERSIONS (EDITABLE PAYOUTS) */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Individual Conversion Settlement</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Settle</th>
                <th style={thStyle}>Campaign</th>
                <th style={thStyle}>Commission</th>
                <th style={thStyle}>Actual to Pay</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversions.length > 0 ? (
                filteredConversions.map((c) => {
                  const item = settlements.find(s => s.id === c.id);
                  return (
                    <tr key={c.id} style={{...trStyle, backgroundColor: item ? (item.amount < 0 ? "#fff1f2" : "#f0fdf4") : "transparent"}}>
                      <td style={tdStyle}>
                        {c.payout_status === 'approved' ? (
                          <span title="Paid">✅</span>
                        ) : (
                          <input 
                            type="checkbox" 
                            checked={!!item} 
                            onChange={() => toggleSelect(c)} 
                            style={{width: "18px", height: "18px", cursor: "pointer"}}
                          />
                        )}
                      </td>
                      <td style={tdStyle}>{c.campaign_id || "N/A"}</td>
                      <td style={tdStyle}>${c.commission}</td>
                      <td style={tdStyle}>
                        {item ? (
                          <input 
                            type="number" 
                            value={item.amount} 
                            onChange={(e) => updateItemAmount(c.id, e.target.value)}
                            style={{width: "90px", padding: "4px", borderRadius: "4px", border: "1px solid #2563eb", fontWeight: "bold"}}
                          />
                        ) : (
                          <span style={{color: "#9ca3af"}}>${c.payout}</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {item ? (
                            <span style={{fontSize: "10px", fontWeight: "bold", color: item.amount < 0 ? "#e11d48" : "#16a34a"}}>
                                {item.amount < 0 ? "CASHBACK" : "PAYMENT"}
                            </span>
                        ) : "-"}
                      </td>
                      <td style={tdStyle}>{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" style={emptyStyle}>No eligible conversions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: AUDIT LEDGER */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Financial Audit Ledger (Snapshots)</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Previous Bal</th>
                <th style={thStyle}>Impact</th>
                <th style={thStyle}>Final Balance</th>
                <th style={thStyle}>Linked Activity</th>
              </tr>
            </thead>
            <tbody>
              {userData.logs?.length > 0 ? (
                userData.logs.map((log, i) => (
                  <tr key={i} style={trStyle}>
                    <td style={tdStyle}>{new Date(log.created_at).toLocaleDateString()}</td>
                    <td style={tdStyle}>${log.previous_balance}</td>
                    <td style={{ ...tdStyle, color: log.amount_changed >= 0 ? "#16a34a" : "#e11d48", fontWeight: "bold" }}>
                        {log.amount_changed >= 0 ? `+$${log.amount_changed}` : `-$${Math.abs(log.amount_changed)}`}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: "bold" }}>${log.new_balance}</td>
                    <td style={{ ...tdStyle, fontSize: "12px", color: "#64748b" }}>
                        <strong>{log.reason}</strong><br/>
                        {log.campaign_summary}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={emptyStyle}>No financial history found.</td></tr>
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
const btnStyle = { padding: "10px 24px", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tableTitleStyle = { marginTop: 0, paddingBottom: "12px", borderBottom: "1px solid #f3f4f6", marginBottom: "15px", fontSize: "16px" };
const theadStyle = { backgroundColor: "#f9fafb", textAlign: "left" };
const thStyle = { padding: "12px", fontSize: "12px", color: "#6b7280", textTransform: "uppercase" };
const tdStyle = { padding: "12px", fontSize: "14px", color: "#374151" };
const trStyle = { borderBottom: "1px solid #f3f4f6" };
const emptyStyle = { padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" };

export default UserDetails;