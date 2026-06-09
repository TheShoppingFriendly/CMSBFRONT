import { useNavigate, useLocation, Outlet } from "react-router-dom";

const Cashbacks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active tab based on URL
  const activeTab = location.pathname.includes("accounting") 
    ? "accounting" 
    : location.pathname.includes("users") 
      ? "users" 
      : "cashback";

  return (
    <div style={{ padding: "20px" }}>
      {/* --- Top Navigation Bar --- */}
    {/* Inside Cashbacks.jsx */}
<div style={tabContainerStyle}>
  <button 
    onClick={() => navigate("/dashboard/cashbacks")} 
    style={tabButtonStyle(activeTab === "cashback")}
  >
    💸 Cashback Management
  </button>
  <button 
    onClick={() => navigate("/dashboard/cashbacks/users")} 
    style={tabButtonStyle(activeTab === "users")}
  >
    👥 User Management
  </button>
  <button 
    onClick={() => navigate("/dashboard/cashbacks/accounting")} 
    style={tabButtonStyle(activeTab === "accounting")}
  >
    🏦 Accounting Module
  </button>
</div>

      {/* This is where the sub-pages (UserList, Accounting, etc.) will render */}
      <Outlet />
    </div>
  );
};

const tabContainerStyle = { 
  display: "flex", 
  gap: "20px", 
  marginBottom: "30px", 
  borderBottom: "1px solid #e5e7eb", 
  paddingBottom: "15px" 
};

const tabButtonStyle = (isActive) => ({
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: isActive ? "#7c3aed" : "transparent",
  color: isActive ? "white" : "#6b7280",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s"
});

export default Cashbacks;