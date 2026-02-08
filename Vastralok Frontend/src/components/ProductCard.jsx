import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.imgUrl} alt={product.name} className="product-img" />
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="brand">{product.brand}</span>
          <span className="price">₹{product.price}</span>
        </div>
        <div className="product-actions">
          <button onClick={() => onAddToCart && onAddToCart(product)} className="btn-add">Add</button>
        </div>
      </div>
    </div>
  );
}
