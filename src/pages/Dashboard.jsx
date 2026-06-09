import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import api from "../api/axios";

const Dashboard = () => {
  const location = useLocation();

  const [clicksCount, setClicksCount] = useState(0);
  const [conversionsCount, setConversionsCount] = useState(0);
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("users-list");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      fetchDashboardData();
    }
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clicksRes, conversionsRes] = await Promise.all([
        api.get("/admin/clicks"),
        api.get("/admin/conversions"),
      ]);
      setClicks(clicksRes.data);
      setConversions(conversionsRes.data);
      setClicksCount(clicksRes.data.length);
      setConversionsCount(conversionsRes.data.length);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const conversionRate =
    clicksCount > 0
      ? ((conversionsCount / clicksCount) * 100).toFixed(2)
      : 0;

  const recentClicks = clicks.slice(0, 5);
  const recentConversions = conversions.slice(0, 5);

  const isHome = location.pathname === "/dashboard";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        overflowX: "hidden",
      }}
    >
      <Sidebar
        clicksCount={clicksCount}
        conversionsCount={conversionsCount}
      />

      <main
        className="main-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflowY: "visible",
          width: "75%",
          marginLeft:"240px"
        }}
      >
        <header
          style={{
            backgroundColor: "white",
            padding: "20px 32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              color: "#1f2937",
              fontWeight: "700",
            }}
          >
            {getPageTitle(location.pathname)}
          </h1>
        </header>

        <div
          style={{
            padding: "32px",
            flex: 1,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {isHome ? (
            <HomePage
              loading={loading}
              clicksCount={clicksCount}
              conversionsCount={conversionsCount}
              conversionRate={conversionRate}
              recentClicks={recentClicks}
              recentConversions={recentConversions}
            />
          ) : (
            <Outlet context={{ activeTab, setActiveTab, selectedUserId, setSelectedUserId }} />
          )}
        </div>
      </main>
    </div>
  );
};


const HomePage = ({
  loading,
  clicksCount,
  conversionsCount,
  conversionRate,
  recentClicks,
  recentConversions,
}) => {
  return (
   <div>
      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "32px"
      }}>
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280", fontWeight: "500", textTransform: "uppercase" }}>Total Clicks</p>
          <h3 style={{ margin: 0, fontSize: "36px", fontWeight: "700", color: "#3498db" }}>{loading ? "..." : clicksCount.toLocaleString()}</h3>
        </div>
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280", fontWeight: "500", textTransform: "uppercase" }}>Total Conversion</p>
          <h3 style={{ margin: 0, fontSize: "36px", fontWeight: "700", color: "#27ae60" }}>{loading ? "..." : conversionsCount.toLocaleString()}</h3>
        </div>
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280", fontWeight: "500", textTransform: "uppercase" }}>Conversion Rate</p>
          <h3 style={{ margin: 0, fontSize: "36px", fontWeight: "700", color: "#9b59b6" }}>{loading ? "..." : `${conversionRate}%`}</h3>
        </div>
      </div>

      {/* Chart Section - Restored to match image */}
      <div style={{
        backgroundColor: "white", padding: "24px", borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", marginBottom: "32px"
      }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>Clicks vs Conversions Overview</h3>
        
        <div style={{ display: "flex", alignItems: "flex-end", gap: "40px", padding: "20px 0", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "120px", height: `${Math.max(40, Math.min(clicksCount * 2, 200))}px`,
              backgroundColor: "#3498db", borderRadius: "8px", display: "flex",
              alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "18px"
            }}>
              {clicksCount}
            </div>
            <p style={{ margin: "12px 0 0 0", fontSize: "14px", fontWeight: "600", color: "#3498db" }}>Clicks</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "120px", height: `${Math.max(40, Math.min(conversionsCount * 2, 200))}px`,
              backgroundColor: "#27ae60", borderRadius: "8px", display: "flex",
              alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "18px"
            }}>
              {conversionsCount}
            </div>
            <p style={{ margin: "12px 0 0 0", fontSize: "14px", fontWeight: "600", color: "#27ae60" }}>Conversions</p>
          </div>
        </div>

        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
            <strong style={{ color: "#1f2937" }}>{conversionRate}%</strong> of clicks resulted in conversions
          </p>
        </div>
      </div>

      {/* Recent Activity Sections - Restored to match image */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
        {/* Recent Clicks */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>Recent Clicks</h3>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentClicks.map((click, i) => (
                <div key={i} style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                    <span style={{ color: "#3498db", fontWeight: "600" }}>{click.clickid?.substring(0, 18)}...</span>
                    <span style={{ color: "#6b7280" }}>{new Date(click.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}>{click.ip_address}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Conversions */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>Recent Conversions</h3>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentConversions.map((conv, i) => (
                <div key={i} style={{ padding: "12px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#27ae60", fontWeight: "600", fontSize: "12px" }}>{conv.clickid?.substring(0, 18)}...</span>
                    <span style={{ color: "#27ae60", fontWeight: "700" }}>{conv.payout}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px" }}>
                    <span style={{ backgroundColor: conv.status === 'approved' ? "#d4edda" : "#fff3cd", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", fontWeight: "700" }}>{conv.status}</span>
                    <span style={{ color: "#6b7280" }}>{new Date(conv.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getPageTitle = (pathname) => {
  const routes = {
    "/dashboard": "Dashboard Overview",
    "/dashboard/clicks": "Clicks Management",
    "/dashboard/conversions": "Conversions Management",
    "/dashboard/campaigns": "Campaigns",
    "/dashboard/cashbacks": "Cashbacks",
    "/dashboard/users": "Users Management",
    "/dashboard/finance-dashboard": "Financial Overview",
    "/dashboard/global-ledger": "Global Ledger",
    "/dashboard/revenue-analysis": "Revenue Streams",
    "/dashboard/audit-logs": "Admin Audit Trail",
  };

  // Handle dynamic routes
  if (pathname.startsWith("/dashboard/users/")) {
    return "User Details";
  }

  if (pathname.startsWith("/dashboard/campaigns/")) {
    return "Campaign Details";
  }

  return routes[pathname] || "Dashboard";
};


export default Dashboard;