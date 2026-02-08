import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import "./FilterSidebar.css";

const FilterSidebar = ({
  availableFilters,
  selected,
  setSelected,
  price,
  setPrice,
  onClearAll,
  onSearch,
  searchQuery,
}) => {
  const [localFilters, setLocalFilters] = useState(availableFilters);
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    color: true,
    size: true,
    price: true,
  });

  useEffect(() => {
    setLocalFilters(availableFilters);
  }, [availableFilters]);

  const handleCheckboxChange = (type, value) => {
    setSelected((prev) => {
      const isSelected = prev[type]?.includes(value);
      return {
        ...prev,
        [type]: isSelected
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const toggleSection = (type) => {
    setOpenSections((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <SlidersHorizontal size={20} />
        <h3>Filters</h3>
      </div>

      {/* 🔍 Search Bar */}
      <div className="filter-search-group">
        <input
          type="text"
          className="filter-search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* 🧩 Dynamic Filters */}
      {["category", "brand", "color", "size"].map((type) => (
        <div className="filter-group" key={type}>
          <div className="filter-group-header" onClick={() => toggleSection(type)}>
            <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            {openSections[type] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {openSections[type] && (
            <div className="filter-items">
              {localFilters[type]?.length ? (
                localFilters[type].map((value) => (
                  <label key={value} className="filter-item">
                    <input
                      type="checkbox"
                      checked={selected[type]?.includes(value)}
                      onChange={() => handleCheckboxChange(type, value)}
                    />
                    <span>{value}</span>
                  </label>
                ))
              ) : (
                <div className="no-options">No options</div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 💰 Price Filter */}
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection("price")}>
          <h4>Price Range</h4>
          {openSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {openSections.price && (
          <div className="price-row">
            <input
              type="number"
              className="price-input"
              placeholder="Min"
              value={price.min}
              onChange={(e) => setPrice((prev) => ({ ...prev, min: e.target.value }))}
            />
            <input
              type="number"
              className="price-input"
              placeholder="Max"
              value={price.max}
              onChange={(e) => setPrice((prev) => ({ ...prev, max: e.target.value }))}
            />
          </div>
        )}
      </div>

      <button onClick={onClearAll} className="clear-btn">
        Clear All Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
