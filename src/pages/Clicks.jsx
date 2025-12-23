import { useEffect, useState } from "react";
import api from "../api/axios";

const Clicks = () => {
  const [clicks, setClicks] = useState([]);
  const [filteredClicks, setFilteredClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    clickid: "",
    campaign_id: "",
    tracking_type: "",
    ip_address: "",
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    fetchClicks();
  }, []);

  const fetchClicks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/clicks");
      setClicks(res.data);
      setFilteredClicks(res.data);
      if (setCount) setCount(res.data.length); // Update parent count
    } catch (error) {
      console.error("Error fetching clicks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time filtering
  useEffect(() => {
    let filtered = [...clicks];

    // Filter by Click ID
    if (filters.clickid) {
      filtered = filtered.filter(click => 
        click.clickid?.toLowerCase().includes(filters.clickid.toLowerCase())
      );
    }

    // Filter by Campaign ID
    if (filters.campaign_id) {
      filtered = filtered.filter(click => 
        click.campaign_id?.toLowerCase().includes(filters.campaign_id.toLowerCase())
      );
    }

    // Filter by Tracking Type
    if (filters.tracking_type) {
      filtered = filtered.filter(click => 
        click.tracking_type?.toLowerCase() === filters.tracking_type.toLowerCase()
      );
    }

    // Filter by IP Address
    if (filters.ip_address) {
      filtered = filtered.filter(click => 
        click.ip_address?.includes(filters.ip_address)
      );
    }

    // Filter by Date Range
    if (filters.dateFrom) {
      filtered = filtered.filter(click => 
        new Date(click.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(click => 
        new Date(click.created_at) <= endDate
      );
    }

    setFilteredClicks(filtered);
  }, [filters, clicks]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      clickid: "",
      campaign_id: "",
      tracking_type: "",
      ip_address: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div style={{ position: "relative" }}>
      {/* Header with Stats and Filter Button */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "20px 24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          flex: "1",
          minWidth: "200px"
        }}>
          <h2 style={{ 
            margin: "0 0 8px 0", 
            fontSize: "16px", 
            color: "#6c757d",
            fontWeight: "500"
          }}>
            Total Clicks
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: "36px", 
            fontWeight: "700", 
            color: "#3498db" 
          }}>
            {filteredClicks.length}
          </p>
          {activeFiltersCount > 0 && (
            <p style={{ 
              margin: "8px 0 0 0", 
              fontSize: "13px", 
              color: "#95a5a6" 
            }}>
              Filtered from {clicks.length} total
            </p>
          )}
        </div>

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          style={{
            padding: "12px 24px",
            backgroundColor: filterOpen ? "#e74c3c" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
            position: "relative"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span style={{ fontSize: "18px" }}>🔍</span>
          {filterOpen ? "Close Filters" : "Open Filters"}
          {activeFiltersCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              backgroundColor: "#e74c3c",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "700",
              border: "2px solid white"
            }}>
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Sidebar */}
      {filterOpen && (
        <div style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "100%",
          maxWidth: "400px",
          height: "100vh",
          backgroundColor: "white",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
          zIndex: 1000,
          overflowY: "auto",
          animation: "slideInRight 0.3s ease-out"
        }}>
          <div style={{ padding: "24px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "2px solid #f0f0f0"
            }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                Filter Clicks
              </h3>
              <button
                onClick={() => setFilterOpen(false)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Filter Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Click ID Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Click ID
                </label>
                <input
                  type="text"
                  placeholder="Search by Click ID..."
                  value={filters.clickid}
                  onChange={(e) => handleFilterChange("clickid", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Campaign ID Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Campaign ID
                </label>
                <input
                  type="text"
                  placeholder="Search by Campaign ID..."
                  value={filters.campaign_id}
                  onChange={(e) => handleFilterChange("campaign_id", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Tracking Type Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Tracking Type
                </label>
                <select
                  value={filters.tracking_type}
                  onChange={(e) => handleFilterChange("tracking_type", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "white",
                    cursor: "pointer",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                >
                  <option value="">All Types</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="direct">Direct</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* IP Address Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  IP Address
                </label>
                <input
                  type="text"
                  placeholder="Search by IP Address..."
                  value={filters.ip_address}
                  onChange={(e) => handleFilterChange("ip_address", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Date Range Filters */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Date From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Date To
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#95a5a6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  marginTop: "12px",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#7f8c8d"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#95a5a6"}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay when filter is open */}
      {filterOpen && (
        <div
          onClick={() => setFilterOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999
          }}
        />
      )}

      {/* Table */}
      {loading ? (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "60px 20px",
          textAlign: "center"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ color: "#6c757d", fontSize: "16px" }}>Loading clicks...</p>
        </div>
      ) : filteredClicks.length > 0 ? (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflowX: "auto"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={tableHeaderStyle}>#</th>
                <th style={tableHeaderStyle}>Click ID</th>
                <th style={tableHeaderStyle}>Campaign ID</th>
                <th style={tableHeaderStyle}>Coupon URL</th>
                <th style={tableHeaderStyle}>Final Redirect</th>
                <th style={tableHeaderStyle}>IP Address</th>
                <th style={tableHeaderStyle}>User Agent</th>
                <th style={tableHeaderStyle}>Tracking Type</th>
                <th style={tableHeaderStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredClicks.map((click, index) => (
                <tr 
                  key={click._id || index} 
                  style={{
                    borderBottom: "1px solid #dee2e6",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>
                    <code style={{ 
                      fontSize: "12px", 
                      backgroundColor: "#f8f9fa",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "500"
                    }}>
                      {click.clickid || "N/A"}
                    </code>
                  </td>
                  <td style={tableCellStyle}>
                    {click.campaign_id || 
                      <span style={{ color: "#6c757d" }}>null</span>}
                  </td>
                  <td style={tableCellStyle}>
                    {click.coupon_url ? (
                      <a 
                        href={click.coupon_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ PMcolor: "#3498db",
textDecoration: "none",
fontSize: "13px"
}}
title={click.coupon_url}
onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
onMouseLeave={(e) => e.target.style.textDecoration = "none"}
>
{click.coupon_url.length > 40
? click.coupon_url.substring(0, 40) + "..."
: click.coupon_url}
</a>
) : "N/A"}
</td>
<td style={tableCellStyle}>
{click.final_redirect_url ? (
<a
href={click.final_redirect_url}
target="_blank"
rel="noopener noreferrer"
style={{
color: "#27ae60",
textDecoration: "none",
fontSize: "13px"
}}
title={click.final_redirect_url}
onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
onMouseLeave={(e) => e.target.style.textDecoration = "none"}
>
{click.final_redirect_url.length > 40
? click.final_redirect_url.substring(0, 40) + "..."
: click.final_redirect_url}
</a>
) : "N/A"}
</td>
<td style={tableCellStyle}>
<span style={{
fontFamily: "monospace",
fontSize: "13px",
backgroundColor: "#f8f9fa",
padding: "2px 6px",
borderRadius: "4px"
}}>
{click.ip_address || "N/A"}
</span>
</td>
<td style={tableCellStyle} title={click.user_agent}>
<span style={{ fontSize: "12px", color: "#6c757d" }}>
{click.user_agent ?
click.user_agent.substring(0, 30) + "..." :
"N/A"}
</span>
</td>
<td style={tableCellStyle}>
<span style={{
padding: "6px 12px",
backgroundColor: click.tracking_type === "affiliate" ? "#e3f2fd" : "#f5f5f5",
color: click.tracking_type === "affiliate" ? "#1976d2" : "#666",
borderRadius: "6px",
fontSize: "12px",
fontWeight: "600",
textTransform: "uppercase"
}}>
{click.tracking_type || "N/A"}
</span>
</td>
<td style={tableCellStyle}>
<span style={{ fontSize: "13px", color: "#495057" }}>
{click.created_at ?
new Date(click.created_at).toLocaleString('en-US', {
year: 'numeric',
month: 'short',
day: 'numeric',
hour: '2-digit',
minute: '2-digit'
}) :
"N/A"}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
) : (
<div style={{
backgroundColor: "white",
borderRadius: "12px",
boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
padding: "60px 20px",
textAlign: "center"
}}>
<div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
<p style={{ color: "#6c757d", fontSize: "16px", margin: 0 }}>
{activeFiltersCount > 0
? "No clicks match your filters"
: "No clicks recorded yet"}
</p>
</div>
)}

  <style>{`
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}</style>
</div>

);
};
// Table Styles
const tableHeaderStyle = {
padding: "16px 12px",
textAlign: "left",
fontWeight: "700",
borderBottom: "2px solid #dee2e6",
color: "#2c3e50",
fontSize: "13px",
textTransform: "uppercase",
letterSpacing: "0.5px",
backgroundColor: "#f8f9fa"
};
const tableCellStyle = {
padding: "14px 12px",
color: "#212529",
verticalAlign: "middle",
fontSize: "14px"
};
export default Clicks;