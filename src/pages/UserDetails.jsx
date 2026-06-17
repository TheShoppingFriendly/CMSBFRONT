import React, { useState, useEffect } from 'react';
import api from "../api/axios";
import { useParams, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const { wp_user_id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    wallet: {},
    ledger: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/users/${wp_user_id}/activity`);

        console.log("API RESPONSE:", res.data);

        setData({
          wallet: res.data.wallet || {},
          ledger: res.data.logs || res.data.ledger || [],
        });

      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [wp_user_id]);

  if (loading) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        Loading Audit Logs...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px", padding: "20px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>
        <h2 style={{ margin: 0, fontSize: "20px" }}>
          Financial Audit: User #{wp_user_id}
        </h2>
      </div>

      {/* WALLET */}
      <div style={walletGrid}>
        <div style={walletCard}>
          <span style={labelStyle}>Affiliate (Cashback)</span>
          <h3>₹{Number(data.wallet?.affiliate_balance || 0).toFixed(2)}</h3>
        </div>

        <div style={walletCard}>
          <span style={labelStyle}>Rewards</span>
          <h3>₹{Number(data.wallet?.reward_cash_balance || 0).toFixed(2)}</h3>
        </div>

        <div style={walletCard}>
          <span style={labelStyle}>Referral</span>
          <h3>₹{Number(data.wallet?.referral_balance || 0).toFixed(2)}</h3>
        </div>
      </div>

      {/* LEDGER */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>
          Balance Logs History
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadStyle}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Wallet Balance</th>
                <th style={thStyle}>Cashback</th>
                <th style={thStyle}>Reward</th>
                <th style={thStyle}>Referral</th>
                <th style={thStyle}>Withdrawn</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Note</th>
              </tr>
            </thead>

            <tbody>
              {(data.ledger || []).length > 0 ? (
                (data.ledger || []).map((log, i) => {
                  const amount = Number(log?.amount_changed || 0);
                  const isEarning = amount > 0;
                  const wallet = log?.wallet_type || "affiliate";

                  return (
                    <tr key={i} style={trStyle}>
                      
                      {/* DATE */}
                      <td style={tdStyle}>
                        {log?.created_at
                          ? new Date(log.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* BALANCE */}
                      <td style={{ ...tdStyle, fontWeight: "700" }}>
                        ₹{Number(log?.new_balance || 0).toFixed(2)}
                      </td>

                      {/* CASHBACK */}
                      <td style={{ ...tdStyle, color: "#16a34a" }}>
                        {wallet === "affiliate" && isEarning
                          ? `+₹${amount}`
                          : "-"}
                      </td>

                      {/* REWARD */}
                      <td style={{ ...tdStyle, color: "#2563eb" }}>
                        {wallet === "reward" && isEarning
                          ? `+₹${amount}`
                          : "-"}
                      </td>

                      {/* REFERRAL */}
                      <td style={{ ...tdStyle, color: "#7c3aed" }}>
                        {wallet === "referral" && isEarning
                          ? `+₹${amount}`
                          : "-"}
                      </td>

                      {/* WITHDRAW */}
                      <td style={{ ...tdStyle, color: "#e11d48" }}>
                        {!isEarning
                          ? `₹${Math.abs(amount)}`
                          : "-"}
                      </td>

                      {/* STATUS */}
                      <td style={tdStyle}>
                        <span
                          style={{
                            ...statusBadge,
                            backgroundColor:
                              log?.status === "active"
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              log?.status === "active"
                                ? "#166534"
                                : "#991b1b",
                          }}
                        >
                          {(log?.status || "success").toUpperCase()}
                        </span>
                      </td>

                      {/* NOTE */}
                      <td style={{ ...tdStyle, fontSize: "11px", color: "#64748b" }}>
                        {log?.reason || log?.campaign_summary || "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: "30px", textAlign: "center" }}>
                    No logs found in balance_logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// STYLES (same as yours)

const cardStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" };
const walletGrid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" };
const walletCard = { backgroundColor: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #e5e7eb", textAlign: "center" };
const labelStyle = { fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const theadStyle = { backgroundColor: "#f9fafb", textAlign: "left" };
const thStyle = { padding: "12px 10px", fontSize: "11px", color: "#6b7280", borderBottom: "2px solid #f3f4f6" };
const tdStyle = { padding: "12px 10px", fontSize: "13px", borderBottom: "1px solid #f3f4f6" };
const trStyle = { borderBottom: "1px solid #f3f4f6" };
const statusBadge = { padding: "3px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold" };
const backBtn = { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "600" };

export default UserDetails;