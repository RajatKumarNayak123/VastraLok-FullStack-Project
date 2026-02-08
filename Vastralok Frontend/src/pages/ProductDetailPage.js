import React, { useState, useEffect ,useRef} from "react";
import  "./ProductDetailPage.css";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import api from "../axiosConfig";
import loadRazorpay from "../utils/loadRazorpay";
import ProductGridSidebar from "../components/ProductGridSidebar";
import { toast } from "react-toastify";
import OrderSuccessPage from "./OrderSuccessPage";
// Address Form Popup
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
    <div className="address-popup">


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
    </div>
  );
}
  

function ProductDetailPage() {
  
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [filter, setFilter] = useState({
   main: params.get("main") || "",
  sub: params.get("sub") || ""
});
useEffect(() => {

  const params = new URLSearchParams(location.search);
  setFilter({
    main: params.get("main") || "",
    sub: params.get("sub") || ""
  });
}, [location.search]);
 
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [selectedTab, setSelectedTab] = useState("description");
  const [setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState("");
   const [showAddressForm, setShowAddressForm] = useState(false);
   const [totalPrice, setTotalPrice] = useState(0);
   const [showOrderSuccess, setShowOrderSuccess] = useState(false);
   const [successOrderId, setSuccessOrderId] = useState(null);
   const [products, setProducts] = useState([]);
  // Review form state
  const [reviewForm, setReviewForm] = useState({ reviewerName: "", rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
 //const [zoom, setZoom] = useState(false);

// Image Zoom Ref
const imgContainerRef = useRef(null);
const zoomRef = useRef(null);
const [wishlistCount, setWishlistCount] = useState(0);


useEffect(() => {
  const fetchAllProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  fetchAllProducts();
}, []);


  // Fetch product details & related
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
        setTotalPrice(res.data.price);  // initial price
        const rel = await api.get(`/api/products/related/${id}`);
        setRelatedProducts(rel.data);
        
      } catch (err) {
        console.error("❌ Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Cart count
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
   

const buyNowRef = useRef(null);


  // Add to Cart
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.warning("⚠️ Please login first to add to cart.");
    try {
      await api.post(`/api/cart/add/${product.id}`, { quantity });
      toast.success("✅ Product added to cart!");
      setCartCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add product to cart.");
    }
  };

   const addressRef = useRef(null);

  const handleBuyNow = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.warn("Please login first");
    navigate("/login");
    return;
  }

  setShowAddressForm(true);

  // ✅ smooth scroll to address form
  setTimeout(() => {
    addressRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 100);
};


const handleAddressSubmit = async (address) => {
  try {
    setLoading(true);

    // 1️⃣ Call backend to create Razorpay order
    const res = await api.post("/api/orders/create-buy-now-order", {
      productId: product.id,
      quantity: quantity,

      name: address.fullName,
      phone: address.phone,
      street: address.street,
      village:address.village,
      town: address.city,
      ps:address.ps,
      dist: address.dist,
      state: address.state,
      pincode: address.zip,

  
    });

    const orderData = res.data;

    setShowAddressForm(false);

    // 2️⃣ Load Razorpay script
    const ok = await loadRazorpay();
    if (!ok) {
      toast.error("Failed to load Razorpay");
      return;
    }

    // 3️⃣ Prepare Razorpay options
    const options = {
      key: "rzp_test_RLrReUiS0qR4KI",  // SAME KEY AS BACKEND
      amount: orderData.amount,
      currency: orderData.currency,
      name: "VastraLok",
      description: "Buy Now Payment",
      order_id: orderData.razorpayOrderId,

      handler: async function (response) {
        try {
          const verifyRes = await api.post("/api/orders/payment/success", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) 
            {
               toast.success("Payment successful!");
               setSuccessOrderId(verifyRes.data.orderId); 
              setShowOrderSuccess(true);
}



        } catch (err) {
          toast.error("Verification failed");
        }
      },

      prefill: {
        name: address.fullName,
        contact: address.phone,
      },

      theme: { color: "#006e65" },
    };

    // 4️⃣ Open Razorpay UI
    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function () {
      toast.error("Payment failed");
    });

    rzp.open();
  } catch (err) {
    console.error(err);

    // Show backend error clearly
    if (err.response?.data?.error) {
      toast.error(err.response.data.error);
    } else {
      toast.error("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};

const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
    color: [],
    size: []
  });
  const [price, setPrice] = useState({ min: "", max: "" });

  const handleQuantityChange = (amount) => {
  if (quantity + amount >= 1 && quantity + amount <= (product?.quantity || 1)) {
    const newQty = quantity + amount;
    setQuantity(newQty);
    setTotalPrice(product.price * newQty);
  }
};



 const handleWishlist = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to add wishlist!");
      return;
    }

    if (!wishlistAdded) {
      // ADD TO WISHLIST
      await api.post(`/api/wishlist/add/${product.id}`);
      setWishlistAdded(true);
      toast.success("Added to wishlist ❤️");
    } else {
      // REMOVE FROM WISHLIST
      await api.delete(`/api/wishlist/remove/${product.id}`);
      setWishlistAdded(false);
      toast.info("Removed from wishlist 💔");
    }
  } catch (error) {
    toast.error("Something went wrong!");
    console.error(error);
  }
};


const handleCancel = () => {
  setShowAddressForm(false);

  setTimeout(() => {
    buyNowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 100);
};


  // Add Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewerName || !reviewForm.comment || reviewForm.rating === 0) {
      return toast.warning("⚠️ Fill all review fields");
    }
    setSubmittingReview(true);
    try {
      await api.post(`/api/products/${id}/reviews`, {
        reviewerName: reviewForm.reviewerName,
        comment: reviewForm.comment,
        rating: reviewForm.rating,
      });
      const updated = await api.get(`/api/products/${id}`);
      setProduct(updated.data);
      setReviewForm({ reviewerName: "", rating: 0, comment: "" });
      toast.success("✅ Review submitted successfully!");
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("❌ Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // 🗑️ Delete Review
  const handleDeleteReview = async (productId, reviewId) => {
  try {
      const response = await api.delete(`/api/products/${productId}/reviews/${reviewId}`);
      if (response.status === 200) {
        toast.success("Review deleted successfully!");
        setProduct(prev => ({
  ...prev,
  reviews: prev.reviews.filter(r => r.id !== reviewId)
}));

      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review!");
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
   // ✅ Menu items
 const menuItems = {
    Men: ["Jeans","Shirt", "T-Shirt", "Shoes", "Watch", "Trousers","Sherwani","Party Wear","Suits","Formals","Jacket","Sweater",],
    Women: ["Saree", "Lehenga", "Tops", "Jewellery","Makeup Kits","Winter Wear","Footwears","Wedding Collections","Party Wear","Scarf"],
    Kids: ["Shirts", "Shorts","Lehenga", "Shoes","Toys","Baby Oil","Baby Caps","Baby Powder","Powder Milk"],
    Electronics: ["Phone", "IPhone", "Laptop", "Headphone","TV","Refrigerator","Mixer","Room Heater"],
    Furniture:["Furniture Bed","Curtains","Dinning","Chairs","Sofa","Mats","Tables"]
  };

  if (loading) {
  return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading product details...</p>;
}

// Show error only if not loading AND product is still null due to actual failure
if (!loading && !product) {
  return <p style={{ textAlign: "center", color: "red", marginTop: "50px" }}>
    Failed to load product details
  </p>;
}

const handleMouseMove = (e) => {
const zoom = zoomRef.current;
    const rect = zoom.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    zoom.style.backgroundPosition = `${x}% ${y}%`;
    zoom.style.backgroundSize = "250%"; 
};


const handleMouseLeave = () => {
 zoomRef.current.style.backgroundSize = "100%";
  zoomRef.current.style.backgroundPosition = "center";
};



const handleMouseEnter = (e) => {
  e.target.style.transform = "scale(1.06)";
  e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
};

const handleMouseExit = (e) => {
  e.target.style.transform = "scale(1)";
  e.target.style.boxShadow = "none";
};

const originalPrice = product.originalPrice || Math.round(totalPrice * 1.3); // 30% extra
const discountPercent = Math.round(
  ((originalPrice - totalPrice) / originalPrice) * 100
);
  
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




const filteredProducts = products
  .filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  })
  .filter((p) => {
    if (!filter.main) return true;
    return p.category === filter.main && (!filter.sub || p.subCategory === filter.sub);
  })
  .sort((a, b) => {
    if (sortOrder === "low") return a.price - b.price;
    if (sortOrder === "high") return b.price - a.price;
    return 0;
  });



  return (
    <div>
      {/* Navbar */}
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
      onChange={(e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // if user typed something → go to products page
    if (value.trim() !== "") {
      navigate(`/products?search=${value}`);
    }
    // if user cleared input → go back to product detail
    else {
      navigate(-1);   // go back to previous page (product detail)
    }
  }}
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
      <div    className="profile-icon">
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

      {/* Category Navbar */}
      <nav  className="nav-category">
        {/* 🔙 Back Button */}
    <button 
      onClick={() => navigate(-1)}
      style={{
        background: "transparent",
        border: "none",
        fontSize: "15px",
        cursor: "pointer",
        marginRight: "15px",
      }}
    >
      ⬅ Back 
    </button>
        <span className="nav-item" onClick={() => navigate("/products")}>Home</span>
        {Object.keys(menuItems).map(mainCat => (
          <div key={mainCat} className="menu-item" style={{ position: "relative" }}>
            <span className="nav-item">{mainCat} ⏷</span>
            <div className="dropdown-menu">
              {menuItems[mainCat].map(subCat => (
                <button key={subCat} style={dropdownButtonStyle} 
                onClick={() => {setFilter({ main: mainCat, sub: subCat });
                  navigate(`/products?main=${mainCat}&sub=${subCat}`);}}>{subCat}</button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Carousel */}
      <div style={{ margin: "20px 0" }}>
        <Carousel images={product?.images || []} />
      </div>


      {/* Product Details Section */}
      <div style={{ position: "sticky",display: "flex", gap: "20px", padding: "10px" }}>
        <div style={sidebarStyle}>

           <ProductGridSidebar products={filteredProducts} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={productDetailStyle}>
            {/* Product Image with Zoom */}
             <div style={{ width: "450px" }}>
  
  {/* --- Main Image Preview with Zoom --- */}
     
             
             {/* --- Thumbnails Section --- */}
          <div
    style={{
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      marginTop: "15px",
    }}
  >
    {[
      product.imgUrl,
      product.imgUrl2,
      product.imgUrl3,
      product.imgUrl4,
      product.imgUrl5,
    ]
      .filter((img) => img && img.trim() !== "")
      .map((img, idx) => {
        const url = img.startsWith("http")
          ? img
          : `http://localhost:8080${img}`;

        return (
          <img
            key={idx}
            src={url}
            onMouseEnter={() => setMainImage(url)}
            onClick={() => setMainImage(url)}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "6px",
              border: mainImage === url ? "2px solid #006e65" : "1px solid #ccc",
              cursor: "pointer",
            }}
          />
      );
    })}
</div>

              
              {product.discount && <div style={discountBadgeStyle}>{product.discount}% OFF</div>}
              <div
  ref={imgContainerRef}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  className="image-preview-box"
>

  {product.discount && <div style={discountBadgeStyle}>{product.discount}% OFF</div>}

    <div
  ref={zoomRef}
  className="image-preview"
  style={{
    backgroundImage: `url(${
      mainImage
        ? mainImage
        : product.imgUrl?.startsWith("http")
        ? product.imgUrl
        : `http://localhost:8080${product.imgUrl}`
    })`,
  }}
></div>



</div>

            </div>

            <div style={{ marginLeft: "30px" }}>
              <h2>{product.name}</h2>
              <p style={{ fontSize: "18px" }}>Brand: <strong>{product.brand}</strong></p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "10px 0" }}>
  
  {/* Final Price */}
  <span style={{ fontSize: "26px", fontWeight: "bold", color: "#006e65" }}>
    ₹{totalPrice}
  </span>

  {/* Original Price */}
  <span style={{
    fontSize: "18px",
    color: "#888",
    textDecoration: "line-through"
  }}>
    ₹{originalPrice}
  </span>

  {/* Discount */}
  <span style={{
    fontSize: "16px",
    fontWeight: "600",
    color: "#d32f2f"
  }}>
    {discountPercent}% OFF
  </span>

</div>

              <p style={{ margin: "10px 0" }}>{product.description}</p>
              <p style={{ color: "#555" }}>Delivery by <strong>{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()}</strong></p>
              <p>Stock: {product.quantity > 0 ? "Available" : "Out of Stock"}</p>

              {/* Quantity */}
              <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
                <button onClick={() => handleQuantityChange(-1)} style={quantityBtnStyle}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} style={quantityBtnStyle}>+</button>
              </div>

              {/* Wishlist / Cart / Buy */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px", width: "250px" }}>
                <button onClick={handleWishlist}
                 onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseExit}
                  style={{
                    ...wishlistBtnStyle,
                    backgroundColor: wishlistAdded ? "#ff6b81" : "#fff",
                    fontSize: "17px",
                    height: "50px",
                  }}>
                  {wishlistAdded ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
                </button>

                <button
  onClick={handleAddToCart}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseExit}
  style={{
    ...cartBtnStyle,
    fontSize: "17px",
    height: "50px",
    transition: "transform 0.2s ease-in-out"
  }}
>
  🛒 Add to Cart
</button>

<button
  ref={buyNowRef}
  onClick={handleBuyNow}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseExit}
  style={{
    ...buyNowBtnStyle,
    fontSize: "17px",
    height: "50px",
    transition: "transform 0.2s ease-in-out"
  }}
>
  ⚡ Buy Now
</button>


                {showAddressForm && (
                  <div ref={addressRef} className="address-section">
                    <div className="address-form-wrapper">
  <AddressForm
    onSubmit={handleAddressSubmit}
    onCancel={handleCancel}
  />
  </div>
  </div>
)}



              </div>

              {/* Tabs */}
              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
                  {["description", "specs", "reviews"].map(tab => (
                    <button key={tab} style={{ border: "none", background: "none", cursor: "pointer", fontWeight: selectedTab === tab ? "bold" : "normal" }} onClick={() => setSelectedTab(tab)}>
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: "10px" }}>
                  {selectedTab === "description" && <p>{product.description}</p>}

                  {selectedTab === "specs" && product.specifications && (
                    <ul>{Object.entries(product.specifications).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}</ul>
                  )}

                  {selectedTab === "reviews" && (
                    <div>
                      {/* Avg Rating */}
                      <div style={{ marginBottom: "15px" }}>
                        <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {product.reviews?.length || 0} Review(s) | Average Rating:{" "}
                          {product.reviews && product.reviews.length > 0
                            ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
                            : "N/A"}{" "}★
                        </p>
                      </div>

                      {/* Reviews list */}
                      {product.reviews?.length > 0 ? product.reviews.map((rev, i) => 
                      {
                          console.log(rev);
                          return(
                        <div key={i} style={{ borderBottom: "1px solid #eee", padding: "5px 0", position: "relative" }}>
                          <strong style={{ color: "#006e65" }}>{rev.reviewerName || "Anonymous"}</strong>
                          <p>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</p>
                          <p>{rev.comment}</p>
                          
                          <button onClick={() => handleDeleteReview(product.id,rev.id)} style={deleteBtnStyle}>🗑️ Delete</button>
                        </div>
                      );
           }) : <p>No reviews yet.</p>}

                      {/* Add review form */}
                      <form onSubmit={handleReviewSubmit} style={{ marginTop: "15px" }}>
                        <input type="text" placeholder="Your Name" value={reviewForm.reviewerName} onChange={e => setReviewForm({ ...reviewForm, reviewerName: e.target.value })} style={inputStyle} />
                        <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} style={inputStyle} />
                        <textarea placeholder="Comment" value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} style={inputStyle} />
                        <button type="submit" disabled={submittingReview} style={cartBtnStyle}>Submit Review</button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {showOrderSuccess && (
  <OrderSuccessPage
    orderId={successOrderId}
    onClose={() => {
      setShowOrderSuccess(false);
      navigate("/orders");
    }}
  />
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


      <Footer />
    </div>
  );
}

// 🎨 Styles
const dropdownButtonStyle = { margin: "5px 0", cursor: "pointer", display: "block", width: "100%", textAlign: "left", padding: "5px 10px", border: "none", background: "#f8f8f8", borderRadius: "4px" };
const sidebarStyle = { width: "260px", position: "sticky", top: "20px", background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #eee" };
const productDetailStyle = { display: "flex", gap: "30px", alignItems: "flex-start", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" };
const discountBadgeStyle = { position: "absolute", top: "5px", left: "5px", backgroundColor: "#ff3b3b", color: "#fff", padding: "5px 10px", borderRadius: "5px", fontWeight: "bold" };
const quantityBtnStyle = { padding: "5px 10px", border: "1px solid #ccc", cursor: "pointer" };
const cartBtnStyle = { backgroundColor: "#006e65", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" };
const buyNowBtnStyle = { backgroundColor: "#1aab56", color: "#fff", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" };
const wishlistBtnStyle = { border: "1px solid #ccc", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const inputStyle = { marginBottom: "5px", width: "100%", padding: "5px" };
const deleteBtnStyle = { position: "absolute", right: "5px", top: "5px", border: "none", background: "green", color: "white", padding: "4px 8px", borderRadius: "5px", cursor: "pointer" };

// Dropdown styling
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
.dropdown-menu button:hover { background: #ddd; }
`;
document.head.appendChild(style);

export default ProductDetailPage;

