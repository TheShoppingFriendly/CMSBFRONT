import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar"; // Adjust path as needed

const StoreCampaign = () => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [conversions, setConversions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stats for Sidebar (optional, or pass 0 if not needed here)
  const [clicksCount, setClicksCount] = useState(0);
  const [conversionsCount, setConversionsCount] = useState(0);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("admin_token");
        if (!token) {
          setError("Unauthorized. Please login again.");
          return;
        }

        const res = await fetch(
          `${API_BASE}/stores/${storeSlug}/campaign`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) throw new Error("Session expired");
          if (res.status === 404) throw new Error("Store not found");
          throw new Error("Failed to load campaign data");
        }

        const data = await res.json();

        setStore(data.store);
        setConversions(data.conversions || []);
        setTotalRevenue(data.totalRevenue || 0);
        // If your API returns total counts for the sidebar badges:
        setConversionsCount(data.conversions?.length || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [storeSlug, API_BASE]);

  const renderContent = () => {
    if (loading) return <p>Loading campaign...</p>;

    if (error) {
      return (
        <div>
          <p style={{ color: "red" }}>{error}</p>
          <button onClick={() => navigate("/campaigns")}>Back</button>
        </div>
      );
    }

    return (
      <div style={{ background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700 }}>
          {store?.name} Campaign
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Slug: <code>{store?.slug}</code>
        </p>

        <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "12px", marginBottom: "32px", border: "1px solid #e5e7eb" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#6b7280" }}>Total Revenue</h4>
          <p style={{ fontSize: "26px", fontWeight: 700, margin: 0 }}>
            ₹{totalRevenue.toFixed(2)}
          </p>
        </div>

        <h3 style={{ marginBottom: "12px" }}>Conversions</h3>
        {conversions.length === 0 ? (
          <p>No conversions yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={th}>Click ID</th>
                  <th style={th}>Sale Amount</th>
                  <th style={th}>Commission</th>
                  <th style={th}>Status</th>
                  <th style={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((c) => (
                  <tr key={c.id}>
                    <td style={td}>{c.clickid}</td>
                    <td style={td}>₹{c.payout}</td>
                    <td style={td}>₹{c.commission}</td>
                    <td style={td}>
                        <span style={{ 
                            padding: "4px 8px", 
                            borderRadius: "4px", 
                            fontSize: "12px", 
                            fontWeight: "bold",
                            backgroundColor: c.status === "approved" ? "#d4edda" : "#fff3cd",
                            color: c.status === "approved" ? "#155724" : "#856404"
                        }}>
                            {c.status}
                        </span>
                    </td>
                    <td style={td}>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Sidebar Integration */}
      <Sidebar 
        activeTab="campaigns" // Keeps the campaigns menu highlighted
        setActiveTab={(tab) => navigate(`/dashboard`)} // Redirect back to dashboard if they click a main tab
        clicksCount={clicksCount}
        conversionsCount={conversionsCount}
      />

      <main className="main-content" style={{ flex: 1, transition: "margin-left 0.3s ease", minHeight: "100vh" }}>
        <header style={{
          backgroundColor: "white", padding: "20px 32px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #e5e7eb"
        }}>
          <h1 style={{ margin: 0, fontSize: "26px", color: "#1f2937", fontWeight: "700" }}>
            Store Details
          </h1>
        </header>

        <div style={{ padding: "32px" }}>
          {renderContent()}
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .main-content { margin-left: 240px !important; }
        }
        @media (max-width: 767px) {
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
};

const th = { padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#374151", fontWeight: "600" };
const td = { padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#4b5563" };

export default StoreCampaign;