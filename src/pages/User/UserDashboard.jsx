import React, { useEffect, useState } from "react";
import { getUserProperties } from "../../API/userApi";

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getUserProperties();
      setProperties(data);
      setError(null);
    } catch {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: "#1e293b",
        color: "#fff",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}>
        <h2 style={{ fontSize: 22, fontWeight: "bold" }}>Dashboard</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={navBtnStyle}>Your Properties</button>
          <button style={navBtnStyle}>Add New</button>
          <button style={navBtnStyle}>Settings</button>
          <button style={{ ...navBtnStyle, marginTop: 20, backgroundColor: "#ef4444" }}>Logout</button>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "40px 30px" }}>
        <h2 style={{ marginBottom: 30, fontSize: 26, color: "#1e293b" }}>Your Properties</h2>

        {loading ? (
          <p>Loading your properties...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : properties.length === 0 ? (
          <p style={{ color: "#555" }}>You haven't added any properties yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {properties.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={p.image || "https://via.placeholder.com/300x160?text=No+Image"}
                  alt={p.title}
                  style={{ height: 160, objectFit: "cover", width: "100%" }}
                />
                <div style={{ padding: "15px 20px", flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{p.title}</h3>
                  <p style={{ margin: "8px 0", color: "#666" }}>
                    Price: ${p.price}<br />
                    Location: {p.location}<br />
                    Status: {p.flat_status}
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={btnStyle}>Edit</button>
                    <button style={{ ...btnStyle, backgroundColor: "#ef4444" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const navBtnStyle = {
  padding: "10px 15px",
  borderRadius: 6,
  background: "#334155",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
};

const btnStyle = {
  flex: 1,
  padding: "8px 10px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  fontSize: 14,
  cursor: "pointer",
};

export default UserDashboard;
