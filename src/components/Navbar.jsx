// Navbar.jsx
import React from "react";

const Navbar = ({ onLogout }) => {
  const styles = {
    navbar: {
      height: "60px",
      backgroundColor: "#fff",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    title: { fontSize: "22px", fontWeight: 600, color: "#1f2937" },
    button: {
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background 0.2s",
    },
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.title}>Medical Store Admin</div>
      <button
        style={styles.button}
        onClick={onLogout}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
