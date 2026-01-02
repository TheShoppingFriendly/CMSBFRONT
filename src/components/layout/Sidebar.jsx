import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, clicksCount, conversionsCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaignSubmenuOpen, setCampaignSubmenuOpen] = useState(false);
  // NEW: State for Users Submenu
  const [usersSubmenuOpen, setUsersSubmenuOpen] = useState(false); 
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
    // UPDATED: WordPress Users Section
    { 
      id: "wp-users", 
      label: "WordPress Users", 
      icon: "",
      submenu: [
        { id: "users-list", label: "All Users" },
        { id: "user-details", label: "User Management" } 
      ]
    },
    { id: "cashbacks", label: "Cashbacks", badge: "Soon", icon: "💸" },
    { id: "admin-profile", label: "Admin Profile", icon: "👤" },
  ];

  return (
    <>
      {/* Hamburger & Overlay code remains the same as your current file... */}
      <button onClick={toggleSidebar} className="hamburger-menu" style={{/* your existing styles */}}> ☰ </button>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="sidebar-overlay" style={{/* your existing styles */}} />}

      <aside className="sidebar" style={{/* your existing styles */ transition: "transform 0.3s ease", transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", position: "fixed", width: "230px", height: "100vh", backgroundColor: "#2c3e50", color: "white", zIndex: 1000 }}>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #34495e" }}>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Admin Panel</h2>
            <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#95a5a6" }}>CMS Management System</p>
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
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  style={{
                    width: "100%", padding: "12px 16px", marginBottom: "6px",
                    backgroundColor: activeTab === item.id ? "#34495e" : "transparent",
                    color: "white", border: "none", borderRadius: "8px", cursor: "pointer",
                    textAlign: "left", fontSize: "15px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", fontWeight: activeTab === item.id ? "600" : "400"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  
                  {item.badge && (
                    <span style={{ backgroundColor: "#e67e22", padding: "3px 10px", borderRadius: "12px", fontSize: "11px" }}>
                      {item.badge}
                    </span>
                  )}

                  {item.submenu && (
                    <span style={{ 
                      fontSize: "12px", transform: (item.id === "campaigns" ? campaignSubmenuOpen : usersSubmenuOpen) ? "rotate(180deg)" : "rotate(0deg)" 
                    }}>▼</span>
                  )}
                </button>

                {/* Submenu Logic */}
                {item.submenu && ((item.id === "campaigns" && campaignSubmenuOpen) || (item.id === "wp-users" && usersSubmenuOpen)) && (
                  <div style={{ marginLeft: "20px", marginBottom: "6px", paddingLeft: "10px", borderLeft: "2px solid #34495e" }}>
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleNavClick(subItem.id)}
                        style={{
                          width: "100%", padding: "10px 14px", marginBottom: "4px",
                          backgroundColor: activeTab === subItem.id ? "#34495e" : "transparent",
                          color: "white", border: "none", borderRadius: "6px", cursor: "pointer",
                          textAlign: "left", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px"
                        }}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #34495e"
          }}>
            {admin && (
              <div style={{
                padding: "14px",
                backgroundColor: "#34495e",
                borderRadius: "8px",
                marginBottom: "12px",
                fontSize: "14px"
              }}>
                <div style={{ 
                  color: "#95a5a6", 
                  fontSize: "11px", 
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Logged in as
                </div>
                <div style={{ 
                  fontWeight: "600",
                  fontSize: "14px",
                  wordBreak: "break-word"
                }}>
                  {admin.name || admin.email}
                </div>
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c0392b";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(231, 76, 60, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#e74c3c";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "18px" }}></span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0) !important;
          }
          .hamburger-menu {
            display: none !important;
          }
        }
        
        @media (max-width: 767px) {
          .sidebar-overlay {
            display: block;
          }
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #34495e;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #95a5a6;
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #7f8c8d;
        }
      `}</style>
    </>
  );
};

export default Sidebar;