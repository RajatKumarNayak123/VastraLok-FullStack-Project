import React, { useEffect, useState } from "react";
import "./MyReturnsPage.css"
import api from "../axiosConfig";

const MyReturnsPage = () => {
  const [returns, setReturns] = useState([]);
   const isAdmin = true; // later role JWT se aayega

  const userId = 1; // later JWT se niklega

  useEffect(() => {
    api.get(`/api/returns/user/${userId}`)
      .then(res => setReturns(res.data))
      .catch(() => alert("Failed to load returns"));
  }, []);


  const approveReturn = (returnId) => {
  api.put(`/api/returns/${returnId}/approve`)
    .then(() => {
      setReturns(prev =>
        prev.map(r =>
          r.id === returnId ? { ...r, status: "APPROVED" } : r
        )
      );
    })
    .catch(() => alert("Approve failed"));
};

const rejectReturn = (returnId) => {
  api.put(`/api/returns/${returnId}/reject`)
    .then(() => {
      setReturns(prev =>
        prev.map(r =>
          r.id === returnId ? { ...r, status: "REJECTED" } : r
        )
      );
    })
    .catch(() => alert("Reject failed"));
};

  const pendingReturns = returns.filter(r => r.status === "REQUESTED");
  const historyReturns = returns.filter(r => r.status !== "REQUESTED");

  return (
    <div style={{ padding: "20px" }}>
  <h2>My Return Items</h2>

  {returns.length === 0 && <p>No return items yet</p>}

  {/* 🔥 ADMIN – Pending Approvals */}
  {isAdmin && pendingReturns.length > 0 && (
    <>
      <h3 style={{ marginTop: "20px", color: "#b45309" }}>
        🟡 Pending Approvals ({pendingReturns.length})
      </h3>

      {pendingReturns.map(item => (
        <div key={item.id} className="return-card">
          <p><b>Order ID:</b> {item.orderId}</p>
          <p><b>Product ID:</b> {item.productId}</p>
          <p><b>Reason:</b> {item.reason}</p>
          <p><b>Status:</b> {item.status}</p>

          <button onClick={() => approveReturn(item.id)}>
            ✅ Approve
          </button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => rejectReturn(item.id)}
          >
            ❌ Reject
          </button>
        </div>
      ))}
    </>
  )}

  {/* 📜 HISTORY */}
  <h3 style={{ marginTop: "30px" }}>📜 Return History</h3>

  {historyReturns.length === 0 && <p>No history yet</p>}

  {historyReturns.map(item => (
    <div key={item.id} className="return-card">
      <p><b>Order ID:</b> {item.orderId}</p>
      <p><b>Product ID:</b> {item.productId}</p>
      <p><b>Reason:</b> {item.reason}</p>
      <p>
        <b>Status:</b>{" "}
        <span
          style={{
            color:
              item.status === "APPROVED"
                ? "green"
                : item.status === "REJECTED"
                ? "red"
                : "black"
          }}
        >
          {item.status}
        </span>
      </p>
    </div>
  ))}
</div>

  );
};

export default MyReturnsPage;
