import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const ProductGridSidebar = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setAllProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const start = page * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const visibleProducts = allProducts.slice(start, end);

  const nextPage = () => {
    if (end < allProducts.length) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Products */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {visibleProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => handleProductClick(p.id)}
            style={{
              cursor: "pointer",
              textAlign: "center",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "0.2s"
            }}
          >
            <img
              src={p.images?.[0] || p.imgUrl}
              alt={p.name}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />
            <p style={{ fontWeight: "bold", marginTop: "8px" }}>₹{p.price}</p>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px"
        }}
      >
        <button onClick={prevPage} disabled={page === 0}>⬅</button>
        <button onClick={nextPage} disabled={end >= allProducts.length}>➡</button>
      </div>
    </div>
  );
};

export default ProductGridSidebar;
