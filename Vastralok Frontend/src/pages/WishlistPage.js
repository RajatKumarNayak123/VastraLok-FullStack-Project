import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import {useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
//import FilterSidebar from "../components/FilterSidebar";
import "../pages/WishlistPage.css";
import Carousel from "../components/Carousel";

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
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

  // Fetch wishlist items
  useEffect(() => {
    fetchWishlist();
    fetchCartCount();
    fetchWishlistCount();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/api/wishlist/all");
      setWishlistItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/api/cart/all");
      setCartCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };




  const fetchWishlistCount = async () => {
    try {
      const res = await api.get("/api/wishlist/all");
      setWishlistCount(res.data.length);
    } catch (err) {
      console.error(err);
    }
  };
 

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/api/wishlist/remove/${productId}`);
      setWishlistItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
      fetchWishlistCount();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from wishlist.");
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await api.post(`/api/cart/add/${productId}`, { quantity: 1 });
      await handleRemove(productId);
      alert("Moved to cart successfully!");
      fetchCartCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredWishlist = wishlistItems.filter((item) => {
  const q = searchQuery.toLowerCase();
  return (
    item.product.name.toLowerCase().includes(q)
  );
});

  

  // ✅ Navbar menu items (optional)
  const menuItems = {
    Men: ["Jeans","Shirt", "T-Shirt", "Shoes", "Watch", "Trousers","Sherwani","Party Wear","Suits","Formals","Jacket","Sweater",],
    Women: ["Saree", "Lehenga", "Tops", "Jewellery","Makeup Kits","Winter Wear","Footwears","Wedding Collections","Party Wear","Scarf"],
    Kids: ["Shirts", "Shorts","Lehenga", "Shoes","Toys","Baby Oil","Baby Caps","Baby Powder","Powder Milk"],
    Electronics: ["Phone", "IPhone", "Laptop", "Headphone","TV","Refrigerator","Mixer","Room Heater"],
    Furniture:["Furniture Bed","Curtains","Dinning","Chairs","Sofa","Mats","Tables"]
  };

  if (loading) return <div className="wishlist-loading">Loading Wishlist...</div>;

  return (
    <div>
      {/* 🔹 Top Navbar */}
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
      onClick={() => navigate("/cart")}
    >
      🛒 Cart ({cartCount})
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
      onClick={() => navigate(-1)}
      style={topBtnStyle}
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
      {/* 🔹 Carousel */}
      <div style={{ margin: "20px 0" }}>
        <Carousel />
      </div>


      {/* 🔹 Wishlist Grid */}
      <div className="wishlist-page">
        <h2 className="wishlist-title">❤️ My Wishlist</h2>

        {wishlistItems.length === 0 ? (
          <p className="wishlist-empty">Your wishlist is empty 😢</p>
        ) : (
          <div className="wishlist-grid">
            {filteredWishlist.map((item) => (
              <div key={item.product.id} className="wishlist-card">
                <img
                  src={item.product.imgUrl}
                  alt={item.product.name}
                  className="wishlist-image"
                />
                <div className="wishlist-info">
                  <h3>{item.product.name}</h3>
                  <p className="wishlist-price">₹{item.product.price}</p>
                </div>

                <div className="wishlist-actions">
                  <button className="wishlist-btn move" onClick={() => handleMoveToCart(item.product.id)}>
                    🛒 Move to Cart
                  </button>
                  <button className="wishlist-btn remove" onClick={() => handleRemove(item.product.id)}>
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
       
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


      <Footer />
    </div>
  );
}

export default WishlistPage;
