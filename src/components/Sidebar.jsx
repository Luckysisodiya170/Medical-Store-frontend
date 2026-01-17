// Sidebar.jsx
import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const styles = {
  
    sidebar: {
     float:"left",
      width: "220px",
      backgroundColor: "#1e293b",
      color: "#fff",
      padding: "40px",
      height: "100vh",
      margin: "0px 10px 0px 0px",
      fontFamily: "Arial, sans-serif",
    },
    title: { fontSize: "20px", fontWeight: "600", marginBottom: "30px" },
    item: {
      padding: "12px 0",
      cursor: "pointer",
      color: "#cbd5e1",
      transition: "all 0.2s",
    },
    active: { color: "#fff", fontWeight: "600" },
  };

  const tabs = ["summary", "users", "orders", "medicines"];

  return (
    <div style={styles.sidebar}>
      <div style={styles.title}>Admin Panel</div>
      {tabs.map((tab) => (
        <div
          key={tab}
          style={{
            ...styles.item,
            ...(activeTab === tab ? styles.active : {}),
          }}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
