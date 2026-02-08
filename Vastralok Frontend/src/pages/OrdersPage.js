// OrdersPage.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import AddressForm from "../components/AddressForm";
import { useNavigate,useLocation } from "react-router-dom";
import api from "../axiosConfig";
import "./OrdersPage.css";
import ReturnRequestForm from "../components/ReturnRequestForm";
import SuccessPopup from "../components/SuccessPopup";
//import ReturnPopup from "../components/ReturnPopup";
//import { ListStart } from "lucide-react";
function OrdersPage() {
  
  const navigate = useNavigate();
  const location = useLocation();

const [showOrderBanner, setShowOrderBanner] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Popup & Address
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [buyAgainItems, setBuyAgainItems] = useState([]);
   const [showSuccess, setShowSuccess] = useState(false);
  // Search & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showOrderPlacedMsg, setShowOrderPlacedMsg] = useState(false);


  // Fetch Orders
  useEffect(() => {
    api.get("/api/orders/my")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

    useEffect(() => {
  console.log("ORDERS AFTER API:", orders);
}, [orders]);

useEffect(() => {
  if (location.state?.orderPlaced) {
    setShowOrderBanner(true);

    const timer = setTimeout(() => {
      setShowOrderBanner(false);
    }, 5000);

    // state clear (refresh bug avoid)
    window.history.replaceState({}, document.title);

    return () => clearTimeout(timer);
  }
}, [location.state]);



  // Fetch cart count
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/api/cart/all");
        setCartCount(res.data.length || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  

  const openPopup = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleHideOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order?")) return;
    try {
      await api.put(`/api/orders/${orderId}/hide`);
      toast.success("Order removed successfully");
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  

  // Razorpay loader
  const loadRazorpay = () => {
    return new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // BUY AGAIN CLICK
  const handleBuyAgain = (order) => {
    const itemsToBuy = order.items.map(i => ({
      productId: i.productId,
      quantity: i.quantity
    }));
    setSelectedOrderId(order.orderId); 
    setBuyAgainItems(itemsToBuy);
    setShowAddressForm(true); // OPEN MODAL
    console.log("SELECTED ORDER ID SET:", order.orderId);
  };

  // ADDRESS SUBMIT + PAYMENT
  const handleAddressSubmit = async (address) => {
    
    try {
      setLoading(true);
         console.log("BUY AGAIN ORDER ID:", selectedOrderId);                         
         const res = await api.post("/api/orders/buy-again", {
           orderId: selectedOrderId,
          items: buyAgainItems,
  address
});

        const orderData = res.data;

        // Razorpay
        const ok = await loadRazorpay();
        if (!ok) {
          toast.error("Failed to load Razorpay");
          return;
        }

        const options = {
          key: "rzp_test_RLrReUiS0qR4KI",
          amount: orderData.totalAmount*100,
          currency: orderData.currency,
          name: "VastraLok",
          description: "Buy Again Payment",
          order_id: orderData.razorpayOrderId,
          handler: async function (response) {
  try {
    await api.post("/api/orders/payment/success", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    toast.success("Order placed successfully 🎉");

    setShowAddressForm(false);

    navigate("/orders", {
      replace: true,
      state: { orderPlaced: Date.now() }
    });

  } catch (err) {
    console.error(err);
    toast.error("Payment verification failed");
  }
},

          prefill: {
            name: address.fullName,
            email: "john@example.com",
            contact: address.phone,
          },
          theme: { color: "#006e65" },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => toast.error("Payment failed"));
        rzp.open();

      setShowAddressForm(false);
      setBuyAgainItems([]);
    }catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Filter + Sort Orders
  const filteredOrders = orders
  .map(order => {
    const matchedItems = (order.items || []).filter(item =>
      item.productName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    return {
      ...order,
      items: matchedItems
    };
  })
  // ⭐ IMPORTANT LINE
  .filter(order => order.items.length > 0);



  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.orderDate) - new Date(a.orderDate);
    if (sortOrder === "oldest") return new Date(a.orderDate) - new Date(b.orderDate);
    if (sortOrder === "high") return b.totalAmount - a.totalAmount;
    if (sortOrder === "low") return a.totalAmount - b.totalAmount;
    return 0;
  });

  const topBtnStyle = {
  background: "#006e65",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.3)",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "14px",
  transition: "0.2s"
};

  return (
    <div>
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", backgroundColor: "#006e65", color: "#fff" }}>
        <h1 className="brand-logo" onClick={() => navigate("/products")}>VastraLok</h1>
        <div style={{ display: "flex", gap: "20px" }}>
          <input type="text" placeholder="🔍 Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: "15px", width: "520px", borderRadius: "8px", border: "1px solid #ccc",fontSize:"20px" }} />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: "10px", borderRadius: "8px" }}>
            <option value="">Sort By</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Price High → Low</option>
            <option value="low">Price Low → High</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "15px" ,alignItems: "center"}}>
          <button onClick={() => navigate("/cart")} className="top-btn" style={ topBtnStyle}>🛒 CART ({cartCount})</button>
          <button onClick={() => navigate("/wishlist")} className="top-btn" style={topBtnStyle}>WISHLIST</button> 
          <button onClick={() => navigate("/products")} className="top-btn" style={topBtnStyle}>HOME</button>
        </div>

        <div className="profile-container">
      <div className="profile-icon">
        {localStorage.getItem("username")
          ? localStorage.getItem("username")[0].toUpperCase()
          : "U"}
      </div>

      <div className="profile-dropdown">
        <button onClick={() => navigate("/profile")}>👤 Profile</button>
        <button onClick={() => navigate("/products")}>📦 Home</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <button onClick={() => navigate("/rewards")}>🎁 Rewards</button>
        <button onClick={() => navigate("/gifts")}>🎟 Gift Cards</button>
        <button onClick={() => navigate("/return-items")}>🔁 Return Items</button>
        <button onClick={() => navigate("/help")}>❓ Help</button>
       <button onClick={() => setShowLogoutModal(true)}>
  🚪 Logout
</button>


      </div>
    </div>
      </nav>

      {/* 🔹 Category Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "100px",
          padding: "15px 20px",
          backgroundColor: "#139277ff",
          color: "#fff",
        }}
      >
        <button 
      onClick={() => navigate(-1)}
      style={{
        background: "transparent",
        border: "none",
        fontSize: "15px",
        cursor: "pointer",
        marginRight: "10px",
        
      }}
    >
      ⬅ Back 
    </button>
        
      </nav>

      {/* Carousel */}
      <div style={{ margin: "20px 0" }}><Carousel /></div>

      {/* Orders List */}
      <div style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>📦 My Orders</h2>
        {showOrderBanner && (
  <div className="order-placed-banner">
    ✅ Order placed successfully
  </div>
)}

        {loading ? (<p>⏳ Loading orders...</p>) :
          sortedOrders.length === 0 ? (<p>No orders found.</p>) :
            sortedOrders.map(order => (
              <div key={order.orderId} onClick={() => {if (!showReturnForm)openPopup(order)}} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginBottom: "20px", background: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", position: "relative" }}>
                <div style={{ marginBottom: "15px", display: "flex", gap: "12px" }}>
                  {/* Buy Again */}
                  <button onClick={(e) => { e.stopPropagation(); handleBuyAgain(order); }} style={{ padding: "15px 25px", background: "green", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>Buy Again</button>

                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p><b>Order #{order.orderId}</b></p>
                    <p style={{ fontSize: "14px", color: "#666" }}>{new Date(order.orderDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <p style={{ fontWeight: "bold" }}>₹{order.totalAmount}</p>
                </div>

                {/* Products Grid */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "15px"
  }}
>
  {order.items?.map(item => (
    <div
      key={item.productId}
      style={{
        border: "1px solid #eee",
    borderRadius: "8px",
    padding: "10px",
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    height: "100%" 
      }}
    >
      <img
        src={item.imageUrl}
        alt={item.productName}
        className="order-image"
      />

      <p style={{ fontWeight: "500", marginTop: "8px" }}>
        {item.productName}
      </p>

      <p style={{ fontSize: "14px" }}>
        Qty: {item.quantity}
      </p>

      <p style={{ fontWeight: "bold" }}>
        ₹{item.lineTotal}
      </p>

      {/* ✅ PRODUCT LEVEL RETURN BUTTON */}
      {["PAID","COMPLETED", "DELIVERED"].includes(order.status) && (
        <button
          className="return-btn"
          style={{
            marginTop: "auto",
            width: "100%",
            padding: "6px",
            fontSize: "13px"
          }}
          onClick={(e) => {
            e.stopPropagation();

            setSelectedProduct({
              orderId: order.orderId,
              productId: item.productId,
              productName: item.productName,
              imageUrl: item.imageUrl,
              quantity: item.quantity,
              price: item.price
            });

            setShowReturnForm(true);
          }}
        >
          🔁 Return Item
        </button>
      )}
    </div>
  ))}
</div>


                <button className="hide-btn" onClick={(e) => { e.stopPropagation(); handleHideOrder(order.orderId); }} style={{ position: "absolute", right: "-5px", top: "-5px", background: "white", color: "black", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer" }}>✖</button>
              </div>
            ))}
      </div>

      {/* Order Details Popup */}
      {showPopup && selectedOrder && (
        <div onClick={closePopup} style={modalOverlayStyle}>
          <div onClick={e => e.stopPropagation()} style={modalContentStyle}>
            <button onClick={closePopup} style={modalCloseButtonStyle}>✖</button>
            <h2>Order #{selectedOrder.orderId}</h2>
            <p style={{ color: "#666" }}>{new Date(selectedOrder.orderDate).toLocaleString()}</p>
            <hr />
            <h3>🛍 Products</h3>
            {selectedOrder.items.map(item => (
              <div key={item.productId} style={orderItemStyle}>
                <img src={item.imageUrl} style={{ width: "100%", borderRadius: "8px" }} />
                <p><b>{item.productName}</b></p>
                <p>Price: ₹{item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p><b>Total: ₹{item.lineTotal}</b></p>
              </div>
            ))}
            <hr />
            <h3>📍 Delivery Address</h3>
            <p><b>Name:</b> {selectedOrder.name}</p>
            <p><b>Phone:</b> {selectedOrder.phone}</p>
            <p><b>Address:</b> {selectedOrder.street}, {selectedOrder.village}, {selectedOrder.town}, {selectedOrder.dist},{selectedOrder.state} - {selectedOrder.pincode}</p>
            <hr />
            <h3>💳 Payment</h3>
            <p><b>Status:</b> PAID</p>
            <hr />
            <h3>💰 Order Total</h3>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹{selectedOrder.totalAmount}</p>
          </div>
        </div>
      )}

      {/* 🔹 Address Form Modal */}
      {showAddressForm && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: "400px" }}>
            <button onClick={() => setShowAddressForm(false)} style={modalCloseButtonStyle}>✖</button>
            <AddressForm onSubmit={handleAddressSubmit} onClose={() => setShowAddressForm(false)} />
          </div>
        </div>
      )}
       {showSuccess && <SuccessPopup message="Order Placed Successfully!" />}
        {showReturnForm && selectedProduct && (
  <div style={modalOverlayStyle}>
    <div style={modalContentStyle}>
      <button
        onClick={() => setShowReturnForm(false)}
        style={modalCloseButtonStyle}
      >
        ✖
      </button>

      <ReturnRequestForm
        product={selectedProduct}
        onClose={() => setShowReturnForm(false)}
      />
    </div>
  </div>
)}


{showLogoutModal && (
  <div className="logout-overlay">
    <div className="logout-modal">
      <h3>⚠️ Confirm Logout</h3>
      <p>Do you really want to logout?</p>

      <div className="logout-buttons">
        <button className="yes-btn" onClick={() => {
          localStorage.removeItem("token");
          setShowLogoutModal(false);
          setShowThankYou(true);

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }}>
          Yes
        </button>

        <button className="no-btn" onClick={() => setShowLogoutModal(false)}>
          No
        </button>
      </div>
    </div>
  </div>
)}

      

     {showThankYou && (
  <div className="logout-overlay">
    <div className="thankyou-modal">
      <h2>💚 Thanks for visiting</h2>
      <h1>VASTRALOKA</h1>
      <p>See you again soon 👋</p>
    </div>
  </div>
)}

     {showOrderPlacedMsg && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#006e65",
    color: "white",
    padding: "20px 35px",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: "600",
    zIndex: 10000,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  }}>
    ✅ Order Placed Successfully
  </div>
)}


      <Footer />
    </div>
  );
}

// Modal Styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalContentStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  position: "relative",
  maxHeight: "90vh",
  overflowY: "auto",
  width: "480px"
};

const modalCloseButtonStyle = {
  position: "absolute",
  right: "12px",
  top: "12px",
  fontSize: "20px",
  background: "none",
  border: "none",
  cursor: "pointer"
};

const orderItemStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  margin: "10px 0",
  background: "#fafafa"
};

export default OrdersPage;