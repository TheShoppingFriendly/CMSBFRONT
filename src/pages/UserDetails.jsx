import React, { useState, useEffect } from 'react';
import api from "../api/axios";

const UserDetails = ({ wp_user_id, setActiveTab }) => {
  const [userData, setUserData] = useState({ clicks: [], conversions: [], logs: [], balances: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Advanced Settlement State
  const [settlements, setSettlements] = useState([]); 
  const [filterDate, setFilterDate] = useState(""); 
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);
  const [targetWallet, setTargetWallet] = useState("affiliate"); // NEW: Specify which wallet to settle

  const fetchUserActivity = async () => {
    if (!wp_user_id) return;
    try {
      setLoading(true);
      // Fetch stats (for wallets) and activity (for logs/conversions)
      const [activityRes, statsRes] = await Promise.all([
        api.get(`/users/${wp_user_id}/activity`),
        api.get(`/users/stats/${wp_user_id}`)
      ]);
      
      setUserData({
        ...activityRes.data,
        balances: statsRes.data.balances || {}
      });
    } catch (err) {
      setError(`Could not load activity: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, [wp_user_id]);

  const filteredConversions = userData.conversions.filter(c => {
    if (!filterDate) return true;
    return new Date(c.created_at) <= new Date(filterDate);
  });

  const toggleSelect = (conv) => {
    const exists = settlements.find(s => s.id === conv.id);
    if (exists) {
      setSettlements(settlements.filter(s => s.id !== conv.id));
    } else {
      setSettlements([...settlements, { 
        id: conv.id, 
        amount: conv.payout, 
        lock_days: 0,
        campaign: conv.campaign_id 
      }]);
    }
  };

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
        wallet_type: targetWallet, // NEW: Pass the target wallet
        settlements: settlements.map(s => ({ 
            id: s.id, 
            amount: parseFloat(s.amount),
            lock_days: parseInt(s.lock_days) || 0 
        })),
        reason: reason || "Manual Settlement/Adjustment"
      });
      
      alert("Success! Balance updated.");
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
    if (!window.confirm("Are you sure you want to revert this?")) return;
    try {
      await api.post(`/users/revert-settlement`, { log_id: logId });
      alert("Transaction Reverted");
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

      {/* NEW: SECTION 0: WALLET SUMMARY CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
        <div style={{ ...cardStyle, borderLeft: "5px solid #3b82f6" }}>
          <span style={walletLabelStyle}>Affiliate Wallet</span>
          <div style={walletAmountStyle}>₹{userData.balances.affiliate?.toFixed(2)}</div>
          <span style={pendingLabelStyle}>Pending: ₹{userData.balances.affiliate_pending || '0.00'}</span>
        </div>
        <div style={{ ...cardStyle, borderLeft: "5px solid #10b981" }}>
          <span style={walletLabelStyle}>Referral Wallet (Friends)</span>
          <div style={walletAmountStyle}>₹{userData.balances.referral?.toFixed(2)}</div>
          <span style={pendingLabelStyle}>Pending: ₹{userData.balances.referral_pending || '0.00'}</span>
        </div>
        <div style={{ ...cardStyle, borderLeft: "5px solid #f59e0b" }}>
          <span style={walletLabelStyle}>Reward Cash & Points</span>
          <div style={walletAmountStyle}>₹{userData.balances.reward_cash?.toFixed(2)}</div>
          <span style={pendingLabelStyle}>{userData.balances.points || 0} Points Pending</span>
        </div>
      </div>

      {/* SECTION 1: SETTLEMENT CONTROL CENTER */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: "18px" }}>Settlement & Cashback Manager</h3>
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 150px" }}>
            <label style={labelStyle}>Target Wallet:</label>
            <select 
              value={targetWallet} 
              onChange={e => setTargetWallet(e.target.value)} 
              style={{...inputStyle, width: "100%"}}
            >
              <option value="affiliate">Affiliate Wallet</option>
              <option value="referral">Referral Wallet</option>
              <option value="reward">Reward Wallet</option>
            </select>
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <label style={labelStyle}>T&C Filter (Older than):</label>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{...inputStyle, width: "100%"}} />
          </div>
          <div style={{ flex: "2 1 250px" }}>
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
                Net Impact on <strong>{targetWallet.toUpperCase()}</strong>: <strong style={{fontSize: "18px", color: totalDelta >= 0 ? "#0369a1" : "#e11d48"}}>
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
    <th style={thStyle}>Select</th>
    <th style={thStyle}>Offer/Campaign</th>
    <th style={thStyle}>Expected Earning</th>
    <th style={thStyle}>Final Payout</th>
    <th style={thStyle}>Hold (Days)</th>
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

          {/* FIX: Campaign ID / ClickID Fallback */}
          <td style={tdStyle}>
            <div style={{fontWeight: "600"}}>{c.campaign_id || "Direct"}</div>
            <div style={{fontSize: "10px", color: "#9ca3af"}}>{c.clickid || "No Trace"}</div>
          </td>

          {/* FIX: Commission / Payout Fallback */}
          <td style={tdStyle}>
            ₹{parseFloat(c.commission || c.payout || 0).toFixed(2)}
          </td>

          <td style={tdStyle}>
            {item ? (
              <input 
                type="number" 
                value={item.amount} 
                onChange={(e) => updateItem(c.id, 'amount', e.target.value)}
                style={tableInputStyle}
              />
            ) : (
              <span style={{color: "#374151", fontWeight: "500"}}>
                {/* FIX: Removed 'undefined' from UI */}
                ₹{parseFloat(c.actual_paid_amount || c.commission || c.payout || 0).toFixed(2)}
              </span>
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
                {c.release_date ? new Date(c.release_date).toLocaleDateString() : "Instant"}
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

      {/* SECTION 3: AUDIT LEDGER WITH WALLET TYPE */}
      <div style={cardStyle}>
        <h3 style={tableTitleStyle}>Financial Audit Ledger</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Wallet</th>
                <th style={thStyle}>Change</th>
                <th style={thStyle}>New Bal</th>
                <th style={thStyle}>Note</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.logs?.length > 0 ? (
                userData.logs.map((log, i) => (
                  <tr key={i} style={trStyle}>
                    <td style={tdStyle}>{new Date(log.created_at).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 5px', borderRadius: '4px', background: '#f3f4f6', color: '#4b5563'}}>
                            {log.wallet_type?.toUpperCase()}
                        </span>
                    </td>
                    <td style={{ ...tdStyle, color: log.amount_changed >= 0 ? "#16a34a" : "#e11d48", fontWeight: "bold" }}>
                        {log.amount_changed >= 0 ? `+${log.amount_changed}` : `-${Math.abs(log.amount_changed)}`}
                    </td>
                    <td style={{ ...tdStyle }}>{log.new_balance}</td>
                    <td style={{ ...tdStyle, fontSize: "11px", maxWidth: '200px' }}>{log.reason}</td>
                    <td style={tdStyle}>
                        {log.status !== 'reverted' ? (
                             <button onClick={() => handleRevertTransaction(log.id)} style={revertBtnStyle}>Revert</button>
                        ) : (
                            <span style={{color: "#9ca3af", fontSize: "12px", fontStyle: "italic"}}>Reverted</span>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={emptyStyle}>No financial history found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const cardStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" };
const walletLabelStyle = { fontSize: "12px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase" };
const walletAmountStyle = { fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "5px 0" };
const pendingLabelStyle = { fontSize: "13px", color: "#2563eb", fontWeight: "500" };
const labelStyle = { display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "#4b5563" };
const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" };
const tableInputStyle = { width: "80px", padding: "4px", borderRadius: "4px", border: "1px solid #2563eb", fontWeight: "bold" };
const btnStyle = { padding: "10px 24px", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };
const revertBtnStyle = { padding: "4px 10px", backgroundColor: "#fff", color: "#e11d48", border: "1px solid #e11d48", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "600" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const tableTitleStyle = { marginTop: 0, paddingBottom: "12px", borderBottom: "1px solid #f3f4f6", marginBottom: "15px", fontSize: "16px" };
const theadStyle = { backgroundColor: "#f9fafb", textAlign: "left" };
const thStyle = { padding: "12px", fontSize: "11px", color: "#6b7280", textTransform: "uppercase" };
const tdStyle = { padding: "12px", fontSize: "13px", color: "#374151" };
const trStyle = { borderBottom: "1px solid #f3f4f6" };
const emptyStyle = { padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "14px" };
const statusBadge = { padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" };

export default UserDetails;