import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Sidebar = ({ activeTab, setActiveTab, clicksCount, conversionsCount }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaignSubmenuOpen, setCampaignSubmenuOpen] = useState(false);
  const { admin, logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

const navigate = useNavigate();
const handleLogout = () => {
  logout();
  navigate("/");
};



  const menuItems = [
    { id: "home", label: "Home", 
      // icon: "🏠",
       badge: null },
    { id: "clicks", label: "Clicks",
      //  icon: "👆",
        badge: clicksCount },
    { id: "conversions", label: "Conversions",
      //  icon: "💰",
       badge: conversionsCount },
    { 
      id: "campaigns", 
      label: "Campaigns", 
      // icon: "📢", 
      badge: null,
      submenu: [
        { id: "add-campaign", label: "Add Campaign",
          //  icon: "➕" 
          },
        { id: "all-campaigns", label: "All Campaigns", 
          // icon: "📋" 
        }
      ]
    },
    { id: "cashbacks", label: "Cashbacks", 
      // icon: "💸", 
      badge: "Soon" },
    { id: "users-staff", label: "Users/Staff", 
      // icon: "👥", 
      badge: null },
    { id: "admin-profile", label: "Admin Profile", 
      // icon: "👤",
       badge: null },
  ];

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 1001,
          display: window.innerWidth < 768 ? "block" : "none",
          padding: "10px 14px",
          backgroundColor: "#2c3e50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}
        className="hamburger-menu"
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside 
        style={{
          width: "230px",
          backgroundColor: "#2c3e50",
          color: "white",
          position: "fixed",
          height: "100vh",
          transition: "transform 0.3s ease",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          zIndex: 1000,
          overflowY: "auto",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
        }}
        className="sidebar"
      >
        <div style={{ padding: "20px" }}>
          {/* Logo/Brand */}
          <div style={{
            marginBottom: "30px",
            paddingBottom: "20px",
            borderBottom: "1px solid #34495e"
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: "24px", 
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              {/* <span>🎯</span> */}
              Admin Panel
            </h2>
            <p style={{
              margin: "5px 0 0 0",
              fontSize: "12px",
              color: "#95a5a6"
            }}>
              CMS Management System
            </p>
          </div>
          
          {/* Navigation Menu */}
          <nav>
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.submenu) {
                      setCampaignSubmenuOpen(!campaignSubmenuOpen);
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    marginBottom: "6px",
                    backgroundColor: activeTab === item.id ? "#34495e" : "transparent",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                    fontWeight: activeTab === item.id ? "600" : "400"
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = "#34495e80";
                      e.currentTarget.style.paddingLeft = "20px";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.paddingLeft = "16px";
                    }
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{item.icon}</span>
                    {item.label}
                  </span>
                  
                  {item.badge !== null && (
                    <span style={{
                      backgroundColor: item.badge === "Soon" ? "#e67e22" : 
                                     item.id === "clicks" ? "#3498db" : "#27ae60",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}>
                      {item.badge === "Soon" ? "Soon" : item.badge}
                    </span>
                  )}

                  {item.submenu && (
                    <span style={{ 
                      fontSize: "12px",
                      transition: "transform 0.2s",
                      transform: campaignSubmenuOpen ? "rotate(180deg)" : "rotate(0deg)"
                    }}>
                      ▼
                    </span>
                  )}
                </button>

                {/* Submenu for Campaigns */}
                {item.submenu && campaignSubmenuOpen && (
                  <div style={{
                    marginLeft: "20px",
                    marginBottom: "6px",
                    paddingLeft: "10px",
                    borderLeft: "2px solid #34495e"
                  }}>
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleNavClick(subItem.id)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          marginBottom: "4px",
                          backgroundColor: activeTab === subItem.id ? "#34495e" : "transparent",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          if (activeTab !== subItem.id) {
                            e.currentTarget.style.backgroundColor = "#34495e80";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeTab !== subItem.id) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <span style={{ fontSize: "14px" }}>{subItem.icon}</span>
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
              <span style={{ fontSize: "18px" }}>🚪</span>
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