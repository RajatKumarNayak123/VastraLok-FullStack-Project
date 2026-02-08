import React, { useState } from "react";
import api from "../axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrderSuccessPage from "../pages/OrderSuccessPage"; // ✅ Imported

const PaymentButton = ({ amount, cartItems, userDetails, onSuccess }) => {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);

  const handlePayment = async () => {
    try {
      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded.");
        return;
      }

      // ✅ Create order on backend
      const { data: orderData } = await api.post("/api/orders/create", {
        amount,
        cartItems,
        ...userDetails,
      });

      // ✅ Configure Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "ShopZone",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const token = localStorage.getItem("token");

            const verifyRes = await api.post(
              "/api/orders/payment/success",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
               document.body.style.overflow = "auto";
              toast.success("✅ Order placed successfully!");
              localStorage.removeItem("cart");
              onSuccess && onSuccess();

              // ✅ Redirect to OrderSuccessPage
              const orderId = verifyRes.data.orderId;
              navigate("/order-success", { state: { orderId } });
            } else {
              toast.error("❌ " + verifyRes.data.message);
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("❌ Payment verification failed");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: { color: "#006e65" },

         // ⭐ This fixes scroll freeze forever  
  modal: {
    ondismiss: function () {
      document.body.style.overflow = "auto";
    }
  }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      toast.error("❌ Failed to create order");
    }
  };

  const handleFeedbackSubmit = () => {
    navigate("/orders");
  };

  return (
    <>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          backgroundColor: "#006e65",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Pay ₹{amount}
      </button>

      {/* 
      Optional: feedback popup feature (disabled for now)
      {showFeedback && (
        <FeedbackPopup
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )} 
      */}
    </>
  );
};

export default PaymentButton;
