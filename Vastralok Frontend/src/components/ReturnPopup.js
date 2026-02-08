import React, { useState } from "react";
import api from "../axiosConfig";
import "./ReturnPopup.css";

const ReturnPopup = ({ orderId, productId, userId, onClose }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReturn = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for return");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/returns", {
        userId,
        orderId,
        productId,
        quantity: 1,
        reason
      });

      alert("✅ Return request submitted successfully");
      onClose();
    } catch (error) {
      alert("❌ Failed to submit return");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="return-overlay">
      <div className="return-modal">
        <h3>Return Item</h3>

        <textarea
          placeholder="Reason for return..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="return-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={submitReturn} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnPopup;
