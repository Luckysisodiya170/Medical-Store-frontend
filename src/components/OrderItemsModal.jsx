const OrderItemsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* HEADER */}
        <div style={styles.header}>
          <h3>Order Items</h3>
          <button onClick={onClose} style={styles.close}>✕</button>
        </div>

        {/* BODY */}
        <div style={styles.body}>
          {order.items.map((item, idx) => (
            <div key={idx} style={styles.item}>
              <div>
                <strong>{item.medicineName}</strong>
                <div style={styles.sub}>
                  Qty: {item.quantity} × ₹{item.price}
                </div>
              </div>
              <div style={styles.amount}>
                ₹{item.quantity * item.price}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <strong>Total: ₹{order.totalAmount}</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsModal;

/* ================= STYLES ================= */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    width: "420px",
    maxHeight: "80vh",
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 8,
  },
  close: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 0",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  sub: {
    fontSize: 12,
    color: "#64748b",
  },
  amount: {
    fontWeight: 600,
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10,
    textAlign: "right",
  },
};
