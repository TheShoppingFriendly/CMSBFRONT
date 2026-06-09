import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccountingDashboard = () => {
  const navigate = useNavigate();

  const accountingModules = [
    { title: "Admin Audit Trail", path: "/dashboard/accounting/audit", icon: "📋", desc: "View all administrative actions and history." },
    { title: "Financial Overview", path: "/dashboard/accounting/financial", icon: "💰", desc: "General financial health and statements." },
    { title: "Global Ledger", path: "/dashboard/accounting/ledger", icon: "📖", desc: "Complete record of all transactions." },
    { title: "Revenue Analysis", path: "/dashboard/accounting/revenue", icon: "📈", desc: "Detailed breakdown of income and growth." },
  ];

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}>Accounting Dashboard</h2>
        <p style={{ color: "#6b7280" }}>Monitor financial metrics and access detailed audit modules.</p>
      </div>

      {/* --- STATS SECTION --- */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Total Revenue</span>
          <div style={statValueStyle}>₹5,200.00</div>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Pending Payouts</span>
          <div style={{ ...statValueStyle, color: "#e11d48" }}>₹2,400.00</div>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Audit Logs</span>
          <div style={{ ...statValueStyle, color: "#2563eb" }}>240</div>
        </div>
      </div>

      {/* --- QUICK LINKS SECTION --- */}
      <h3 style={{ marginBottom: "20px", fontSize: "16px", fontWeight: "600" }}>Module Navigation</h3>
      <div style={linksGridStyle}>
        {accountingModules.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(item.path)}
            style={moduleLinkStyle}
          >
            <div style={iconBoxStyle}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px 0", color: "#1f2937", fontSize: "15px" }}>{item.title}</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{item.desc}</p>
            </div>
            <div style={{ color: "#7c3aed", fontWeight: "bold" }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const statsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" };
const statCardStyle = { padding: "24px", backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" };
const statLabelStyle = { color: "#6b7280", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.025em" };
const statValueStyle = { fontSize: "28px", fontWeight: "700", color: "#111827", marginTop: "8px" };
const linksGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" };

const moduleLinkStyle = {
  display: "flex", alignItems: "center", gap: "16px", padding: "20px",
  backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb",
  cursor: "pointer", transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
};

const iconBoxStyle = {
  width: "48px", height: "48px", backgroundColor: "#f3f4f6", borderRadius: "10px",
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
};

export default AccountingDashboard;