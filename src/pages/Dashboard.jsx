import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Clicks from "./Clicks";
import Conversions from "./Conversions";
import Campaigns from "./Campaigns";
import Cashbacks from "./Cashbacks";
import UserStaff from "./UserStaff";
import AdminProfile from "./AdminProfile";
import api from "../api/axios";
import UserDetails from "./UserDetails";
import Users from "./Users";
import FinancialOverview from './accounting/FinancialOverview';
import GlobalLedger from './accounting/GlobalLedger';
import RevenueAnalysis from './accounting/RevenueAnalysis';
import AdminAuditTrail from './accounting/AdminAuditTrail';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [clicksCount, setClicksCount] = useState(0);
  const [conversionsCount, setConversionsCount] = useState(0);
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (activeTab === "home") {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clicksRes, conversionsRes] = await Promise.all([
        api.get("/admin/clicks"),
        api.get("/admin/conversions")
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

  const conversionRate = clicksCount > 0 
    ? ((conversionsCount / clicksCount) * 100).toFixed(2) 
    : 0;

  const recentClicks = clicks.slice(0, 5);
  const recentConversions = conversions.slice(0, 5);

  const renderHomePage = () => (
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

  const renderPage = () => {
    switch (activeTab) {
      case "home": return renderHomePage();
      case "clicks": return <Clicks setCount={setClicksCount} />;
      case "conversions": return <Conversions setCount={setConversionsCount} />;
      case "campaigns": case "add-campaign": case "all-campaigns": return <Campaigns activeTab={activeTab} />;
      case "cashbacks": return <Cashbacks />;
      case "users-staff": return <UserStaff />;
      case "admin-profile": return <AdminProfile />;
      case "users-list": return <Users setActiveTab={setActiveTab} setSelectedUserId={setSelectedUserId} />;
      case "user-details": return <UserDetails wp_user_id={selectedUserId} setActiveTab={setActiveTab} />; 
      case "finance-dashboard": return <FinancialOverview />;
      case "global-ledger": return <GlobalLedger />;
      case "revenue-analysis": return <RevenueAnalysis />;
      case "audit-logs": return <AdminAuditTrail />;
      default: return renderHomePage();
    }
  };

 return (
  <div style={{ 
    display: "flex", 
    minHeight: "100vh", 
    backgroundColor: "#f5f7fa",
    overflowX: "hidden" // Prevent horizontal scroll issues
  }}>
    <Sidebar 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
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
        transition: "margin-left 0.3s ease",
        // Ensure the main area doesn't trap the scroll
        overflowY: "visible" ,
        width:"75%"
      }}
    >
      <header style={{
        backgroundColor: "white", 
        padding: "20px 32px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        borderBottom: "1px solid #e5e7eb"
      }}>
        <h1 style={{ margin: 0, fontSize: "26px", color: "#1f2937", fontWeight: "700" }}>
          {getPageTitle(activeTab)}
        </h1>
      </header>

      {/* This inner div ensures padding doesn't break the layout */}
      <div style={{ 
        padding: "32px", 
        flex: 1,
        width: "100%",
        boxSizing: "border-box" 
      }}>
        {renderPage()}
      </div>
    </main>

    <style>{`
      @media (min-width: 768px) {
        .main-content { margin-left: 240px !important; }
      }
      @media (max-width: 767px) {
        .main-content { margin-left: 0 !important; }
      }
      /* Ensure the body itself allows scrolling */
      body {
        margin: 0;
        overflow-y: auto;
      }
    `}</style>
  </div>
);
};

const getPageTitle = (tab) => {
  const titles = {
    home: "Dashboard Overview",
    clicks: "Clicks Management",
    conversions: "Conversions Management",
    campaigns: "Campaigns",
    "add-campaign": "Add New Campaign",
    "all-campaigns": "All Campaigns",
    cashbacks: "Cashbacks",
    "users-staff": "Users & Staff Management",
    "admin-profile": "Admin Profile",
    "finance-dashboard": "Financial Overview",
    "global-ledger": "Global Ledger",
    "revenue-analysis": "Revenue Streams",
    "audit-logs": "Admin Audit Trail"
  };
  return titles[tab] || "Dashboard";
};

export default Dashboard;