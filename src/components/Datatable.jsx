const Datatable = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0)
    return <p style={{ padding: "16px" }}>No data found</p>;

  const columns = Object.keys(data[0]);

  const isImage = (key, value) =>
    key.toLowerCase().includes("image") ||
    (typeof value === "string" &&
      (value.endsWith(".jpg") || value.endsWith(".png")));

  const isOrderRow = (row) => "status" in row;
  const isUserRow = (row) => "isActive" in row;
  const isMedicineRow = (row) => "stock" in row && "price" in row;

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={styles.th}>
                {col}
              </th>
            ))}
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} style={styles.tr}>
              {columns.map((col) => (
                <td key={col} style={styles.td}>
                  {isImage(col, row[col]) ? (
                    <img
                      src={`https://medical-store-production.up.railway.app/uploads/${row[col]}`}
                      alt=""
                      style={styles.img}
                    />
                  ) : (
                    <span>{String(row[col])}</span>
                  )}
                </td>
              ))}

              {/* ACTIONS */}
              <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                {/* ORDER */}
                {isOrderRow(row) && (
                  <select
                    value={row.status}
                    onChange={(e) =>
                      onEdit(row, { status: e.target.value })
                    }
                    style={styles.select}
                  >
                    <option>Pending</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                )}

                {/* USER */}
                {isUserRow(row) && (
                  <button
                    onClick={() =>
                      onEdit(row, { isActive: !row.isActive })
                    }
                    style={{
                      ...styles.toggle,
                      background: row.isActive ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {row.isActive ? "Active" : "Inactive"}
                  </button>
                )}

                {/* MEDICINE */}
                {isMedicineRow(row) && (
                  <div style={styles.actionGroup}>
                    <button
                      onClick={() => onEdit(row)}
                      style={styles.edit}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(row)}
                      disabled={row.stock === 0}
                      style={{
                        ...styles.delete,
                        opacity: row.stock === 0 ? 0.4 : 1,
                        cursor: row.stock === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ===================== STYLES ===================== */

const styles = {
  wrapper: {
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    overflowX: "auto",
    marginTop: "16px",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: "14px",
  },

  th: {
    background: "#020617",
    color: "#ffffff",
    padding: "12px",
    textAlign: "left",
    fontWeight: 600,
    borderBottom: "1px solid #1e293b",
  },

  tr: {
    transition: "background 0.2s ease",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#0f172a",
    verticalAlign: "middle",
  },

  img: {
    width: "42px",
    height: "42px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  },

  actionGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  edit: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },

  delete: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
  },

  select: {
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #cbd5f5",
    background: "#fff",
    cursor: "pointer",
  },

  toggle: {
    color: "#ffffff",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    cursor: "pointer",
  },
};

export default Datatable;
