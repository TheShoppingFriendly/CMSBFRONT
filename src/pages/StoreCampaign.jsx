import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

const StoreCampaign = () => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

  // Get setters from Dashboard context to update the Sidebar badges globally
  const { setClicksCount, setConversionsCount, clicksCount, conversionsCount } = useOutletContext();
  
  const [store, setStore] = useState(null);
  const [conversions, setConversions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        const res = await fetch(`${API_BASE}/stores/${storeSlug}/campaign`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error("Session expired");
          if (res.status === 404) throw new Error("Store not found");
          throw new Error("Failed to load campaign data");
        }

        const data = await res.json();

        setStore(data.store);
        setConversions(data.conversions || []);
        setTotalRevenue(data.totalRevenue || 0);
        
        // Update the Sidebar badges via the provided context
        if (setConversionsCount) {
            setConversionsCount(data.conversions?.length || 0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [storeSlug, API_BASE, setConversionsCount]);

  if (loading) return <div style={{ padding: "40px" }}>Loading campaign...</div>;

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button 
            onClick={() => navigate("/dashboard/campaigns")}
            style={{ padding: "8px 16px", cursor: "pointer" }}
        >
            ← Back to Campaigns
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate("/dashboard/campaigns")}
        style={{ marginBottom: "20px", background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontWeight: "600" }}
      >
        ← Back to Stores
      </button>

      <div style={{ background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
    <div style={{ marginBottom: "30px" }}>
  {/* Store Header */}
  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
    
    {/* Store Image */}
    {store?.image && (
      <img
        src={store.image}
        alt={store.name}
        style={{
          width: "60px",
          height: "60px",
          objectFit: "contain",
          borderRadius: "8px",
          border: "1px solid #eee"
        }}
      />
    )}

    {/* Store Name + Slug */}
    <div>
      <h2 style={{ fontSize: "28px", fontWeight: 700, margin: 0 }}>
        {store?.name}
      </h2>

      <p style={{ color: "#6b7280", margin: 0 }}>
        <code>{store?.slug}</code>
      </p>
    </div>
  </div>

  {/* About Section */}
  {store?.about && (
    <p style={{ marginTop: "16px", color: "#374151" }}>
      {store.about}
    </p>
  )}

  {/* Visit Store Button */}
  {store?.store_link && (
    <a
      href={store.store_link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        marginTop: "16px",
        padding: "10px 16px",
        background: "#111827",
        color: "#fff",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: 500
      }}
    >
      Visit Store →
    </a>
  )}

  {/* Additional Info (HTML Content) */}
  {/* {store?.additional_info && (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        background: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #eee"
      }}
      dangerouslySetInnerHTML={{ __html: store.additional_info }}
    />
  )} */}
</div>

        {/* Revenue Card */}
        <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "12px", marginBottom: "32px", border: "1px solid #e5e7eb" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#6b7280" }}>Total Revenue</h4>
          <p style={{ fontSize: "26px", fontWeight: 700, margin: 0 }}>
            ₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <h3 style={{ marginBottom: "12px" }}>Conversions</h3>
        {conversions.length === 0 ? (
          <p>No conversions recorded for this store.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={th}>Click ID (TGB Source)</th>
                  <th style={th}>Sale Amount</th>
<<<<<<< HEAD
                  <th style={th}>Revenue</th>
                  <th style={th}>Status (Trackier, etc)</th>
=======
                  <th style={th}>Commission</th>
                  <th style={th}>Status</th>
>>>>>>> parent of f9d8284 (UI and table update)
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
    </div>
  );
};

const th = { padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#374151", fontWeight: "600" };
const td = { padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#4b5563" };

export default StoreCampaign;