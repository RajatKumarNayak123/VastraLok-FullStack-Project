 // src/components/ProductGrid.js
import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
const ProductGrid = ({ filter = {}, searchQuery = "", sortOrder = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Read URL params as fallback
  const paramsURL = new URLSearchParams(location.search);
  const fallbackMain = paramsURL.get("main");
  const fallbackSub = paramsURL.get("sub");
  const fallbackCategory = paramsURL.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        // 🔥 Highest priority → Sidebar filters
        // 🔥 If sidebar empty → URL se lo (fallback)
        const mainValue = filter.main || fallbackMain;
        const subValue = filter.sub || fallbackSub;
        const categoryValue = filter.category || fallbackCategory;

        if (mainValue) params.append("main", mainValue);
        if (subValue) params.append("sub", subValue);
        if (categoryValue) params.append("category", categoryValue);

        if (filter.brand) params.append("brand", filter.brand);
        if (filter.color) params.append("color", filter.color);
        if (filter.size) params.append("size", filter.size);
        if (filter.minPrice) params.append("minPrice", filter.minPrice);
        if (filter.maxPrice) params.append("maxPrice", filter.maxPrice);
        if (searchQuery) params.append("search", searchQuery);

        let endpoint = "/api/products/filter";
        if ([...params].length > 0) {
          endpoint = `/api/products/filter?${params.toString()}`;
        }

        console.log("🔥 Fetching products from:", endpoint);

        const response = await api.get(endpoint);
        let data = response.data;

        console.log("💡 Response data:", data);

        // 🔍 Local search filter
        if (searchQuery) {
          data = data.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // ↕ Sorting
        if (sortOrder === "low") data = [...data].sort((a, b) => a.price - b.price);
        if (sortOrder === "high") data = [...data].sort((a, b) => b.price - a.price);

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("❌ Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, searchQuery, sortOrder, location.search]); // 🔥 URL change will re-fetch

  // 🛒 Add to Cart
  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ Please login first to add to cart.");
      return;
    }

    try {
      await api.post(`/api/cart/add/${productId}`, { quantity: 1 });
      toast.success("✅ Product added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data || "❌ Failed to add product to cart.");
    }
  };

  // 📌 Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading && (
        <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "600" }}>
          ⏳ Loading products...
        </p>
      )}

      <div
        style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    alignItems: "start",
  }}
      >
        {!loading && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="card"
              onClick={() => handleProductClick(product.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #eee",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                background: "#fff",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={product.imgUrl}
                alt={product.name}
                style={{ width: "100%", height: "260px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://picsum.photos/300/300";
                }}
              />
              <div style={{ padding: "12px", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "6px" ,height: "50px",           // 🔥 Fixes title height
    overflow: "hidden",  }}>
                  {product.name}
                </h3>
                <p style={{ color: "#ff3e6c", fontSize: "1.2rem", fontWeight: "bold" }}>
                  ₹{product.price}
                </p>
                <p style={{ fontSize: "12px", color: "#555" }}>{product.brand}</p>
                <button
                  onClick={(e) => handleAddToCart(product.id, e)}
                  style={{
                    marginTop: "10px",
                    padding: "10px 16px",
                    backgroundColor: "#ff3e6c",
                    color: "#fff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "25px",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6325a")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff3e6c")}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p style={{ textAlign: "center", width: "100%" }}>❌ No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;