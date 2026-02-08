import { useNavigate } from "react-router-dom";
import { useState } from "react";

function OrdersNavbar({ onStatusChange }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("ALL");

  const handleChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    onStatusChange(value); // parent ko batayenge
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 30px",
        backgroundColor: "#139277ff",
        color: "#fff"
      }}
    >
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 14px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#fff",
          color: "#139277ff",
          fontWeight: "bold"
        }}
      >
        ← Back
      </button>

      {/* 🔽 Status Dropdown */}
      <select
        value={status}
        onChange={handleChange}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "none",
          fontSize: "14px",
          fontWeight: "bold"
        }}
      >
        <option value="ALL">All</option>
        <option value="COMPLETED">Completed</option>
        <option value="DELIVERED">Delivered</option>
        <option value="PENDING">Pending</option>
      </select>

      {/* Empty spacer (for symmetry) */}
      <div style={{ width: "80px" }}></div>
    </nav>
  );
}

export default OrdersNavbar;
