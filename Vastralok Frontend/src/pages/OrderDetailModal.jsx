import React from "react";
import "./OrderDetailModal.css";

function OrderDetailModal({ show, onClose, orderItem, order }) {
  if (!show || !orderItem || !order) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* Header */}
        <div className="modal-header">
          <h2>Order Details</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Product Section */}
        <div className="modal-section product-section">
          <img src={orderItem.imageUrl} alt={orderItem.productName} />
          <div className="product-info">
            <h3>{orderItem.productName}</h3>
            <p>Price: <span>₹{orderItem.price}</span></p>
            <p>Quantity: <span>{orderItem.quantity}</span></p>
            <p className="total">Total: ₹{orderItem.lineTotal}</p>
          </div>
        </div>

        {/* Divider */}
        <hr />

        {/* Order Info */}
        <div className="modal-section">
          <h4>Order Information</h4>
          <div className="info-grid">
            <p><strong>Order ID</strong><span>{order.orderId}</span></p>
            <p><strong>Status</strong><span className="status">{order.status}</span></p>
            <p><strong>Date</strong><span>{order.orderDate.substring(0, 10)}</span></p>
            <p><strong>Time</strong><span>{order.orderDate.substring(11, 19)}</span></p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="modal-section">
          <h4>Payment Details</h4>
          <div className="info-grid">
            <p><strong>Amount Paid</strong><span>₹{order.totalAmount}</span></p>
            <p><strong>Status</strong><span className="paid">PAID</span></p>
            <p><strong>Payment ID</strong><span>{order.razorpayPaymentId}</span></p>
          </div>
        </div>

        {/* Address */}
        <div className="modal-section">
          <h4>Delivery Address</h4>
          <div className="address-box">
            <p><strong>{order.name}</strong></p>
            <p>📞 {order.phone}</p>
            <p>
              {order.street}, {order.village}, {order.town},<br />
              {order.dist} - {order.pincode}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetailModal;
