import { useEffect, useState } from "react";
import api from "../api/axios";

const Conversions = ({ setCount }) => {
  const [conversions, setConversions] = useState([]);
  const [filteredConversions, setFilteredConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    clickid: "",
    click_id: "",
    status: "",
    source: "",
    dateFrom: "",
    dateTo: ""
  });

  useEffect(() => {
    fetchConversions();
  }, []);

  const fetchConversions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/conversions");
      setConversions(res.data);
      setFilteredConversions(res.data);
      if (setCount) setCount(res.data.length);
    } catch (error) {
      console.error("Error fetching conversions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time filtering
  useEffect(() => {
    let filtered = [...conversions];

    if (filters.clickid) {
      filtered = filtered.filter(conv => 
        conv.clickid?.toLowerCase().includes(filters.clickid.toLowerCase())
      );
    }

    // if (filters.click_id) {
    //   filtered = filtered.filter(conv => 
    //     conv.click_id?.toLowerCase().includes(filters.click_id.toLowerCase())
    //   );
    // }

    if (filters.status) {
      filtered = filtered.filter(conv => 
        conv.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.source) {
      filtered = filtered.filter(conv => 
        conv.source?.toLowerCase().includes(filters.source.toLowerCase())
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(conv => 
        new Date(conv.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(conv => 
        new Date(conv.created_at) <= endDate
      );
    }

    setFilteredConversions(filtered);
  }, [filters, conversions]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      clickid: "",
      click_id: "",
      status: "",
      source: "",
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
            Total Conversions
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: "36px", 
            fontWeight: "700", 
            color: "#27ae60" 
          }}>
            {filteredConversions.length}
          </p>
          {activeFiltersCount > 0 && (
            <p style={{ 
              margin: "8px 0 0 0", 
              fontSize: "13px", 
              color: "#95a5a6" 
            }}>
              Filtered from {conversions.length} total
            </p>
          )}
        </div>

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          style={{
            padding: "12px 24px",
            backgroundColor: filterOpen ? "#e74c3c" : "#27ae60",
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
          {/* <span style={{ fontSize: "18px" }}>🔍</span> */}
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
                Filter Conversions
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
                  Click ID (clickid)
                </label>
                <input
                  type="text"
                  placeholder="Search by clickid..."
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
                  onFocus={(e) => e.target.style.borderColor = "#27ae60"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Click_ID Filter */}
              {/* <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Click_ID
                </label>
                <input
                  type="text"
                  placeholder="Search by click_id..."
                  value={filters.click_id}
                  onChange={(e) => handleFilterChange("click_id", e.target.value)}
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
                  onFocus={(e) => e.target.style.borderColor = "#27ae60"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                />
              </div> */}

              {/* Status Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
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
                  onFocus={(e) => e.target.style.borderColor = "#27ae60"}
                  onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2c3e50"
                }}>
                  Source
                </label>
                <input
                  type="text"
                  placeholder="Search by source..."
                  value={filters.source}
                  onChange={(e) => handleFilterChange("source", e.target.value)}
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
                  onFocus={(e) => e.target.style.borderColor = "#27ae60"}
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
                  onFocus={(e) => e.target.style.borderColor = "#27ae60"}
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
                  onFocus={(e) => e.target.style.borderColor = "#27ae60"}
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
            borderTop: "4px solid #27ae60",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ color: "#6c757d", fontSize: "16px" }}>Loading conversions...</p>
        </div>
      ) : filteredConversions.length > 0 ? (
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
                <th style={tableHeaderStyle}>Commission</th>
                <th style={tableHeaderStyle}>Total Sale</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Postback Payload</th>
                <th style={tableHeaderStyle}>Order ID</th>
                <th style={tableHeaderStyle}>Source</th>
                <th style={tableHeaderStyle}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversions.map((conversion, index) => (
                <tr 
                  key={conversion._id || index} 
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
                      {conversion.clickid || "N/A"}
                    </code>
                  </td>
                  <td style={tableCellStyle}>
                    <code style={{ 
                      fontSize: "12px", 
                      backgroundColor: "#e3f2fd",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "500",
                      color: "#1976d2"
                    }}>
                      {conversion.commission || "N/A"}
                    </code>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      fontWeight: "700",
                      color: "#27ae60",
                      fontSize: "15px"
                    }}>
                      {conversion.payout || "0.00"}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: "6px 12px",
                      backgroundColor: conversion.status === "approved" ? "#d4edda" : 
                                     conversion.status === "pending" ? "#fff3cd" : "#f8d7da",
                      color: conversion.status === "approved" ? "#155724" : 
                             conversion.status === "pending" ? "#856404" : "#721c24",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase"
                    }}>
                      {conversion.status || "N/A"}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <code style={{ 
                      fontSize: "11px",
                      backgroundColor: "#f8f9fa",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "block",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                    title={conversion.postback_payload}
                    >
                      {conversion.postback_payload || "N/A"}
                    </code>
                  </td>
                  <td style={tableCellStyle}>
                    {conversion.order_id || 
                      <span style={{ color: "#6c757d" }}>null</span>}
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: "6px 12px",
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {conversion.source || "N/A"}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: "13px", color: "#495057" }}>
                      {conversion.created_at ? 
                        new Date(conversion.created_at).toLocaleString('en-US', {
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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💰</div>
          <p style={{ color: "#6c757d", fontSize: "16px", margin: 0 }}>
            {activeFiltersCount > 0 
              ? "No conversions match your filters" 
              : "No conversions recorded yet"}
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

export default Conversions;