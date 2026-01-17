import { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import DataTable from "../../components/Datatable";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  // Fetch dashboard summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://medical-store-production.up.railway.app/api/dashboard/summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setSummary(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://medical-store-production.up.railway.app/api/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.success) throw new Error("Failed to fetch users");
        setUsers(data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "users") fetchUsers();
  }, [activeTab, token]);

  const handleEdit = (row) => alert("Edit: " + row.name);
  const handleDelete = (row) => alert("Delete: " + row.name);

  const userColumns = ["name", "email", "phone", "isActive", "createdAt"];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      {/* <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}

      <div className="dashboard-main">
        {/* Navbar */}
        <Navbar onLogout={() => (window.location.href = "/")} />

        {loading && <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>}

        {!loading && summary && activeTab === "summary" && (
          <>
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <div className="card-grid">
              <div className="card users">
                <h3>Total Users</h3>
                <p>{summary.customers}</p>
              </div>

              <div className="card medicines">
                <h3>Total Medicines</h3>
                <p>{summary.medicines}</p>
              </div>

              <div className="card orders">
                <h3>Total Orders</h3>
                <p>{summary.orders}</p>
              </div>

              <div className="card low-stock">
                <h3>Low Stock Alerts</h3>
                <p>{summary.lowStockMedicines}</p>
              </div>
            </div>
          </>
        )}

        {!loading && activeTab === "users" && (
          <div style={{ padding: "20px" }}>
            <h2>Users Table</h2>
            <DataTable
              columns={userColumns}
              data={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {/* You can add other tabs like orders or medicines similarly */}
      </div>
    </div>
  );
};

export default Dashboard;
