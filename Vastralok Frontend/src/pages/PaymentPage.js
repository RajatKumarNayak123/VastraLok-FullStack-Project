// src/pages/PaymentPage.js
import React, { useEffect, useState } from "react";
import Checkout from "../components/Checkout";
import api from "../axiosConfig"; // Use your configured axios
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentPage = ({ cart, setCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch cart items and user info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart from backend
        const cartRes = await api.get("/api/cart/all");
        setCartItems(cartRes.data);
        setCart(cartRes.data); // update centralized state

        const total = cartRes.data.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalAmount(total);

        // Fetch user info
        const userRes = await api.get("/api/users/me");
        setUser(userRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart or user info");
      }
    };

    fetchData();
  }, [setCart]);

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!cartItems.length) return;

    setLoading(true);
    try {
      // Call backend to create order
      const res = await api.post("/api/order/create", {
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        totalAmount,
      });

      const orderId = res.data.id;

      // Clear frontend cart
      setCart([]); // centralized state
      setCartItems([]);
      localStorage.removeItem("cart"); // if you use localStorage

      toast.success("Order placed successfully!");

      // Redirect to Order Success page
      navigate("/order-success", { state: { orderId } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {cartItems.length > 0 && user ? (
        <Checkout
          cartItems={cartItems}
          totalAmount={totalAmount}
          user={user}
          onPlaceOrder={handlePlaceOrder}
          loading={loading}
        />
      ) : (
        <p>Loading cart and user info...</p>
      )}
    </div>
  );
};

export default PaymentPage;
