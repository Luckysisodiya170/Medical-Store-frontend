import { useState, useEffect } from "react";

/* ===================== FIELD ===================== */
const Field = ({
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  inputProps = {},
}) => (
  <div style={styles.field}>
    <label style={styles.label}>{placeholder}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      {...inputProps}
      style={{
        ...styles.input,
        borderColor: error ? "#dc2626" : "#cbd5f5",
      }}
      placeholder={placeholder}
    />
    {error && <span style={styles.error}>{error}</span>}
  </div>
);

/* ===================== FILE FIELD ===================== */
const FileField = ({ label, onChange, error }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      onChange={onChange}
      style={styles.file}
    />
    {error && <span style={styles.error}>{error}</span>}
  </div>
);

/* ===================== CREATE FORM ===================== */
const CreateForm = ({ onClose, onSubmit }) => {
  const [type, setType] = useState("");
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  /* ===== ORDER STATES ===== */
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  /* ===== FETCH USERS ===== */
  useEffect(() => {
    if (type !== "order") return;

    fetch("https://medical-store-production.up.railway.app/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .catch(console.error);
  }, [type]);

  /* ===== FETCH MEDICINES ===== */
  useEffect(() => {
    if (type !== "order") return;

    fetch("https://medical-store-production.up.railway.app/api/medicines", {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((r) => r.json())
      .then(setMedicines)
      .catch(console.error);
  }, [type]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  /* ===== CHANGE HANDLER ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    if (["name", "manufacturer"].includes(name) && !/^[a-zA-Z\s]*$/.test(value))
      return;

    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* ===== FILE ===== */
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Optional validation
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    setErrors((p) => ({ ...p, image: "Only JPG/PNG allowed" }));
    return;
  }

  // ✅ STORE ONLY FILE NAME (STRING)
  setForm((p) => ({
    ...p,
    image: file.name,
  }));

  setErrors((p) => ({ ...p, image: "" }));
};


  /* ===== ADD ITEM ===== */
  const addItem = () => {
    if (!selectedMedicine || !form.quantity) return;

    if (Number(form.quantity) > selectedMedicine.stock) {
      setErrors({ quantity: "Quantity exceeds stock" });
      return;
    }

    const updated = [
      ...orderItems,
      {
          medicineId: selectedMedicine.id,          // ✅ needed for update
  medicineName: selectedMedicine.name,
  quantity: Number(form.quantity),
  price: selectedMedicine.price,
  currentStock: selectedMedicine.stock,     // ✅ needed for calc
      },
    ];

    setOrderItems(updated);

    setForm((p) => ({
      ...p,
      quantity: "",
      totalAmount: updated.reduce(
        (s, i) => s + i.quantity * i.price,
        0
      ),
    }));
  };

  /* ===== VALIDATION ===== */
  const validate = () => {
    const e = {};

if (type === "user") {
  if (!form.name) e.name = "Name required";
  if (!/\S+@\S+\.\S+/.test(form.email || ""))
    e.email = "Invalid email";
  if (!form.phone || form.phone.length !== 10)
    e.phone = "10 digit phone required";
  if (!form.image)
    e.image = "Profile image required";
}


    if (type === "medicine") {
      if (!form.name) e.name = "Medicine name required";
      if (!form.description || form.description.length < 5)
        e.description = "Min 5 chars";
      if (Number(form.stock) < 0) e.stock = "Invalid stock";
      if (Number(form.price) <= 0) e.price = "Invalid price";
    }

    if (type === "order") {
      if (!form.userId) e.userId = "Select a user";
      if (orderItems.length === 0) e.items = "Add medicines";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ===== SUBMIT ===== */
const handleSubmit = () => {
  if (!validate()) return;

  if (type === "order") {
    onSubmit("order", {
      userId: form.userId,
      totalAmount: form.totalAmount,
      items: orderItems,
    });
    return;
  }

  // USER & MEDICINE → JSON ONLY
  onSubmit(type, form);
};


  /* ===== RENDER ===== */
const renderFields = () => {
  /* ================= USER ================= */
if (type === "user") {
  return (
    <>
      <Field
        name="name"
        placeholder="Full Name"
        value={form.name || ""}
        onChange={handleChange}
        error={errors.name}
      />

      <Field
        name="email"
        placeholder="Email"
        value={form.email || ""}
        onChange={handleChange}
        error={errors.email}
      />

      <Field
        name="phone"
        placeholder="Phone (10 digits)"
        value={form.phone || ""}
        onChange={handleChange}
        error={errors.phone}
        inputProps={{ maxLength: 10 }}
      />

      {/* FILE SELECT (UX ONLY) */}
      <FileField
        label="Profile Image"
        onChange={handleFileChange}
        error={errors.image}
      />

      {/* SHOW SELECTED FILE NAME */}
      {form.image && (
        <small style={{ color: "#475569" }}>
          Selected: {form.image}
        </small>
      )}
    </>
  );
}

  /* ================= MEDICINE ================= */
if (type === "medicine") {
  return (
    <>
      {/* MEDICINE NAME */}
      <Field
        name="name"
        placeholder="Medicine Name"
        value={form.name || ""}
        onChange={handleChange}
        error={errors.name}
      />

      {/* DESCRIPTION */}
      <Field
        name="description"
        placeholder="Description"
        value={form.description || ""}
        onChange={handleChange}
        error={errors.description}
      />

      {/* MANUFACTURER */}
      <Field
        name="manufacturer"
        placeholder="Manufacturer"
        value={form.manufacturer || ""}
        onChange={handleChange}
        error={errors.manufacturer}
      />

      {/* CATEGORY (OPTIONAL) */}
      <Field
        name="category"
        placeholder="Category (Painkiller, Antibiotic etc.)"
        value={form.category || ""}
        onChange={handleChange}
      />

      {/* BATCH NUMBER */}
      <Field
        name="batch_no"
        placeholder="Batch Number"
        value={form.batch_no || ""}
        onChange={handleChange}
      />

      {/* MFG & EXPIRY */}
      <div style={{ display: "flex", gap: 12 }}>
        <Field
          name="mfg_date"
          type="date"
          placeholder="MFG Date"
          value={form.mfg_date || ""}
          onChange={handleChange}
          error={errors.mfg_date}
        />

        <Field
          name="expiry_date"
          type="date"
          placeholder="Expiry Date"
          value={form.expiry_date || ""}
          onChange={handleChange}
          error={errors.expiry_date}
        />
      </div>

      {/* STOCK & PRICE */}
      <div style={{ display: "flex", gap: 12 }}>
        <Field
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock || ""}
          onChange={handleChange}
          error={errors.stock}
        />

        <Field
          name="price"
          type="number"
          placeholder="Price ₹"
          value={form.price || ""}
          onChange={handleChange}
          error={errors.price}
        />
      </div>

      {/* IMAGE NAME */}
      <Field
        name="image"
        placeholder="Image File Name (example: paracetamol.jpg)"
        type="file"
        value={form.image || ""}
        onChange={handleChange}
        error={errors.image}
      />
    </>
  );
}

  /* ================= ORDER ================= */
  if (type === "order") {
    return (
      <>
        {/* USER SEARCH */}
        <div style={{ ...styles.field, position: "relative" }}>
          <label style={styles.label}>Search User</label>
          <input
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setShowUserDropdown(true);
            }}
            style={styles.input}
            placeholder="Type user name"
          />

          {showUserDropdown && userSearch && (
            <div style={styles.dropdown}>
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  style={styles.dropdownItem}
                  onClick={() => {
                    setForm((p) => ({ ...p, userId: u.id }));
                    setUserSearch(u.name);
                    setShowUserDropdown(false);
                    setErrors((p) => ({ ...p, userId: "" }));
                  }}
                >
                  <b>{u.name}</b>
                  <div style={{ fontSize: 12 }}>{u.email}</div>
                </div>
              ))}
            </div>
          )}

          {errors.userId && <span style={styles.error}>{errors.userId}</span>}
        </div>

        {/* MEDICINE SELECT */}
        <div style={styles.field}>
          <label style={styles.label}>Medicine</label>
          <select
            style={styles.select}
            onChange={(e) =>
              setSelectedMedicine(
                medicines.find((m) => m.id === e.target.value)
              )
            }
          >
            <option value="">Choose</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (₹{m.price}, stock {m.stock})
              </option>
            ))}
          </select>
        </div>

        <Field
          name="quantity"
          placeholder="Quantity"
          type="number"
          value={form.quantity || ""}
          onChange={handleChange}
          error={errors.quantity}
        />

        <button onClick={addItem} style={styles.addBtn}>
          + Add Item
        </button>

        {orderItems.map((i, idx) => (
          <div key={idx} style={styles.itemRow}>
            {i.medicineName} × {i.quantity} = ₹{i.quantity * i.price}
          </div>
        ))}

        <Field
          name="totalAmount"
          placeholder="Total Amount"
          type="number"
          value={form.totalAmount || ""}
          onChange={() => {}}
        />

        {errors.items && <span style={styles.error}>{errors.items}</span>}
      </>
    );
  }

  /* ================= DEFAULT ================= */
  return (
    <div style={{ textAlign: "center", color: "#64748b" }}>
      Select what you want to create
    </div>
  );
};

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Create New</h2>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setForm({});
            setOrderItems([]);
            setErrors({});
          }}
          style={styles.select}
        >
          <option value="">Choose</option>
          <option value="user">User</option>
          <option value="medicine">Medicine</option>
          <option value="order">Order</option>
        </select>

        {renderFields()}

        <div style={styles.actions}>
          <button onClick={handleSubmit} style={styles.submit}>
            Create
          </button>
          <button onClick={onClose} style={styles.cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;

/* ===== STYLES ===== */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: 560,
    background: "#fff",
    padding: 24,
    borderRadius: 16,
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13 },
  input: { padding: 12, borderRadius: 10, border: "1px solid #cbd5f5" },
  select: { padding: 12, borderRadius: 10, border: "1px solid #cbd5f5" },
  dropdown: {
    position: "absolute",
    top: "100%",
    background: "#fff",
    width: "100%",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    maxHeight: 180,
    overflowY: "auto",
  },
  dropdownItem: { padding: 10, cursor: "pointer" },
  addBtn: { background: "#16a34a", color: "#fff", padding: 8 },
  itemRow: { fontSize: 14 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 10 },
  submit: { background: "#2563eb", color: "#fff", padding: "10px 22px" },
  cancel: { background: "#e5e7eb", padding: "10px 22px" },
  error: { color: "#dc2626", fontSize: 12 },
};
