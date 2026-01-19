import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Dashboard.css";
import Navbar from "../../components/Navbar";
import Datatable from "../../components/Datatable";
import CreateForm from "../../components/CreateForm";
import EditMedicineCard from "../../components/EditMedicineCard";

const BASE = "https://medical-store-production.up.railway.app";
const LOW_STOCK_LIMIT = 10;

const Dashboard = () => {
  const token = localStorage.getItem("adminToken");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  /* ===================== STATE ===================== */
  const [view, setView] = useState(null); // users | medicines | orders | low-stock
  const [summary, setSummary] = useState(null);

  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  /* ===================== SUMMARY ===================== */
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}/api/dashboard/summary`, { headers });
        const data = await res.json();
        setSummary(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  /* ===================== DATA FETCH ===================== */
  useEffect(() => {
    if (!view) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (view === "users") {
          const r = await fetch(`${BASE}/api/admin/users`, { headers });
          const d = await r.json();
          setUsers(d.users || []);
        }

        if (view === "medicines" || view === "low-stock") {
          const r = await fetch(`${BASE}/api/medicines`, { headers });
          const d = await r.json();
          setMedicines(Array.isArray(d) ? d : d.data || []);
        }

        if (view === "orders") {
          const r = await fetch(`${BASE}/api/admin/orders`, { headers });
          const d = await r.json();
          setOrders(d.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  /* ===================== DERIVED ===================== */
  const lowStockMedicines = medicines.filter(
    (m) => Number(m.stock) < LOW_STOCK_LIMIT
  );

  /* ===================== EDIT ===================== */
  const handleEdit = async (row, payload) => {
    // MEDICINE → OPEN UPDATE CARD
    if ("stock" in row && !payload) {
      setEditingMedicine(row);
      return;
    }

    let url = "";
    if ("status" in row) url = `${BASE}/api/admin/orders/${row.id}`;
    if ("isActive" in row) url = `${BASE}/api/admin/users/${row.id}`;

    try {
      setLoading(true);
      await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      toast.success("Updated successfully");
      setView(view);
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UPDATE MEDICINE ===================== */
  const updateMedicine = async (medicine, payload) => {
    try {
      setLoading(true);
      await fetch(`${BASE}/api/medicines/${medicine.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      toast.success("Medicine updated");
      setEditingMedicine(null);
      setView("medicines");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== DELETE ===================== */
  const handleDelete = async (row) => {
    if (!window.confirm("Delete this record?")) return;

    let url = "";
    if ("isActive" in row) url = `${BASE}/api/admin/users/${row.id}`;
    if ("stock" in row) url = `${BASE}/api/medicines/${row.id}`;

    try {
      setLoading(true);
      await fetch(url, { method: "DELETE", headers });
      toast.success("Deleted successfully");
      setView(view);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== CREATE ===================== */
  const handleCreate = async (type, payload) => {
    let url = "";
    if (type === "user") url = `${BASE}/api/admin/users`;
    if (type === "medicine") url = `${BASE}/api/medicines`;
    if (type === "order") url = `${BASE}/api/admin/orders`;

    try {
      setLoading(true);
      const isFormData = payload instanceof FormData;

      await fetch(url, {
        method: "POST",
        headers: isFormData ? { Authorization: `Bearer ${token}` } : headers,
        body: isFormData ? payload : JSON.stringify(payload),
      });

      toast.success("Created successfully");
      setShowCreate(false);
      setView(type + "s");
    } catch (err) {
      toast.error("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar
        onCreate={() => setShowCreate(true)}
        onLogout={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/";
        }}
      />

      <div className="main">
        <div className="content">

          {/* LOADING */}
          {loading && (
            <div className="loader-overlay">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}

          {/* ================= SUMMARY (ALWAYS VISIBLE) ================= */}
          {summary && (
            <div className="cards">
              <div onClick={() => setView("users")} className="card">
                Users<br /><strong>{summary.customers}</strong>
              </div>
              <div onClick={() => setView("medicines")} className="card">
                Medicines<br /><strong>{summary.medicines}</strong>
              </div>
              <div onClick={() => setView("orders")} className="card">
                Orders<br /><strong>{summary.orders}</strong>
              </div>
              <div onClick={() => setView("low-stock")} className="card">
                Low Stock<br /><strong>{summary.lowStockMedicines}</strong>
              </div>
            </div>
          )}

          {/* ================= TABLE SECTION ================= */}
          {!loading && view === "users" && (
            <Datatable data={users} onEdit={handleEdit} onDelete={handleDelete} />
          )}

          {!loading && view === "medicines" && (
            <Datatable
              data={medicines}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {!loading && view === "orders" && (
            <Datatable data={orders} onEdit={handleEdit} />
          )}

          {!loading && view === "low-stock" && (
            <>
              <h2 style={{ color: "#b91c1c" }}>
                ⚠ Low Stock Medicines (Below {LOW_STOCK_LIMIT})
              </h2>
              <Datatable
                data={lowStockMedicines}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}

          {/* ================= MODALS ================= */}
          {showCreate && (
            <CreateForm
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreate}
            />
          )}

          {editingMedicine && (
            <EditMedicineCard
              medicine={editingMedicine}
              onClose={() => setEditingMedicine(null)}
              onUpdate={updateMedicine}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
