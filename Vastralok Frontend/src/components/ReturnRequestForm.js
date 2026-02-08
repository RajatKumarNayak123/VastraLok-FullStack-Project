import React, { useState } from "react";
import api from "../axiosConfig";
import { toast } from "react-toastify";

function ReturnRequestForm({ product, onClose }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Please enter return reason");
      return;
    }

    // ✅ CORRECT DATA (NO items[])
    const returnData = {
       userId: product.userId,
       orderId: product.orderId,
       productId: product.productId,
       quantity: product.quantity,
       reason: reason
    };

    try {
      setLoading(true);

      await api.post("/api/returns", returnData);

      toast.success("Return request submitted successfully");
      setReason("");
      onClose();
    } catch (error) {
      console.log("FULL ERROR 👉", error);
      console.log("RESPONSE 👉", error.response);
      console.log("DATA 👉", error.response?.data);
      console.error(error);
      toast.error("Failed to submit return request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="return-form">
      <h3>🔁 Return Product</h3>

      <p><b>Product:</b> {product.productName}</p>
      <p><b>Quantity:</b> {product.quantity}</p>

      <form onSubmit={handleSubmit}>
        <label>Reason for Return</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter return reason"
          rows="4"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Return"}
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReturnRequestForm;
