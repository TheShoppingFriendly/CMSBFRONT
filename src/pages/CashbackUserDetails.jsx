import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const CashbackUserDetails = () => {
  const { wp_user_id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    clicks: [],
    conversions: [],
    logs: [],
    wallet: {},
  });

  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserActivity();
  }, [wp_user_id]);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/users/${wp_user_id}/activity`);

      setUserData({
        clicks: res.data.clicks || [],

        conversions: (res.data.conversions || []).map((c) => ({
          ...c,
          payout_status: String(
            c.payout_status || c.status || c.conversion_status || "",
          ).toLowerCase(),
        })),

        logs: res.data.ledger || res.data.logs || [],

        wallet: res.data.wallet || {},
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversions = (userData.conversions || []).filter((c) => {
    if (!filterDate) return true;

    return new Date(c.created_at) <= new Date(filterDate);
  });

  const toggleSelect = (conv) => {
    if (["approved", "paid", "confirmed"].includes(conv.payout_status)) return;

    const exists = settlements.find((s) => s.id === conv.id);

    if (exists) {
      setSettlements(settlements.filter((s) => s.id !== conv.id));
    } else {
      setSettlements([
        ...settlements,
        {
          id: conv.id,
          amount: conv.payout || 0,
          lock_days: 0,
        },
      ]);
    }
  };

  const updateItem = (id, field, newVal) => {
    setSettlements(
      settlements.map((s) => (s.id === id ? { ...s, [field]: newVal } : s)),
    );
  };

  const handleProcessSettlement = async () => {
    if (settlements.length === 0) return;

    setUpdating(true);

    try {
      await api.patch(`/users/update-balance`, {
        wp_user_id: parseInt(wp_user_id),

        settlements: settlements.map((s) => ({
          id: s.id,
          amount: parseFloat(s.amount),
          lock_days: parseInt(s.lock_days) || 0,
        })),

        reason: reason || "Manual Settlement",
      });

      alert("Settlement Successful!");

      setSettlements([]);
      setReason("");

      fetchUserActivity();
    } catch (err) {
      alert("Error processing settlement");
    } finally {
      setUpdating(false);
    }
  };

  const totalDelta = settlements.reduce(
    (sum, s) => sum + (parseFloat(s.amount) || 0),
    0,
  );

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading User Data...
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => navigate(-1)} style={backBtnStyle}>
          ← Back
        </button>

        <h3 style={{ margin: 0 }}>Cashback & Ledger: User #{wp_user_id}</h3>
      </div>

      {/* WALLET */}

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={walletMiniCard}>
          <small>CASHBACK</small>
          <div>
            ₹{parseFloat(userData.wallet?.affiliate_balance || 0).toFixed(2)}
          </div>
        </div>

        <div style={walletMiniCard}>
          <small>REWARDS</small>
          <div>
            ₹{parseFloat(userData.wallet?.reward_cash_balance || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* SETTLEMENT PANEL */}

      <div style={settlementCard}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", fontWeight: "bold" }}>
              Reason
            </label>

            <input
              type="text"
              placeholder="Note..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>

          <button
            onClick={handleProcessSettlement}
            disabled={settlements.length === 0 || updating}
            style={{ ...btnStyle, backgroundColor: "#7c3aed" }}
          >
            {updating ? "Wait..." : `Settle ₹${totalDelta.toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* CONVERSIONS TABLE */}

      <div style={tableCard}>
        <h4 style={{ marginTop: 0 }}>Pending Conversions</h4>

        <table style={fullTable}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>Select</th>
              <th style={thStyle}>Campaign</th>
              <th style={thStyle}>Commission we got</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredConversions.length > 0 ? (
              filteredConversions.map((c) => {
                const item = settlements.find((s) => s.id === c.id);

                return (
                  <tr key={c.id} style={trStyle}>
                    <td style={tdStyle}>
                      {["approved", "paid", "confirmed"].includes(
                        c.payout_status,
                      ) ? (
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#10b981",
                          }}
                        >
                          ✓ Settled
                        </span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={!!item}
                          onChange={() => toggleSelect(c)}
                        />
                      )}
                    </td>

                    <td style={tdStyle}>{c.campaign_id}</td>

                    <td style={tdStyle}>₹{c.commission}</td>

                    <td style={tdStyle}>{c.payout_status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No Conversions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* LEDGER */}

      <div style={tableCard}>
        <h4 style={{ marginTop: 0 }}>Financial Audit Ledger</h4>

        <table style={fullTable}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>New Balance</th>
              <th style={thStyle}>Amount Changed</th>
              <th style={thStyle}>Wallet</th>
              <th style={thStyle}>Note</th>
            </tr>
          </thead>

          <tbody>
            {userData.logs.length > 0 ? (
              userData.logs.map((log, i) => (
                <tr key={i} style={trStyle}>
                  <td style={tdStyle}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </td>

                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    ₹{parseFloat(log.new_balance || 0).toFixed(2)}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      color: log.amount_changed >= 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {log.amount_changed >= 0
                      ? `+₹${log.amount_changed}`
                      : `-₹${Math.abs(log.amount_changed)}`}
                  </td>

                  <td style={tdStyle}>{log.wallet_type}</td>

                  <td style={{ ...tdStyle, fontSize: "11px" }}>
                    {log.reason || log.note}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No Ledger Entries Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// styles

const walletMiniCard = {
  background: "#fff",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  minWidth: "150px",
};

const settlementCard = {
  background: "#f5f3ff",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #ddd6fe",
};

const tableCard = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
};

const fullTable = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadStyle = {
  textAlign: "left",
  backgroundColor: "#f8fafc",
};

const thStyle = {
  padding: "10px",
  fontSize: "11px",
  color: "#64748b",
  textTransform: "uppercase",
};

const tdStyle = {
  padding: "10px",
  fontSize: "13px",
};

const trStyle = {
  borderBottom: "1px solid #f1f5f9",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
};

const btnStyle = {
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const backBtnStyle = {
  background: "none",
  border: "none",
  color: "#7c3aed",
  cursor: "pointer",
  fontWeight: "bold",
};

export default CashbackUserDetails;
