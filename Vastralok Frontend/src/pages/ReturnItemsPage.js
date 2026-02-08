 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import "./ReturnItemsPage.css";

const ReturnItemsPage = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Fetch logged-in user's return items
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setError("");
        const res = await api.get("/api/returns");
        setReturns(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load return items");
        setReturns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="return-page">
      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>🔁 My Return Items</h2>

      {/* Loading */}
      {loading && <p>⏳ Loading return items...</p>}

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Empty State */}
      {!loading && !error && returns.length === 0 && (
        <p>No return requests found.</p>
      )}

      {/* Returns Grid */}
      <div className="return-grid">
  {returns.map((item) => (
    <div className="return-card" key={item.returnId}>

      {/* Product Image */}
      <img
        src={item.imgUrl}
        alt={item.productName}
        className="return-img"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/120";
        }}
      />
      <p><b>Return Id:</b>{item.returnId}</p>
      <p><b>Product Name:</b>{item.productName}</p>
      <p><b>Order ID:</b> {item.orderId}</p>
      <p><b>Product ID:</b> {item.productId}</p>
      <p><b>Quantity:</b> {item.quantity}</p>

      <p>
        <b>Status:</b>{" "}
        <span className={`status ${item.status?.toLowerCase()}`}>
          {item.status}
        </span>
      </p>

      <p><b>Reason:</b> {item.reason}</p>

      <p>
        <b>Return Applied On:</b><br />
        {item.createdAt ? formatDateTime(item.createdAt) : "—"}
      </p>

    </div>
  ))}
</div>

    </div>
  );
};

export default ReturnItemsPage;