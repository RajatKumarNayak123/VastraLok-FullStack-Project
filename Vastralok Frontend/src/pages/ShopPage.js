// src/pages/ShopPage.js
import React, { useState, useEffect } from "react";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import api from "../axiosConfig";

export default function ShopPage() {
  const [availableFilters, setAvailableFilters] = useState({});
  const [selected, setSelected] = useState({});
  const [price, setPrice] = useState({ min: "", max: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder] = useState("");

  // ✅ Backend se products fetch karke filters extract
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await api.get("/api/products/filter");

        const products = res.data;

        // 🔹 Unique filters extract karo
        const categories = [...new Set(products.map((p) => p.category))];
        const brands = [...new Set(products.map((p) => p.brand))];
        const colors = [...new Set(products.map((p) => p.color))];
        const sizes = [...new Set(products.map((p) => p.size))];

        // 🔹 Sidebar ke liye object set karo
        setAvailableFilters({
          category: categories,
          brand: brands,
          color: colors,
          size: sizes,
        });
      } catch (err) {
        console.error("Error fetching filters", err);
      }
    };

    fetchFilters();
  }, []);

  const onClearAll = () => {
    setSelected({});
    setPrice({ min: "", max: "" });
    setSearchQuery("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ✅ Left Sidebar */}
      <div style={{ width: "260px", borderRight: "1px solid #eee" }}>
        <FilterSidebar
          availableFilters={availableFilters}
          selected={selected}
          setSelected={setSelected}
          price={price}
          setPrice={setPrice}
          onClearAll={onClearAll}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />
      </div>

      {/* ✅ Right Side Product Grid */}
      <div style={{ flex: 1, background: "#fafafa" }}>
        <ProductGrid
          filter={{
            ...selected, // ✅ category, brand, color, size pass hoga
            minPrice: price.min,
            maxPrice: price.max,
          }}
          searchQuery={searchQuery}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
}
