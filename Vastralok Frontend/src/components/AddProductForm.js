import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import "./AddProductForm.css";

const AddProductForm = ({ productToEdit, onProductUpdated, clearEditing }) => {
  const initialState = {
    name: "",
    description: "",
    price: "",
    imgUrl: "",
    imgUrl2: "",
    imgUrl3: "",
    imgUrl4: "",
    imgUrl5: "",
    category: "",
    mainCategory: "",
    subCategory: "",
    brand: "",
    color: "",
    size: "",
    quantity:"",
    sellingPrice:0,
  };

  const [product, setProduct] = useState(initialState);
  const [mainPreview, setMainPreview] = useState("");
   const navigate = useNavigate();
  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
      setMainPreview(productToEdit.imgUrl || "");
    } else {
      setProduct(initialState);
      setMainPreview("");
    }
  }, [productToEdit]);

  const handleChange = (e) => {
   const { name, value, type } = e.target;

  setProduct({
    ...product,
    [name]: type === "number" ? Number(value) : value,
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      };

      if (product.id) {
        await axios.put(
          `http://localhost:8080/api/products/${product.id}`,
          product,
          config
        );
        alert("✅ Product updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8080/api/products/add",
          product,
          config
        );
        alert("✅ Product added successfully!");
      }

      if (typeof onProductUpdated === "function") {
  onProductUpdated();
}

      if (typeof clearEditing === "function") {
  clearEditing();
}
      setProduct(initialState);
      setMainPreview("");
    } catch (error) {
      console.error("❌ Error saving product:", error);
      alert("❌ Error saving product. Please check backend logs.");
    }
  };


  const handleClearForm = () => {
    setProduct(initialState);
    setMainPreview("");
    clearEditing();
  };

  const handleThumbnailClick = (url) => {
    if (url) setMainPreview(url);
  };

  return (
    <div className="page-container">
      {/* ✅ Header */}
      <header className="header">
        <h1 className="project-title">🛍️ Vastralok</h1>
      </header>
       
      {/* ✅ Add / Edit Product Form */}
      <div className="add-product-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <h2>{product.id ? "Edit Product" : "Add New Product"}</h2>

          <div className="form-grid">
            <input
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
              required
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
              required
            />
            <input
              name="brand"
              placeholder="Brand"
              value={product.brand}
              onChange={handleChange}
            />
            <input
              name="color"
              placeholder="Color"
              value={product.color}
              onChange={handleChange}
            />
            <input
              name="size"
              placeholder="Size"
              value={product.size}
              onChange={handleChange}
            />
            <input
              name="category"
              placeholder="Category"
              value={product.category}
              onChange={handleChange}
            />
            <input
              name="mainCategory"
              placeholder="Main Category"
              value={product.mainCategory}
              onChange={handleChange}
            />
            <input
              name="subCategory"
              placeholder="Sub Category"
              value={product.subCategory}
              onChange={handleChange}
            />
            <input
              name="imgUrl"
              placeholder="Main Image URL"
              value={product.imgUrl}
              onChange={handleChange}
              required
            />
            <input
              name="imgUrl2"
              placeholder="Image URL 2"
              value={product.imgUrl2}
              onChange={handleChange}
            />
            <input
              name="imgUrl3"
              placeholder="Image URL 3"
              value={product.imgUrl3}
              onChange={handleChange}
            />
            <input
              name="imgUrl4"
              placeholder="Image URL 4"
              value={product.imgUrl4}
              onChange={handleChange}
            />
            <input
              name="imgUrl5"
              placeholder="Image URL 5"
              value={product.imgUrl5}
              onChange={handleChange}
            />
            <input
      name="sellingPrice"
      type="number"
      step="0.01"
      placeholder="Selling Price"
      value={product.sellingPrice}
      onChange={handleChange}
      required
    />

    <input
      name="quantity"
      type="number"
      placeholder="Quantity"
      value={product.quantity}
      onChange={handleChange}
      required
    />

          </div>

          {/* ✅ Image Preview Section */}
          <div className="image-preview-section">
            <div className="thumbnail-gallery">
              {[product.imgUrl, product.imgUrl2, product.imgUrl3, product.imgUrl4, product.imgUrl5]
                .filter(Boolean)
                .map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail"
                    onMouseEnter={() => handleThumbnailClick(url)}
                    onClick={() => handleThumbnailClick(url)}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ))}
            </div>

            <div className="main-preview">
              {mainPreview && (
                <img
                  src={mainPreview}
                  alt="Main Preview"
                  className="main-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>
          </div>

          <textarea
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            rows="4"
          />

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {product.id ? "Update Product" : "Add Product"}
            </button>
            <button
              type="button"
              className="clear-btn"
              onClick={handleClearForm}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Footer */}
      <footer className="footer">
        <p>© 2025 <strong>Vastralok</strong>. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AddProductForm;
