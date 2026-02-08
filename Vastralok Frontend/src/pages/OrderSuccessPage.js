// src/pages/OrderSuccessPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../axiosConfig";
import "./OrderSuccessPage.css";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

const OrderSuccessPage = ({ orderId: propOrderId, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = propOrderId || location.state?.orderId;

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
   
const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // 5 seconds baad confetti band ho jayega
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orderId) {
      toast.error("No order ID found!");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setOrderDetails(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch order details:", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleRating = (value) => setRating(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    console.log("📝 Feedback submitted:", { rating, feedback });
    toast.success("Feedback submitted successfully!");

    setTimeout(() => {
      if (onClose) onClose();
      navigate("/orders");
    }, 2500);
  };

  if (loading)
    return (
      <div className="popup-overlay">
        <div className="order-success-container">
          <p className="loading">Loading order details...</p>
        </div>
      </div>
    );

  if (!orderId || !orderDetails)
    return (
      <div className="popup-overlay">
        <div className="order-success-container">
          <h2>❌ No order found!</h2>
          <button className="submit-btn" onClick={() => navigate("/shop")}>
            Go to Shop
          </button>
        </div>
      </div>
    );

  return (
    <div className="popup-overlay">
      <AnimatePresence>
        <motion.div
          className="order-success-container"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <button
  className="close-btn"
  onClick={() => {
    if (onClose) onClose();
    navigate("/orders");
  }}
>
  ✖
</button>

          {!submitted ? (
            <>
             {showConfetti && <Confetti />}
              <h2 className="success-text">🎉 Order Placed Successfully!</h2>
              <p className="thanks-text">
                Thank you for shopping with <strong>Vastraloka</strong> 💖
              </p>

              <div className="order-details">
                <h3>Order Summary</h3>
                <p>
                  <strong>Order ID:</strong> {orderDetails.orderId}
                </p>
                <p>
                  <strong>Status:</strong> {orderDetails.status}
                </p>

                <div className="order-items-scroll">
  <ul>
    {orderDetails.items?.map((item) => (
      <li key={item.productId}>
        {item.productName} × {item.quantity} = ₹
        {item.price * item.quantity}
      </li>
    ))}
  </ul>
</div>


                <p>
                  <strong>Total Amount:</strong> ₹{orderDetails.totalAmount}
                </p>
              </div>

              <div className="feedback-section">
                <h3>How was your experience?</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= rating ? "star selected" : "star"}
                      onClick={() => handleRating(star)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>

                <textarea
                  placeholder="Write your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                ></textarea>

                <button className="submit-btn" onClick={handleSubmit}>
                  Submit Feedback
                </button>
              </div>
            </>
          ) : (
            <motion.div
              className="thankyou-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2>❤️ Thank you for your feedback!</h2>
              <p>Redirecting to your orders...</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OrderSuccessPage;
