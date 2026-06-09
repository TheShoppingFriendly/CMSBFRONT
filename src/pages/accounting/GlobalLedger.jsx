import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from "react-router-dom";

const GlobalLedger = () => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [view, setView] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/admin/accounting/report').then(res => setLogs(res.data.logs));
    }, []);

    const filtered = logs.filter(l => {
        const matchesSearch =
            l.note?.toLowerCase().includes(search.toLowerCase()) ||
            l.user_name?.toLowerCase().includes(search.toLowerCase());

        const matchesView =
            view === "all"
                ? true
                : view === "in"
                ? l.credit > 0
                : l.debit > 0;

        return matchesSearch && matchesView;
    });
    
   
    const downloadCSV = () => {
        const headers = ["Date", "User/Store", "Amount", "Reason"];

        const rows = filtered.map(l => [
            new Date(l.created_at).toLocaleDateString(),
            l.user_name || l.store_name || "System",
            l.credit > 0 ? `+${l.credit}` : `-${l.debit}`,
            l.note || ""
        ]);

        const csvContent =
            [headers, ...rows]
                .map(e => e.join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ledger-report.csv";
        a.click();
    };

    return (
        <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>
            
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <button 
                    onClick={() => navigate("/dashboard/cashbacks/accounting")}
                    style={btnSecondary}
                >
                    ← Back
                </button>

                <button onClick={downloadCSV} style={btnPrimary}>
                    Download CSV
                </button>
            </div>

            {/* FILTER BAR */}
            <div style={card}>
                <input
                    placeholder="Search user or note..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={input}
                />

                <select value={view} onChange={(e) => setView(e.target.value)} style={input}>
                    <option value="all">All</option>
                    <option value="in">Money In</option>
                    <option value="out">Money Out</option>
                </select>
            </div>

            {/* TABLE */}
            <div style={card}>
                <h3 style={{ marginBottom: "15px" }}>Activity Log</h3>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #eee", color: "#666" }}>
                            <th style={th}>Date</th>
                            <th style={th}>User / Store</th>
                            <th style={th}>Amount</th>
                            <th style={th}>Reason</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map(l => (
                            <tr key={l.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                                <td style={td}>
                                    {new Date(l.created_at).toLocaleDateString()}
                                </td>

                                <td style={td}>
                                    {l.wp_user_id ? (
                                        <Link
                                            to={`/dashboard/cashbacks/users/${l.wp_user_id}`}
                                            style={linkStyle}
                                        >
                                            {l.user_name || `User ${l.wp_user_id}`}
                                        </Link>
                                    ) : (
                                        l.store_name || "System"
                                    )}
                                </td>

                                <td style={{
                                    ...td,
                                    color: l.credit > 0 ? "#16a34a" : "#dc2626",
                                    fontWeight: 600
                                }}>
                                    {l.credit > 0 ? `+ ₹${l.credit}` : `- ₹${l.debit}`}
                                </td>

                                <td style={{ ...td, color: "#555" }}>
                                    {l.note}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* 🔥 STYLES */

const card = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap"
};

const input = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minWidth: "200px"
};

const th = {
    textAlign: "left",
    padding: "12px",
    fontSize: "13px"
};

const td = {
    padding: "14px",
    fontSize: "14px"
};

const linkStyle = {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 500
};

const btnPrimary = {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer"
};

const btnSecondary = {
    background: "#e5e7eb",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer"
};

export default GlobalLedger;