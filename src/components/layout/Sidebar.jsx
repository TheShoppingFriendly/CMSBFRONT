import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, clicksCount, conversionsCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaignSubmenuOpen, setCampaignSubmenuOpen] = useState(false);
  const [usersSubmenuOpen, setUsersSubmenuOpen] = useState(false); 
  const [accountingSubmenuOpen, setAccountingSubmenuOpen] = useState(false); 
  
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { id: "home", label: "Home", badge: null, icon: "" },
    { id: "clicks", label: "Clicks", badge: clicksCount, icon: "" },
    { id: "conversions", label: "Conversions", badge: conversionsCount, icon: "" },
    { 
      id: "campaigns", 
      label: "Campaigns", 
      icon: "",
      submenu: [
        { id: "add-campaign", label: "Add Campaign" },
        { id: "all-campaigns", label: "All Campaigns" }
      ]
    },
    { 
      id: "wp-users", 
      label: "WordPress Users", 
      icon: "",
      submenu: [
        { id: "users-list", label: "All Users" },
        { id: "user-details", label: "User Management" } 
      ]
    },
    { 
      id: "accounting", 
      label: "Accounting", 
      icon: "",
      submenu: [
        { id: "finance-dashboard", label: "Financial Overview" },
        { id: "global-ledger", label: "Global Ledger" },
        { id: "revenue-analysis", label: "Revenue Streams" },
        { id: "audit-logs", label: "Admin Audit Trail" }
      ]
    },
    { id: "cashbacks", label: "Cashbacks", badge: "Soon", icon: "" },
    { id: "admin-profile", label: "Admin Profile", icon: "" },
  ];

  return (
    <>
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="hamburger-menu" 
        style={{ 
          position: "fixed", top: "15px", left: "15px", zIndex: 1100, 
          padding: "10px", backgroundColor: "#2c3e50", color: "white", 
          border: "none", borderRadius: "5px", cursor: "pointer" 
        }}
      > 
        ☰ 
      </button>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="sidebar-overlay" 
          style={{ 
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
            zIndex: 999, backgroundColor: "rgba(0,0,0,0.4)"
          }} 
        />
      )}

      <aside 
        className="sidebar-container" 
        style={{ 
          transition: "transform 0.3s ease", 
          transform: sidebarOpen ? "translateX(0)" : "translateX(-240px)", 
          position: "fixed", width: "240px", height: "100vh", 
          backgroundColor: "#2c3e50", color: "white", zIndex: 1000, overflowY: "auto" 
        }}
      >
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #34495e" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>Admin Panel</h2>
            <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#95a5a6" }}>Accounting & Management</p>
          </div>
          
          <nav>
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === "campaigns") {
                      setCampaignSubmenuOpen(!campaignSubmenuOpen);
                    } else if (item.id === "wp-users") {
                      setUsersSubmenuOpen(!usersSubmenuOpen);
                    } else if (item.id === "accounting") {
                      setAccountingSubmenuOpen(!accountingSubmenuOpen);
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  style={{
                    width: "100%", padding: "12px 16px", marginBottom: "6px",
                    backgroundColor: activeTab === item.id || (item.submenu && item.submenu.some(s => s.id === activeTab)) ? "#34495e" : "transparent",
                    color: "white", border: "none", borderRadius: "8px", cursor: "pointer",
                    textAlign: "left", fontSize: "14px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", fontWeight: activeTab === item.id ? "600" : "400"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {item.label}
                  </span>
                  
                  {item.badge && (
                    <span style={{ backgroundColor: "#e67e22", padding: "2px 8px", borderRadius: "10px", fontSize: "10px" }}>
                      {item.badge}
                    </span>
                  )}

                  {item.submenu && (
                    <span style={{ 
                      fontSize: "10px", 
                      transition: "0.3s",
                      transform: (
                        (item.id === "campaigns" && campaignSubmenuOpen) || 
                        (item.id === "wp-users" && usersSubmenuOpen) ||
                        (item.id === "accounting" && accountingSubmenuOpen)
                      ) ? "rotate(180deg)" : "rotate(0deg)" 
                    }}>▼</span>
                  )}
                </button>

                {item.submenu && (
                  ((item.id === "campaigns" && campaignSubmenuOpen) || 
                   (item.id === "wp-users" && usersSubmenuOpen) ||
                   (item.id === "accounting" && accountingSubmenuOpen))
                ) && (
                  <div style={{ marginLeft: "25px", marginBottom: "8px", paddingLeft: "10px", borderLeft: "1px solid #5a6c7d" }}>
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleNavClick(subItem.id)}
                        style={{
                          width: "100%", padding: "8px 12px", marginBottom: "4px",
                          backgroundColor: activeTab === subItem.id ? "#1abc9c" : "transparent",
                          color: activeTab === subItem.id ? "white" : "#bdc3c7", 
                          border: "none", borderRadius: "6px", cursor: "pointer",
                          textAlign: "left", fontSize: "13px"
                        }}
                      >
                        • {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #34495e" }}>
            {admin && (
              <div style={{ padding: "12px", backgroundColor: "#34495e", borderRadius: "8px", marginBottom: "12px", fontSize: "13px" }}>
                <div style={{ color: "#95a5a6", fontSize: "10px", textTransform: "uppercase", marginBottom: "4px" }}>Admin Session</div>
                <div style={{ fontWeight: "600" }}>{admin.name || admin.email}</div>
              </div>
            )}
            <button onClick={handleLogout} style={{ width: "100%", padding: "12px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-container { transform: translateX(0) !important; }
          .hamburger-menu { display: none !important; }
          .sidebar-overlay { display: none !important; }
        }
        @media (max-width: 767px) {
          .hamburger-menu { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;