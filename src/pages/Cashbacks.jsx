const Cashbacks = () => {
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
        backgroundColor: "#fef3c7",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "60px",
        marginBottom: "32px",
        animation: "pulse 2s infinite"
      }}>
        💸
      </div>
      
      <h2 style={{
        margin: "0 0 16px 0",
        fontSize: "32px",
        fontWeight: "700",
        color: "#1f2937"
      }}>
        Cashbacks Coming Soon
      </h2>
      
      <p style={{
        margin: "0 0 24px 0",
        fontSize: "16px",
        color: "#6b7280",
        maxWidth: "600px",
        lineHeight: "1.6"
      }}>
        We're building an amazing cashback management system! Soon you'll be able to track cashback offers, 
        manage payouts, and view detailed analytics all in one place.
      </p>

      <div style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "32px"
      }}>
        <div style={{
          padding: "16px 24px",
          backgroundColor: "#f0fdf4",
          border: "2px solid #86efac",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#166534"
        }}>
          ✓ Track Cashback Offers
        </div>
        <div style={{
          padding: "16px 24px",
          backgroundColor: "#f0fdf4",
          border: "2px solid #86efac",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#166534"
        }}>
          ✓ Manage Payouts
        </div>
        <div style={{
          padding: "16px 24px",
          backgroundColor: "#f0fdf4",
          border: "2px solid #86efac",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#166534"
        }}>
          ✓ Detailed Analytics
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
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default Cashbacks;