// DataTable.jsx
import React from "react";

const DataTable = ({ columns, data, onEdit, onDelete }) => {
  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    th: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "#0f172a",
      color: "#fff",
      fontWeight: "600",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #e5e7eb",
    },
    btn: {
      padding: "6px 12px",
      marginRight: "6px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      color: "#fff",
    },
    editBtn: { backgroundColor: "#2563eb" },
    deleteBtn: { backgroundColor: "#dc2626" },
  };

  return (
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
          <tr key={row.id}>
            {columns.map((col) => (
              <td style={styles.td} key={col}>
                {row[col] instanceof Array
                  ? row[col].map((i) => i.medicineName + "(" + i.quantity + ")").join(", ")
                  : row[col]}
              </td>
            ))}
            <td style={styles.td}>
              <button
                style={{ ...styles.btn, ...styles.editBtn }}
                onClick={() => onEdit(row)}
              >
                Edit
              </button>
              <button
                style={{ ...styles.btn, ...styles.deleteBtn }}
                onClick={() => onDelete(row)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
