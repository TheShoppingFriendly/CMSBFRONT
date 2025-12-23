import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Clicks from "./Clicks";
import Conversions from "./Conversions";
import Campaigns from "./Campaigns";
// import Cashbacks from "./Cashbacks";
import UserStaff from "./UserStaff";
import AdminProfile from "./AdminProfile";
import api from "../api/axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [clicksCount, setClicksCount] = useState(0);
  const [conversionsCount, setConversionsCount] = useState(0);
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data for home page
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

  // Calculate conversion rate
  const conversionRate = clicksCount > 0 
    ? ((conversionsCount / clicksCount) * 100).toFixed(2) 
    : 0;

  // Get recent clicks and conversions
  const recentClicks = clicks.slice(0, 5);
  const recentConversions = conversions.slice(0, 5);

  // Render Home Page Content
  const renderHomePage = () => (
    <div>
      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        marginBottom: "32px"
      }}>
        {/* Total Clicks Card */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Total Clicks
              </p>
              <h3 style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: "700",
                color: "#3498db"
              }}>
                {loading ? "..." : clicksCount.toLocaleString()}
              </h3>
            </div>
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#e3f2fd",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px"
            }}>
              👆
            </div>
          </div>
          <p style={{
            margin: "16px 0 0 0",
            fontSize: "13px",
            color: "#10b981"
          }}>
            ↗ Total user clicks tracked
          </p>
        </div>

        {/* Total Conversions Card */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Total Conversions
              </p>
              <h3 style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: "700",
                color: "#27ae60"
              }}>
                {loading ? "..." : conversionsCount.toLocaleString()}
              </h3>
            </div>
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#d4edda",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px"
            }}>
              💰
            </div>
          </div>
          <p style={{
            margin: "16px 0 0 0",
            fontSize: "13px",
            color: "#10b981"
          }}>
            ↗ Successful conversions
          </p>
        </div>

        {/* Conversion Rate Card */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#6b7280",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Conversion Rate
              </p>
              <h3 style={{
                margin: 0,
                fontSize: "36px",
                fontWeight: "700",
                color: "#9b59b6"
              }}>
                {loading ? "..." : `${conversionRate}%`}
              </h3>
            </div>
            <div style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#f3e5f5",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px"
            }}>
              📈
            </div>
          </div>
          <p style={{
            margin: "16px 0 0 0",
            fontSize: "13px",
            color: "#6b7280"
          }}>
            Click to conversion ratio
          </p>
        </div>
      </div>

      {/* Conversion Rate Chart */}
      <div style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        marginBottom: "32px"
      }}>
        <h3 style={{
          margin: "0 0 20px 0",
          fontSize: "18px",
          fontWeight: "700",
          color: "#1f2937"
        }}>
          Clicks vs Conversions Overview
        </h3>
        
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "40px",
          padding: "20px 0",
          justifyContent: "center"
        }}>
          {/* Clicks Bar */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "120px",
              height: `${Math.min(clicksCount / 2, 200)}px`,
              minHeight: "40px",
              backgroundColor: "#3498db",
              borderRadius: "8px 8px 0 0",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "10px",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              transition: "all 0.3s ease"
            }}>
              {clicksCount}
            </div>
            <p style={{
              margin: "12px 0 0 0",
              fontSize: "14px",
              fontWeight: "600",
              color: "#3498db"
            }}>
              Clicks
            </p>
          </div>

          {/* Conversions Bar */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "120px",
              height: `${Math.min(conversionsCount / 2, 200)}px`,
              minHeight: "40px",
              backgroundColor: "#27ae60",
              borderRadius: "8px 8px 0 0",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "10px",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              transition: "all 0.3s ease"
            }}>
              {conversionsCount}
            </div>
            <p style={{
              margin: "12px 0 0 0",
              fontSize: "14px",
              fontWeight: "600",
              color: "#27ae60"
            }}>
              Conversions
            </p>
          </div>
        </div>

        <div style={{
          marginTop: "24px",
          padding: "16px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#6b7280"
          }}>
            <strong style={{ color: "#1f2937" }}>{conversionRate}%</strong> of clicks resulted in conversions
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "24px"
      }}>
        {/* Recent Clicks */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>👆</span> Recent Clicks
          </h3>
          
          {loading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>Loading...</p>
          ) : recentClicks.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentClicks.map((click, index) => (
                <div key={click._id || index} style={{
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px"
                  }}>
                    <code style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#3498db"
                    }}>
                      {click.clickid?.substring(0, 16)}...
                    </code>
                    <span style={{
                      fontSize: "11px",
                      color: "#6b7280"
                    }}>
                      {new Date(click.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#6b7280"
                  }}>
                    {click.ip_address}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
              No recent clicks
            </p>
          )}
        </div>

        {/* Recent Conversions */}
        <div style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: "18px",
            fontWeight: "700",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>💰</span> Recent Conversions
          </h3>
          
          {loading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>Loading...</p>
          ) : recentConversions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentConversions.map((conversion, index) => (
                <div key={conversion._id || index} style={{
                  padding: "12px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "8px",
                  border: "1px solid #bbf7d0"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px"
                  }}>
                    <code style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#27ae60"
                    }}>
                      {conversion.clickid?.substring(0, 16)}...
                    </code>
                    <span style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#27ae60"
                    }}>
                      ${conversion.payout || "0.00"}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      backgroundColor: conversion.status === "approved" ? "#d4edda" : "#fff3cd",
                      color: conversion.status === "approved" ? "#155724" : "#856404",
                      borderRadius: "4px",
                      fontWeight: "600",
                      textTransform: "uppercase"
                    }}>
                      {conversion.status}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      color: "#6b7280"
                    }}>
                      {new Date(conversion.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>
              No recent conversions
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Render active page component
  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return renderHomePage();
      case "clicks":
        return <Clicks setCount={setClicksCount} />;
      case "conversions":
        return <Conversions setCount={setConversionsCount} />;
      case "campaigns":
      case "add-campaign":
      case "all-campaigns":
        return <Campaigns activeTab={activeTab} />;
      case "cashbacks":
        return <Cashbacks />;
      case "users-staff":
        return <UserStaff />;
      case "admin-profile":
        return <AdminProfile />;
      default:
        return renderHomePage();
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        clicksCount={clicksCount}
        conversionsCount={conversionsCount}
      />

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: "220px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh"
      }}
      className="main-content">
        {/* Header */}
        <header style={{
          backgroundColor: "white",
          padding: "20px 32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: "26px", 
              color: "#1f2937",
              fontWeight: "700"
            }}>
              {getPageTitle(activeTab)}
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "32px", width: "980px" }}>
          {renderPage()}
        </div>
      </main>

      <style>{`
        @media (max-width: 767px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to get page title
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
    "admin-profile": "Admin Profile"
  };
  return titles[tab] || "Dashboard";
};

export default Dashboard;