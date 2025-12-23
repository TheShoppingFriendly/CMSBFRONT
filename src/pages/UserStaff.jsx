const UserStaff = () => {
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
        backgroundColor: "#dbeafe",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "60px",
        marginBottom: "32px",
        animation: "rotate 3s infinite linear"
      }}>
        👥
      </div>
      
      <h2 style={{
        margin: "0 0 16px 0",
        fontSize: "32px",
        fontWeight: "700",
        color: "#1f2937"
      }}>
        Users & Staff Management
      </h2>
      
      <p style={{
        margin: "0 0 24px 0",
        fontSize: "16px",
        color: "#6b7280",
        maxWidth: "600px",
        lineHeight: "1.6"
      }}>
        Complete staff management system with role-based access control is under development. 
        Soon you'll be able to add team members, assign permissions, and manage user roles effortlessly.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        width: "100%",
        maxWidth: "800px",
        marginTop: "32px"
      }}>
        <div style={{
          padding: "20px",
          backgroundColor: "#eff6ff",
          border: "2px solid #bfdbfe",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>👤</div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
            Add Staff
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Invite team members
          </p>
        </div>

        <div style={{
          padding: "20px",
          backgroundColor: "#eff6ff",
          border: "2px solid #bfdbfe",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔐</div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
            Role Management
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Assign permissions
          </p>
        </div>

        <div style={{
          padding: "20px",
          backgroundColor: "#eff6ff",
          border: "2px solid #bfdbfe",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>📝</div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
            Activity Logs
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Track user actions
          </p>
        </div>

        <div style={{
          padding: "20px",
          backgroundColor: "#eff6ff",
          border: "2px solid #bfdbfe",
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚙️</div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>
            Access Control
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Manage permissions
          </p>
        </div>
      </div>

      <div style={{
        marginTop: "48px",
        width: "100%",
        maxWidth: "600px",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "10px",
        border: "1px solid #e5e7eb"
      }}>
        <h4 style={{
          margin: "0 0 12px 0",
          fontSize: "16px",
          fontWeight: "600",
          color: "#1f2937"
        }}>
          Planned Features:
        </h4>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          textAlign: "left"
        }}>
          <div style={{ fontSize: "14px", color: "#6b7280", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span> Multi-level user hierarchy
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span> Custom role creation
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span> Granular permission settings
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#10b981" }}>✓</span> User activity monitoring
          </div>
        </div>
      </div>

      <div style={{
        marginTop: "32px",
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
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UserStaff;