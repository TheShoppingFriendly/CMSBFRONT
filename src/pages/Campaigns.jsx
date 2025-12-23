const Campaigns = ({ activeTab }) => {
  const getTitle = () => {
    if (activeTab === "add-campaign") return "Add New Campaign";
    if (activeTab === "all-campaigns") return "All Campaigns";
    return "Campaign Management";
  };

  const getDescription = () => {
    if (activeTab === "add-campaign") {
      return "Create and configure new marketing campaigns with advanced targeting options.";
    }
    if (activeTab === "all-campaigns") {
      return "View, manage, and analyze all your active and past campaigns in one place.";
    }
    return "Powerful campaign management tools are on the way!";
  };

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      padding: "60px 40px",
      textAlign: "center",
      minHeight: "500px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: "120px",
        height: "120px",
        backgroundColor: "#ede9fe",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "60px",
        marginBottom: "32px",
        animation: "bounce 2s infinite"
      }}>
        📢
      </div>
      
      <h2 style={{
        margin: "0 0 16px 0",
        fontSize: "32px",
        fontWeight: "700",
        color: "#1f2937"
      }}>
        {getTitle()}
      </h2>
      
      <p style={{
        margin: "0 0 24px 0",
        fontSize: "16px",
        color: "#6b7280",
        maxWidth: "600px",
        lineHeight: "1.6"
      }}>
        {getDescription()}
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        width: "100%",
        maxWidth: "700px",
        marginTop: "32px"
      }}>
        <div style={{
          padding: "20px",
          backgroundColor: "#faf5ff",
          border: "2px solid #e9d5ff",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎯</div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
            Smart Targeting
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Advanced audience segmentation
          </p>
        </div>

        <div style={{
          padding: "20px",
          backgroundColor: "#faf5ff",
          border: "2px solid #e9d5ff",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📊</div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
            Real-time Analytics
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Track performance metrics
          </p>
        </div>

        <div style={{
          padding: "20px",
          backgroundColor: "#faf5ff",
          border: "2px solid #e9d5ff",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚡</div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
            Quick Setup
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Launch campaigns in minutes
          </p>
        </div>
      </div>

      <div style={{
        marginTop: "48px",
        padding: "16px 32px",
        backgroundColor: "#fef3c7",
        color: "#92400e",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <span style={{ fontSize: "24px" }}>🚧</span>
        Under Development
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default Campaigns;