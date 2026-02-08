// src/components/PriceFilter.js
import React, { useState } from "react";

const PriceFilter = ({ onChange }) => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const handleApply = () => {
    onChange({
      minPrice: min ? Number(min) : null,
      maxPrice: max ? Number(max) : null,
    });
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "20px",
        background: "#fafafa",
      }}
    >
      <h4 style={{ marginBottom: "10px" }}>💰 Price Range</h4>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="number"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          style={{
            flex: 1,
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          style={{
            flex: 1,
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleApply}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ff3e6c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
