import { useState } from "react";

const EditMedicineCard = ({ medicine, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    stock: medicine.stock,
    price: medicine.price,
    description: medicine.description,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2>Edit Medicine</h2>

        <label>Stock</label>
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
        />

        <label>Price</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <div style={styles.actions}>
          <button onClick={() => onUpdate(medicine, form)} style={styles.save}>
            Update
          </button>
          <button onClick={onClose} style={styles.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicineCard;

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  save: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
  },
  cancel: {
    background: "#e5e7eb",
    border: "none",
    padding: "6px 14px",
  },
};
