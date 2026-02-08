import React from "react";
import { useNavigate } from "react-router-dom";
import "./DealSection.css";

const DealSection = ({ title, products }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/product/${id}`); // ✅ Navigate to ProductDetailPage
  };

  return (
    <div className="deal-section">
      <h2 className="deal-title">{title}</h2>
      <div className="deal-products">
        {products.map((product) => (
          <div
            key={product.id}
            className="deal-card"
          >
            <img src={product.imageUrl} alt={product.name} className="deal-image"
              loading="lazy" draggable="false"/>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealSection;
