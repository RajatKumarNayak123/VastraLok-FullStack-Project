import React, { useState, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import {useLocation, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import FilterSidebar from "../components/FilterSidebar";
import DealSection from "../components/DealSection";
import "./ProductsPage.css";
function ProductsPage() {
  const navigate = useNavigate();
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


  const [availableFilters, setAvailableFilters] = useState({
    category: [],
    brand: [],
    color: [],
    size: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
    color: [],
    size: []
  });
  const [price, setPrice] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  /* ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
*/

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




  // ✅ Fetch available filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.get("/api/products/filter/options");
        setAvailableFilters({
          category: res.data.category || [],
          brand: res.data.brand || [],
          color: res.data.color || [],
          size: res.data.size || []
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  // ✅ Clear all filters
  const handleClearAll = () => {
    setSelectedFilters({ category: [], brand: [], color: [], size: [] });
    setPrice({ min: "", max: "" });
    setSearchQuery(""); 
  };

  // ✅ Build filter object for ProductGrid
  const buildFilterForGrid = () => ({
    main: filter.main || "",
    sub: filter.sub || "",
    category: selectedFilters.category?.length ? selectedFilters.category.join(",") : "",
    brand: selectedFilters.brand?.length ? selectedFilters.brand.join(",") : "",
    color: selectedFilters.color?.length ? selectedFilters.color.join(",") : "",
    size: selectedFilters.size?.length ? selectedFilters.size.join(",") : "",
    minPrice: price.min !== "" ? price.min : undefined,
    maxPrice: price.max !== "" ? price.max : undefined
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


  // ✅ Menu items
  const menuItems = {
    Men: ["Jeans","Shirt", "T-Shirt", "Shoes", "Watch", "Trousers","Sherwani","Party Wear","Suits","Formals","Jacket","Sweater",],
    Women: ["Saree", "Lehenga", "Tops", "Jewellery","Makeup Kits","Winter Wear","Footwears","Wedding Collections","Party Wear","Scarf"],
    Kids: ["Shirts", "Shorts","Lehenga", "Shoes","Toys","Baby Oil","Baby Caps","Baby Powder","Powder Milk"],
    Electronics: ["Phone", "IPhone", "Laptop", "Headphone","TV","Refrigerator","Mixer","Room Heater"],
    Furniture:["Furniture Bed","Curtains","Dinning","Chairs","Sofa","Mats","Tables"]
  };

  /* Winter sale products*/

  const featuredDeals = [
  {
    id: 101,
    name: "Men’s Winter Jacket",
    imageUrl:
      "https://m.media-amazon.com/images/I/81fpLVlaPvL.jpg",
  },
  {
    id: 102,
    name: "Women’s Woolen Sweater",
    imageUrl:
      "https://m.media-amazon.com/images/I/817x2akYLSL._AC_UY1100_.jpg",
  },
  {
    id: 103,
    name: "Leather Boots",
    imageUrl:
      "https://costosoitaliano.com/cdn/shop/products/j6_2048x.png?v=1736602642",
  },
  {
    id: 104,
    name: "Woolen Cap",
    imageUrl:
      "https://rukminim2.flixcart.com/image/480/640/xif0q/cap/r/w/z/free-caps-scarf-set-moderic-original-imag8zs55achxgqq.jpeg?q=90",
  },
  {
    id: 105,
    name: "Winter Scarf",
    imageUrl:
      "https://assets.ajio.com/medias/sys_master/root/20240827/b7Ox/66cdbd7f1d763220fa9e78a9/-473Wx593H-700317792-black-MODEL.jpg",
  },

  {
    id: 106,
    name: "Room Heater",
    imageUrl:
      "https://www.moglix.com/blog/wp-content/uploads/2020/11/Infrared-Heaters.jpg",
  },

  {
    id: 107,
    name: "Body Lotion",
    imageUrl:
      "https://i0.wp.com/blog.cosworld.in/wp-content/uploads/2024/02/4-13.jpg?fit=1920%2C1080&ssl=1",
  },
  {
    id: 108,
    name: "Jackets for Women's",
    imageUrl:
      "https://www.missmosa.in/cdn/shop/files/DD3E22C1-A8E7-4416-9869-D7FC9090BBDF.jpg?v=1755064799&width=500",
  },
    {
    id: 109,
    name: "Winter Inner Wear",
    imageUrl:
      "https://5.imimg.com/data5/SELLER/Default/2023/1/AY/BD/LH/9405676/winter-thermals-500x500.webp",
  },
      {
    id: 110,
    name: "Charming Winter wear for Office",
    imageUrl:
      "https://blogs.tailor-m.com/wp-content/uploads/coat.jpg",
  },
];

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

      
     <DealSection
  title="❄️ Winter Essentials | Up to 60% OFF"
  products={featuredDeals}
/>
  {/*winter fashion banner*/} 
      <div
  style={{
      width: "90%",
    margin: "30px auto",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    cursor: "default",
    userSelect: "none",
  }}
>

</div>

      {/* 🔹 Carousel */}
      <div style={{ margin: "20px 0" }}>
        <Carousel />
      </div>

      {/* 🔹 Sidebar + Product Grid */}
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <div
          style={{
            width: "260px",
            position: "sticky",
            top: "20px",

            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "1px solid #eee"
          }}
        >
          <FilterSidebar
            availableFilters={availableFilters}
            selected={selectedFilters}
            setSelected={setSelectedFilters}
            price={price}
            setPrice={setPrice}
            onClearAll={handleClearAll}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
        </div>

        <div style={{ flex: 1 }}>
          <ProductGrid
            filter={buildFilterForGrid()}
            searchQuery={searchQuery}
            sortOrder={sortOrder}
          />
        </div>
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


      {/* 🔹 Footer */}
      <Footer />
    </div>
  );
}

// ✅ Dropdown hover CSS
const style = document.createElement("style");
style.innerHTML = `
.menu-item:hover .dropdown-menu { display: block !important; }
.dropdown-menu {
  display: none;
  position: absolute;
  top: 25px;
  left: 0;
  background: #fff;
  color: #000;
  padding: 10px;
  border-radius: 5px;
  min-width: 140px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.2);
  z-index: 1000;
}
.dropdown-menu button:hover { background: #d1cdcdff; }
`;
document.head.appendChild(style);

// ✅ Profile dropdown hover CSS
const style2 = document.createElement("style");
style2.innerHTML = `
.profile-container {
  position: relative;
  display: inline-block;
}

.profile-icon {
  background-color: #ffffff;
  color: #006e65;
  font-weight: bold;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
}

.profile-dropdown {
  display: none;
  position: absolute;
  right: 0;
  top: 45px;
  background: white;
  color: black;
  border-radius: 8px;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.2);
  padding: 8px 0;
  min-width: 170px;
  z-index: 1000;
}

.profile-dropdown button {
  background: none;
  border: none;
  width: 100%;
  padding: 10px 15px;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
}

.profile-dropdown button:hover {
  background-color: #f0f0f0;
}

.profile-container:hover .profile-dropdown {
  display: block;
}
`;
document.head.appendChild(style2);


export default ProductsPage;

