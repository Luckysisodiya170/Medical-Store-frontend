import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "./Datatable";
import {
  usersData,
  medicinesData,
  ordersData
} from "../Data/dummyData";

const CommonList = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    loadDummyData();
  }, [type]);

  const loadDummyData = () => {
    if (type === "users") {
      setData(usersData);
      setColumns([
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" }
      ]);
    }

    if (type === "medicines") {
      setData(medicinesData);
      setColumns([
        { key: "name", label: "Medicine Name" },
        { key: "price", label: "Price" },
        { key: "stock", label: "Stock" }
      ]);
    }

    if (type === "orders") {
      setData(ordersData);
      setColumns([
        { key: "orderId", label: "Order ID" },
        { key: "total", label: "Total Amount" },
        { key: "status", label: "Status" }
      ]);
    }
  };

  return (
    <div>
      <h2>{type.toUpperCase()} LIST</h2>

      <DataTable
        columns={columns}
        data={data}
        onDelete={(id) =>
          setData((prev) => prev.filter((item) => item._id !== id))
        }
        onUpdate={(id) =>
          alert(`Update clicked for ${id}`)
        }
      />
    </div>
  );
};

export default CommonList;
