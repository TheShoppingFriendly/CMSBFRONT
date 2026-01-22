import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, clicksCount, conversionsCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaignSubmenuOpen, setCampaignSubmenuOpen] = useState(false);
  const [usersSubmenuOpen, setUsersSubmenuOpen] = useState(false);
  const [accountingSubmenuOpen, setAccountingSubmenuOpen] = useState(false);

  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // ==============================
  // AUTO SYNC SIDEBAR WITH URL
  // ==============================
  useEffect(() => {
    const path = location.pathname;

    const routeMap = {
      "/dashboard": "home",

      "/campaigns": "all-campaigns",
      "/users": "users-list",

      "/accounting/overview": "finance-dashboard",
      "/accounting/ledger": "global-ledger",
      "/accounting/revenue": "revenue-analysis",
      "/accounting/audit": "audit-logs",
    };

    const matched = Object.keys(routeMap).find((r) =>
      path.startsWith(r)
    );

    if (matched) {
      const tab = routeMap[matched];
      setActiveTab(tab);

      if (tab.includes("campaign")) setCampaignSubmenuOpen(true);
      if (tab.includes("user")) setUsersSubmenuOpen(true);
      if (path.startsWith("/accounting")) setAccountingSubmenuOpen(true);
    }
  }, [location.pathname, setActiveTab]);

  // ==============================
  // NAV HANDLER
  // ==============================
  const handleNavClick = (tab) => {
    setActiveTab(tab);

    const routeMap = {
      home: "/dashboard",

      "add-campaign": "/campaigns",
      "all-campaigns": "/campaigns",

      "users-list": "/users",
      "user-details": "/users",

      // ACCOUNTING
      "finance-dashboard": "/accounting/overview",
      "global-ledger": "/accounting/ledger",
      "revenue-analysis": "/accounting/revenue",
      "audit-logs": "/accounting/audit",
    };

    if (routeMap[tab]) {
      navigate(routeMap[tab]);
    }

    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "clicks", label: "Clicks", badge: clicksCount },
    { id: "conversions", label: "Conversions", badge: conversionsCount },

    {
      id: "campaigns",
      label: "Campaigns",
      submenu: [
        { id: "add-campaign", label: "Add Campaign" },
        { id: "all-campaigns", label: "All Campaigns" },
      ],
    },

    {
      id: "wp-users",
      label: "WordPress Users",
      submenu: [
        { id: "users-list", label: "All Users" },
        { id: "user-details", label: "User Management" },
      ],
    },

    {
      id: "accounting",
      label: "Accounting",
      submenu: [
        { id: "finance-dashboard", label: "Financial Overview" },
        { id: "global-ledger", label: "Global Ledger" },
        { id: "revenue-analysis", label: "Revenue Streams" },
        { id: "audit-logs", label: "Admin Audit Trail" },
      ],
    },

    { id: "cashbacks", label: "Cashbacks", badge: "Soon" },
    { id: "admin-profile", label: "Admin Profile" },
  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          zIndex: 1100,
          padding: "10px",
          backgroundColor: "#2c3e50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        />
      )}

      <aside
        style={{
          transition: "transform 0.3s ease",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          position: "fixed",
          width: "240px",
          height: "100vh",
          backgroundColor: "#2c3e50",
          color: "white",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "20px" }}>
          <div
            style={{
              marginBottom: "30px",
              paddingBottom: "20px",
              borderBottom: "1px solid #34495e",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>
              Admin Panel
            </h2>
            <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#95a5a6" }}>
              Accounting & Management
            </p>
          </div>

          <nav>
            {menuItems.map((item) => {
              const isSubmenuOpen =
                (item.id === "campaigns" && campaignSubmenuOpen) ||
                (item.id === "wp-users" && usersSubmenuOpen) ||
                (item.id === "accounting" && accountingSubmenuOpen);

              const isActive =
                activeTab === item.id ||
                item.submenu?.some((s) => s.id === activeTab);

              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === "campaigns")
                        setCampaignSubmenuOpen(!campaignSubmenuOpen);
                      else if (item.id === "wp-users")
                        setUsersSubmenuOpen(!usersSubmenuOpen);
                      else if (item.id === "accounting")
                        setAccountingSubmenuOpen(!accountingSubmenuOpen);
                      else handleNavClick(item.id);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      marginBottom: "6px",
                      backgroundColor: isActive
                        ? "#34495e"
                        : "transparent",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: isActive ? "600" : "400",
                    }}
                  >
                    <span>{item.label}</span>

                    {item.badge && (
                      <span
                        style={{
                          backgroundColor: "#e67e22",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "10px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.submenu && (
                      <span
                        style={{
                          fontSize: "10px",
                          transition: "0.3s",
                          transform: isSubmenuOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        ▼
                      </span>
                    )}
                  </button>

                  {item.submenu && isSubmenuOpen && (
                    <div
                      style={{
                        marginLeft: "25px",
                        marginBottom: "8px",
                        paddingLeft: "10px",
                        borderLeft: "1px solid #5a6c7d",
                      }}
                    >
                      {item.submenu.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleNavClick(sub.id)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            marginBottom: "4px",
                            backgroundColor:
                              activeTab === sub.id
                                ? "#1abc9c"
                                : "transparent",
                            color:
                              activeTab === sub.id
                                ? "white"
                                : "#bdc3c7",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            textAlign: "left",
                            fontSize: "13px",
                          }}
                        >
                          • {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "1px solid #34495e",
            }}
          >
            {admin && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#34495e",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    color: "#95a5a6",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Admin Session
                </div>
                <div style={{ fontWeight: "600" }}>
                  {admin.name || admin.email}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
