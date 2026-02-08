import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import "./WeddingSection.css";

const WeddingSection = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch only wedding products
    api
      .get("/api/products/filter?category=Wedding")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching wedding products:", err));
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="wedding-section">
      <h2 className="wedding-title">💍 Wedding Collection 💐</h2>

      <div className="wedding-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="wedding-card"
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="wedding-image"
            />
            <div className="wedding-info">
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingSection;
