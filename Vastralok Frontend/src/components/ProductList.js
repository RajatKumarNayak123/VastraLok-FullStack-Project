// src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

function ProductList() {
  const { main, sub } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products") // tumhara backend endpoint
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const filtered = allProducts.filter(
        (p) =>
          p.mainCategory.toLowerCase() === main.toLowerCase() &&
          p.subCategory.toLowerCase() === sub.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [allProducts, main, sub]);

  return (
    <div>
      <h2>
        Showing {sub} in {main}
      </h2>
      <ProductGrid products={filteredProducts} />
    </div>
  );
}

export default ProductList;
