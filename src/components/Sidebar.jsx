const Sidebar = ({ activeTab, setActiveTab }) => {
  const menu = [
    { key: "summary", label: "Dashboard" },
    { key: "users", label: "Users" },
    { key: "medicines", label: "Medicines" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div style={styles.sidebar}>
      {menu.map((item) => (
        <div
          key={item.key}
          onClick={() => setActiveTab(item.key)}
          style={{
            ...styles.item,
            background: activeTab === item.key ? "#2563eb" : "transparent",
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    background: "#020617",
    color: "#fff",
    paddingTop: "20px",
  },
  item: {
    padding: "12px 20px",
    cursor: "pointer",
  },
};

export default Sidebar;
