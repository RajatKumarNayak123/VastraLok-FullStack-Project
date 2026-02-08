// ✅ src/components/Checkout.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../axiosConfig";
import loadRazorpay from "../utils/loadRazorpay";

const Checkout = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    village: "",
    street: "",
    town: "",
    ps: "",
    dist: "",
    pincode: "",
  });

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Cart Items
  useEffect(() => {
    api
      .get("/api/cart/all", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => setCart(res.data))
      .catch((err) => {
        console.error("❌ Cart fetch failed:", err);
        toast.error("Failed to load cart");
      });
  }, []);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Payment + Order Placement
  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error("❌ Cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const amount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // ✅ Step 1: Create Razorpay Order on Backend
      const { data: order } = await api.post(
        "/api/orders/create",
        { ...formData, cartItems: cart, amount },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );

      if (!order || !order.orderId) {
        toast.error("❌ Failed to create order");
        return;
      }

      await loadRazorpay();

      const razorpayKey =
        process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_RLrReUiS0qR4KI"; // test key fallback
      if (!razorpayKey) {
        toast.error("❌ Razorpay key missing in .env");
        return;
      }

      // ✅ Step 2: Open Razorpay Payment Window
      const options = {
        key: razorpayKey,
        amount: order.amount, // backend already returns correct amount
        currency: "INR",
        name: "VastraLok",
        description: "Order Payment",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // ✅ Step 3: Verify Payment on Backend
            const verifyRes = await api.post(
              "/api/orders/payment/success",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              }
            );

            if (verifyRes.data.success) {
              // ✅ Step 4: Place Order (Backend clears cart)
              await api.post(
                "/api/orders/place",
                {},
                {
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                }
              );

              // ✅ Step 5: Clear cart on frontend
              setCart([]);

              // ✅ Step 6: Success toast
              toast.success("✅ Order Placed Successfully!");

              // ✅ Step 7: Redirect to OrderSuccessPage
              const orderId = verifyRes.data.orderId || order.orderId;
              setTimeout(() => {
                navigate("/order-success", { state: { orderId } });
              }, 2000);
            } else {
              toast.error("❌ Payment verification failed!");
            }
          } catch (err) {
            console.error("❌ Payment verification failed:", err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#006e65" },
        modal: {
          ondismiss: () => {
            toast.warn("Payment cancelled by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment Error:", err);
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      {/* Address Form */}
      <div className="space-y-3">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="w-full border px-3 py-2 rounded"
          />
        ))}
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-5 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {loading ? "Processing..." : `Pay ₹${totalPrice}`}
      </button>
    </div>
  );
};

export default Checkout;
