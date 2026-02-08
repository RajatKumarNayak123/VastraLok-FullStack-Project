// src/components/CartViewer.js
import React, { useEffect, useState,useRef } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import api from "../axiosConfig"; 
import "./CartViewer.css";
import loadRazorpay from "../utils/loadRazorpay";
import { toast } from "react-toastify";
import OrderSuccessPage from "../pages/OrderSuccessPage";

// 🔹 Address Form Component
function AddressForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    fullName: "",
    street: "",
    village:"",
    city: "",
    dist:"",
    state: "",
    zip: "",
    phone: "",
  });
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <h3>Enter Shipping Address</h3>
      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
      <input name="street" placeholder="Street" value={form.street} onChange={handleChange} required />
      <input name="village" placeholder="Village" value={form.village} onChange={handleChange} required />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
      <input name="dist" placeholder="Dist" value={form.dist} onChange={handleChange} required />
      <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
      <input name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <div className="form-actions">
        <button type="submit" className="btn-primary">Continue to Payment</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// 🔹 Order Success Popup

export default function CartViewer() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null); // ✅ to pass orderId to success page
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const addressRef = useRef(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [filter, setFilter] = useState({
     main: params.get("main") || "",
    sub: params.get("sub") || ""
  });
  // 🔥 URL change → filter update
  
  
  useEffect(() => {
    setFilter({
      main: params.get("main") || "",
      sub: params.get("sub") || ""
    });
  }, [location.search]);

  // 🔹 Fetch cart items
  const fetchCart = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/cart/all", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔹 Remove Item
  const removeFromCart = (productId) => {
    axios
      .delete(`http://localhost:8080/api/cart/remove/${productId}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(() => {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      })
      .catch((err) => console.error(err));
  };

  // 🔹 Update Quantity
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    axios
      .put(
        `http://localhost:8080/api/cart/update/${productId}`,
        { quantity: newQty },
        { headers: {"Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") } }
      )
      .then(() => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId ? { ...item, quantity: newQty } : item
          )
        );
      })
      .catch((err) => console.error("❌ Quantity update error:", err.response?.data||err.message));
  };

  // 🔹 Step 1: Place Order -> Show Address Form
  const placeAllOrder = () => {
    setShowAddressForm(true);
  };

  // 🔹 Step 2: Submit address -> create order & open Razorpay
  const handleAddressSubmit = async (addressData) => {
    try {
      console.log("📌 Address Form Data:", addressData);
      setLoading(true);

      const payload = {
        cartItems: cartItems.map((c) => ({
          productId: c.productId,
          productName: c.productName,
          price: c.price,
          imgUrl: c.imgUrl,
          quantity: c.quantity,
        })),
        amount: totalPrice,
        name: addressData.fullName,
        phone: addressData.phone,
        village:addressData.village,
        street: addressData.street,
        town: addressData.city,
        dist: addressData.dist,
        state:addressData.state,
        pincode: addressData.zip,
      };

      const { data: orderData } = await api.post("/api/orders/create", payload);
      console.log("✅ Order Created at Backend:", orderData);
      setShowAddressForm(false);

      await startPayment(orderData, payload);
    } catch (err) {
      console.error("❌Order creation failed:", err);
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Start Razorpay Checkout
  const startPayment = async (orderData, formData) => {
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_RLrReUiS0qR4KI",
        amount: Math.round(orderData?.amount * 100),
        currency: orderData?.currency || "INR",
        name: "VastraLok",
        description: "Order Payment",
        order_id: orderData?.orderId || orderData?.razorpayOrderId,
        handler: async function (response) {
          try {
            console.log("✅ Razorpay Payment Response:", response);

            const verifyRes = await api.post(
              "/api/orders/payment/success",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );

            console.log("✅ Verification Response:", verifyRes.data);
            if (verifyRes.data.success) {
              toast.success("✅ Payment verified successfully!");
              setPlacedOrderId(verifyRes.data.orderId); // ✅ store orderId
              setShowSuccessPopup(true);

            } else {
              toast.error("❌ " + (verifyRes.data.message || "Verification failed"));
            }
          } catch (err) {
            console.error("❌ Payment verification failed:", err.response?.data || err.message);
            toast.error("❌ Something went wrong during verification");
          }
        },

        prefill: {
          name: formData.name,contact: formData.phone
        },
        theme: { color: "#006e65" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        console.error("Payment failed:", resp);
        toast.error("Payment failed or cancelled");
      });
      rzp.open();
    } catch (err) {
      console.error("Payment start error:", err);
      toast.error("Could not start payment");
    }
  };

  // 🔎 Search + Sort
  const filteredItems = cartItems
    .filter((item) =>
      item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  const totalPrice = filteredItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );


  // ✅ Fetch cart count
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
  
  // ✅ Fetch wishlist count
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/api/wishlist/all");
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setWishlistCount(data.length);
      } catch (err) {
        console.error("Error fetching wishlist:",err);
        setWishlistCount(0); // fallback
      }
    };
    fetchWishlist();
  }, []);
  

  // ✅ Menu items
  const menuItems = {
    Men: ["Jeans","Shirt", "T-Shirt", "Shoes", "Watch", "Trousers","Sherwani","Party Wear","Suits","Formals","Jacket","Sweater",],
    Women: ["Saree", "Lehenga", "Tops", "Jewellery","Makeup Kits","Winter Wear","Footwears","Wedding Collections","Party Wear","Scarf"],
    Kids: ["Shirts", "Shorts","Lehenga", "Shoes","Toys","Baby Oil","Baby Caps","Baby Powder","Powder Milk"],
    Electronics: ["Phone", "IPhone", "Laptop", "Headphone","TV","Refrigerator","Mixer","Room Heater"],
    Furniture:["Furniture Bed","Curtains","Dinning","Chairs","Sofa","Mats","Tables"]
  };


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
    <div className="cart-container">
      <nav
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 28px",
    backgroundColor: "#006e65",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
  }}
>
  {/* Brand */}
  <h1

    className="brand-logo"
    style={{
      
    }}
    onClick={() => setFilter({ main: "", sub: "" })}
  >
    VastraLok
  </h1>

  {/* Search + Sort */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      type="text"
      placeholder="🔍 Search Products, Brands & More ..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        width: "420px",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "16px"
      }}
    />

    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      style={{
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        cursor: "pointer"
      }}
    >
      <option value="">Sort By</option>
      <option value="low">Price: Low to High</option>
      <option value="high">Price: High to Low</option>
    </select>
  </div>

  {/* Cart / Wishlist / Orders / Profile */}
  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

    <button
      className="top-btn"
      style={topBtnStyle}
      onClick={() => navigate("/wishlist")}
    >
      ❤️ Wishlist ({wishlistCount})
    </button>

    <button
      className="top-btn"
      style={topBtnStyle}
      onClick={() => navigate("/orders")}
    >
      Orders
    </button>

    <button
      className="top-btn"
      style={topBtnStyle}
      onClick={() => navigate(-1)}
    >
      ⬅ Back
    </button>

    {/* Profile */}
    <div className="profile-container">
      <div className="profile-icon">
        {localStorage.getItem("username")
          ? localStorage.getItem("username")[0].toUpperCase()
          : "U"}
      </div>

      <div className="profile-dropdown">
        <button onClick={() => navigate("/profile")}>👤 Profile</button>
        <button onClick={() => navigate("/orders")}>📦 My Orders</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
        <button onClick={() => navigate("/rewards")}>🎁 Rewards</button>
        <button onClick={() => navigate("/gifts")}>🎟 Gift Cards</button>
        <button onClick={() => navigate("/return-items")}>🔁 Return Items</button>
        <button onClick={() => navigate("/help")}>❓ Help</button>
        <button onClick={() => setShowLogoutModal(true)}>🚪 Logout</button>

      </div>
    </div>
  </div>
</nav>


      {/* 🔹 Category Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "100px",
          padding: "8px 15px",
          backgroundColor: "#139277ff",
          color: "#fff"
        }}
      >
        <span
          className="nav-item"
          onClick={() => 
            {setFilter({ main: "", sub: "" });
            navigate("/products");
            }
          }
        >
          Home
        </span>
        {Object.keys(menuItems).map((mainCat) => (
          <div key={mainCat} className="menu-item">
            <span className="nav-item">
              {mainCat} ⏷
            </span>
            <div className="dropdown-menu">
              {menuItems[mainCat].map((subCat) => (
                <button
                  key={subCat}
                  style={{
                    margin: "5px 0",
                    cursor: "pointer",
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "5px 10px",
                    border: "none",
                   // background: "#f8f8f8",
                    borderRadius: "4px"
                  }}
                    onClick={() => {
  const main = mainCat.trim();
  const sub = subCat.trim();

   // setSearchQuery(""); // RESET SEARCH
  setFilter({ main: main, sub: sub });

  // 🔥 URL UPDATE TO FORCE REFRESH
  navigate(`/products?main=${main}&sub=${sub}`);
}}

                >
                  {subCat}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="cart-grid">
        {loading ? (
          <p className="info-msg">⏳ Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="info-msg">🛒 Cart is empty</p>
        ) : (
          filteredItems.map((item, index) => (
            <div key={index} className="cart-card" 
            onClick={() => navigate(`/product/${item.productId}`)}  
            style={{ cursor: "pointer" }}>
              <img src={item.imgUrl} alt={item.productName} className="cart-img" />
              <h3>{item.productName}</h3>
              <p className="price">₹{item.price}</p>

              <div className="qty-controls">
                <button onClick={(e) => {
  e.stopPropagation();
  updateQuantity(item.productId, item.quantity - 1);
}}>➖</button>

                <span>{item.quantity}</span>
               <button onClick={(e) => {
  e.stopPropagation();
  updateQuantity(item.productId, item.quantity + 1);
}}>➕</button>

              </div>

              <p className="subtotal">Subtotal: ₹{item.price * item.quantity}</p>

              <button
  className="remove-btn"
  onClick={(e) => {
    e.stopPropagation();
    removeFromCart(item.productId);
  }}
>
  ❌ Remove
</button>

            </div>
          ))
        )}
      </div>

      {filteredItems.length > 0 && !loading && (
        <div className="cart-total">
          <h2>🧾 Total: ₹{totalPrice}</h2>
          <button
  className="place-btn"
  onClick={() => {
    setShowAddressForm(true); // address form dikhao

    setTimeout(() => {
      addressRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }}
>
  🛒 Place All Order
</button>

        </div>
      )}

      {showAddressForm && (
        <div ref={addressRef}>
        <AddressForm onSubmit={handleAddressSubmit} onCancel={() => setShowAddressForm(false)} />
      </div>
      )}

      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <div className="overlay-popup">
          <div className="popup-content">
            <OrderSuccessPage orderId={placedOrderId} 
             onClose={() => {setShowSuccessPopup(false);
              navigate("/orders");
            }}/>
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
      <p>Redirecting to login...</p>
    </div>
  </div>
)}


    </div>
  );
}
