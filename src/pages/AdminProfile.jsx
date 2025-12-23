import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
    role: admin?.role || "Admin"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Add API call to update profile
    alert("Profile update functionality coming soon!");
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Profile Header Card */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "32px",
        marginBottom: "24px",
        textAlign: "center"
      }}>
        <div style={{
          width: "100px",
          height: "100px",
          backgroundColor: "#667eea",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
          margin: "0 auto 20px",
          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
        }}>
          👤
        </div>
        <h2 style={{
          margin: "0 0 8px 0",
          fontSize: "28px",
          fontWeight: "700",
          color: "#1f2937"
        }}>
          {admin?.name || "Admin User"}
        </h2>
        <p style={{
          margin: 0,
          fontSize: "16px",
          color: "#6b7280"
        }}>
          {admin?.email}
        </p>
        <div style={{
          marginTop: "16px",
          display: "inline-block",
          padding: "6px 16px",
          backgroundColor: "#ede9fe",
          color: "#7c3aed",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600"
        }}>
          {formData.role}
        </div>
      </div>

      {/* Profile Details Card */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "32px",
        marginBottom: "24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid #f0f0f0"
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
            color: "#1f2937"
          }}>
            Profile Information
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: "8px 16px",
              backgroundColor: isEditing ? "#e74c3c" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isEditing ? "#c0392b" : "#2980b9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isEditing ? "#e74c3c" : "#3498db";
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Name Field */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#2c3e50"
            }}>
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3498db"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            ) : (
              <p style={{
                margin: 0,
                padding: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                fontSize: "15px",
                color: "#1f2937"
              }}>
                {formData.name || "Not provided"}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#2c3e50"
            }}>
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3498db"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            ) : (
              <p style={{
                margin: 0,
                padding: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                fontSize: "15px",
                color: "#1f2937"
              }}>
                {formData.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#2c3e50"
            }}>
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#3498db"}
                onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
              />
            ) : (
              <p style={{
                margin: 0,
                padding: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                fontSize: "15px",
                color: "#1f2937"
              }}>
                {formData.phone || "Not provided"}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#2c3e50"
            }}>
              Role
            </label>
            <p style={{
              margin: 0,
              padding: "12px",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              fontSize: "15px",
              color: "#1f2937"
            }}>
              {formData.role}
            </p>
          </div>

          {/* Save Button (only visible when editing) */}
          {isEditing && (
            <button
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                marginTop: "12px",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#229954"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#27ae60"}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Security & Logout Card */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "32px"
      }}>
        <h3 style={{
          margin: "0 0 20px 0",
          fontSize: "20px",
          fontWeight: "700",
          color: "#1f2937",
          paddingBottom: "16px",
          borderBottom: "2px solid #f0f0f0"
        }}>
          Security & Account
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <button
            onClick={() => alert("Change password functionality coming soon!")}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2980b9"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3498db"}
          >
            <span style={{ fontSize: "18px" }}>🔑</span>
            Change Password
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c0392b";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(231, 76, 60, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#e74c3c";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "18px" }}>🚪</span>
            Logout from Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;