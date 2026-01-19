import { useEffect, useState } from "react";

const Navbar = ({ onCreate, onLogout }) => {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div style={styles.navbar}>
      <h2 style={styles.title}>💊 Medical Store Admin</h2>

      <div style={styles.actions}>
        <button onClick={onCreate} style={styles.create}>
          + Create
        </button>


        <button onClick={onLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    height: "60px",
    background: "var(--header)",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid var(--border)",
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  create: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  mode: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logout: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Navbar;
