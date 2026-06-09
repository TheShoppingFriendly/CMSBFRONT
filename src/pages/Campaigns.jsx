import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Campaigns = ({ activeTab }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState("list");


  const API_BASE = import.meta.env.VITE_API_BASE_URL;


  const navigate = useNavigate();

useEffect(() => {
  // Relax the guard clause
  // If activeTab is undefined or different, we still want to see our stores
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(""); 
      
      const token = localStorage.getItem("admin_token");
      if (!token) {
        setError("Unauthorized. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/stores`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Session expired.");
        throw new Error("Failed to load stores.");
      }

      const data = await res.json();
      
      // Ensure we handle both { rows: [] } or just [] structures
      const storesData = data.rows || data; 
      setStores(Array.isArray(storesData) ? storesData : []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStores();
  // We remove activeTab from the guard but keep it in dependencies if you 
  // want to refetch when switching tabs
}, [API_BASE]);

  // UI Helpers
  const getTitle = () => {
    if (activeTab === "add-campaign") return "Add New Campaign";
    if (activeTab === "all-campaigns") return "All Stores";
    return "Campaign Management";
  };

  const getDescription = () => {
    if (activeTab === "add-campaign") return "Create campaigns and assign them to stores.";
    if (activeTab === "all-campaigns") return "All synced stores available for campaign tracking.";
    return "Campaign tools are under development.";
  };

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "40px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      minHeight: "400px"
    }}>
      <h2 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 8px 0" }}>
        {getTitle()}
      </h2>

      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        {getDescription()}
      </p>

      {/* --- State Handling UI --- */}
      {loading && <p style={{ color: "#7c3aed" }}>Loading stores...</p>}
      
      {error && (
        <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#b91c1c", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* --- Store Grid --- */}
{!loading && !error && (
  <>
    {stores.length === 0 ? (
      <p style={{ textAlign: "center", color: "#6b7280", marginTop: "40px" }}>
        No stores found in the database.
      </p>
    ) : (
      <>
        {/* View Toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px", gap: "10px" }}>
            <button
            onClick={() => setViewType("list")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: viewType === "list" ? "2px solid #7c3aed" : "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            List
          </button>
          <button
            onClick={() => setViewType("grid")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: viewType === "grid" ? "2px solid #7c3aed" : "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Grid
          </button>
        
        </div>

        {/* Stores Wrapper */}
        <div
          style={
            viewType === "grid"
              ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }
              : { display: "flex", flexDirection: "column", gap: "15px" }
          }
        >
          {stores.map((store) => (
            <div
              key={store.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#fff",
                display: viewType === "list" ? "flex" : "block",
                justifyContent: "space-between",
                alignItems: viewType === "list" ? "center" : "initial"
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#111827" }}>
                  {store.name}
                </h4>
                <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
                  Slug: <code style={{ backgroundColor: "#f3f4f6", padding: "2px 4px", borderRadius: "4px" }}>
                    {store.slug}
                  </code>
                </p>
              </div>

              <button
                onClick={() => navigate(`/dashboard/campaigns/${store.slug}`)} // UPDATED PATH
                style={{
                  padding: "10px 20px",
                  marginTop: viewType === "grid" ? "16px" : "0",
                  width: viewType === "grid" ? "100%" : "auto",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#7c3aed",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                View Campaign
              </button>
            </div>
          ))}
        </div>
      </>
    )}
  </>
)}

    </div>
  );
};

export default Campaigns;