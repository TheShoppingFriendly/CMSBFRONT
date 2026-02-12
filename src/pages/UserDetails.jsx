import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const UserDetails = ({ wp_user_id, setActiveTab }) => {
  const [userData, setUserData] = useState({ clicks: [], conversions: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Advanced Settlement State
  const [settlements, setSettlements] = useState([]); // Stores objects: { id, amount, lock_days }
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

  // Toggle selection and initialize the editable amount + lock days
  const toggleSelect = (conv) => {
    const exists = settlements.find(s => s.id === conv.id);
    if (exists) {
      setSettlements(settlements.filter(s => s.id !== conv.id));
    } else {
      // Initialize with tracked payout and 0 lock days
      setSettlements([...settlements, { 
        id: conv.id, 
        amount: conv.payout, 
        lock_days: 0,
        campaign: conv.campaign_id 
      }]);
    }
  };

  // Update specific fields (amount or lock_days) for a selected item
  const updateItem = (id, field, newVal) => {
    setSettlements(settlements.map(s => 
      s.id === id ? { ...s, [field]: newVal } : s
    ));
  };

  const handleProcessSettlement = async (e) => {
    e.preventDefault();
    if (settlements.length === 0) return alert("Please select and verify conversions.");
    
    setUpdating(true);
    try {
      await api.patch(`/users/update-balance`, {
        wp_user_id: parseInt(wp_user_id),
        settlements: settlements.map(s => ({ 
            id: s.id, 
            amount: parseFloat(s.amount),
            lock_days: parseInt(s.lock_days) || 0 
        })),
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

  const handleRevertTransaction = async (logId) => {
    if (!window.confirm("Are you sure you want to revert this transaction? This will adjust the user's balance and unlock the linked conversions.")) return;
    
    try {
      await api.post(`/users/revert-settlement`, { log_id: logId });
      alert("Transaction Reverted Successfully");
      fetchUserActivity();
    } catch (err) {
      alert("Reversal failed: " + (err.response?.data?.error || err.message));
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
            <label style={labelStyle}>T&C Filter (Older than):</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{...inputStyle, width: "100%"}} />
          </div>
          <div style={{ flex: "2 1 300px" }}>
            <label style={labelStyle}>Global Note:</label>
            <input 
               type="text" placeholder="Reason for this action..." 
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
                Net Impact: <strong style={{fontSize: "18px", color: totalDelta >= 0 ? "#0369a1" : "#e11d48"}}>
                    {totalDelta >= 0 ? `+${totalDelta.toFixed(2)}` : `-${Math.abs(totalDelta).toFixed(2)}`}
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

      {/* SECTION 2: CONVERSIONS TABLE */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Individual Conversion Settlement</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Settle</th>
                <th style={thStyle}>Campaign</th>
                <th style={thStyle}>Commission</th>
                <th style={thStyle}>Actual Pay</th>
                <th style={thStyle}>Lock (Days)</th>
                <th style={thStyle}>Status</th>
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
                          <span title="Settled">✅</span>
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
                      <td style={tdStyle}>{c.commission}</td>
                      <td style={tdStyle}>
                        {item ? (
                          <input 
                            type="number" 
                            value={item.amount} 
                            onChange={(e) => updateItem(c.id, 'amount', e.target.value)}
                            style={tableInputStyle}
                          />
                        ) : (
                          <span style={{color: "#9ca3af"}}>{c.actual_paid_amount ? `${c.actual_paid_amount}` : `${c.commission}`}</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {item ? (
                          <input 
                            type="number" 
                            placeholder="0"
                            value={item.lock_days} 
                            onChange={(e) => updateItem(c.id, 'lock_days', e.target.value)}
                            style={tableInputStyle}
                          />
                        ) : (
                          <span style={{fontSize: "12px", color: "#6b7280"}}>
                            {c.release_date ? new Date(c.release_date).toLocaleDateString() : "-"}
                          </span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{...statusBadge, backgroundColor: c.payout_status === 'approved' ? '#dcfce7' : '#f3f4f6', color: c.payout_status === 'approved' ? '#166534' : '#6b7280'}}>
                            {c.payout_status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" style={emptyStyle}>No conversions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: AUDIT LEDGER WITH REVERT */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Financial Audit Ledger</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Balance Change</th>
                <th style={thStyle}>New Balance</th>
                <th style={thStyle}>Note</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.logs?.length > 0 ? (
                userData.logs.map((log, i) => (
                  <tr key={i} style={trStyle}>
                    <td style={tdStyle}>{new Date(log.created_at).toLocaleDateString()}</td>
                    <td style={{ ...tdStyle, color: log.amount_changed >= 0 ? "#16a34a" : "#e11d48", fontWeight: "bold" }}>
                        {log.amount_changed >= 0 ? `+${log.amount_changed}` : `-${Math.abs(log.amount_changed)}`}
                    </td>
                    <td style={{ ...tdStyle }}>INR {log.new_balance}</td>
                    <td style={{ ...tdStyle, fontSize: "12px" }}>{log.reason}</td>
                    <td style={tdStyle}>
                        {log.status !== 'reverted' ? (
                             <button 
                                onClick={() => handleRevertTransaction(log.id)}
                                style={revertBtnStyle}
                             >
                                Revert
                             </button>
                        ) : (
                            <span style={{color: "#9ca3af", fontSize: "12px", fontStyle: "italic"}}>Reverted</span>
                        )}
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
const tableInputStyle = { width: "80px", padding: "4px", borderRadius: "4px", border: "1px solid #2563eb", fontWeight: "bold" };
const btnStyle = { padding: "10px 24px", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const revertBtnStyle = { padding: "4px 10px", backgroundColor: "#fff", color: "#e11d48", border: "1px solid #e11d48", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tableTitleStyle = { marginTop: 0, paddingBottom: "12px", borderBottom: "1px solid #f3f4f6", marginBottom: "15px", fontSize: "16px" };
const theadStyle = { backgroundColor: "#f9fafb", textAlign: "left" };
const thStyle = { padding: "12px", fontSize: "12px", color: "#6b7280", textTransform: "uppercase" };
const tdStyle = { padding: "12px", fontSize: "14px", color: "#374151" };
const trStyle = { borderBottom: "1px solid #f3f4f6" };
const emptyStyle = { padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" };
const statusBadge = { padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" };

export default UserDetails;