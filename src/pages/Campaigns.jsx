import { useEffect, useState } from "react";

const Campaigns = ({ activeTab }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (activeTab !== "all-campaigns") return;

    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        if (!token) {
          setError("Unauthorized. Please login again.");
          return;
        }

        const res = await fetch(`${API_BASE}/stores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load stores");
        }

        const data = await res.json();
        setStores(data.stores || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [activeTab]);

  // ---------------- UI helpers ----------------

  const getTitle = () => {
    if (activeTab === "add-campaign") return "Add New Campaign";
    if (activeTab === "all-campaigns") return "All Stores";
    return "Campaign Management";
  };

  const getDescription = () => {
    if (activeTab === "add-campaign") {
      return "Create campaigns and assign them to stores.";
    }
    if (activeTab === "all-campaigns") {
      return "All synced stores available for campaign tracking.";
    }
    return "Campaign tools are under development.";
  };

  // ---------------- UI ----------------

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "40px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <h2 style={{ fontSize: "28px", fontWeight: 700 }}>
        {getTitle()}
      </h2>

      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        {getDescription()}
      </p>

      {loading && <p>Loading stores…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {activeTab === "all-campaigns" && !loading && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px"
        }}>
          {stores.map((store) => (
            <div
              key={store.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "16px",
                backgroundColor: "#fafafa"
              }}
            >
              <h4 style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 600
              }}>
                {store.name}
              </h4>

              <p style={{
                fontSize: "13px",
                color: "#6b7280",
                marginTop: "6px"
              }}>
                Slug: {store.slug}
              </p>

              <button
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#7c3aed",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Create Campaign
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
