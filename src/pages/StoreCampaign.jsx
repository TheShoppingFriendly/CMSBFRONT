import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StoreCampaign = () => {
  const { storeSlug } = useParams();
  const navigate = useNavigate();

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [storeSlug, API_BASE]);

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
    <div style={{ background: "#fff", padding: "40px", borderRadius: "12px" }}>
      {/* Store Header */}
      <h2 style={{ fontSize: "28px", fontWeight: 700 }}>
        {store.name} Campaign
      </h2>

      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Slug: <code>{store.slug}</code>
      </p>

      {/* Revenue Card */}
      <div
        style={{
          padding: "20px",
          background: "#f9fafb",
          borderRadius: "12px",
          marginBottom: "32px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h4>Total Revenue</h4>
        <p style={{ fontSize: "26px", fontWeight: 700 }}>
          ₹{totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* Conversions Table */}
      <h3 style={{ marginBottom: "12px" }}>Conversions</h3>

      {conversions.length === 0 ? (
        <p>No conversions yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
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
                <td style={td}>{c.status}</td>
                <td style={td}>
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
};

export default StoreCampaign;
