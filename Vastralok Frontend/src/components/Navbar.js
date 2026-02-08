import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const categories = {
  Men: ["Jeans", "T-Shirt", "Footwear", "Watch", "Trousers","Wedding Collections","Party Wear","Suits","Formals","Jackets","Sweater",],
  Women: ["Saree", "Lehenga", "Tops", "Jewellery","Makeup Kits","Winter Wear","Footwears","Wedding Collections","Party Wear","Scarf"],
  Kids: ["All","Shirts", "Shorts", "Shoes","Toys","Baby Oil","Baby Caps","Baby Powder","Powder Milk"],
  Electronics: ["Phone", "IPhone", "Laptop", "Headphone","TV","","Refrigerator","Mixer","Room Heater"],
  Furnishings:["Beds","Curtains","Dinning","Chairs","Sofa","Mats","Tables",""]
};

function Navbar() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="logo" onClick={() => navigate("/")}>VastraLok</div>

      <div className="menu">
        {Object.keys(categories).map((main) => (
          <div
            className="menu-item"
            key={main}
            onMouseEnter={() => setActive(main)}
            onMouseLeave={() => setActive(null)}
          >
            <span>{main}</span>

            {active === main && (
              <div className="dropdown">
                {categories[main].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      navigate(`/products?main=${main}&sub=${sub}`);
                      setActive(null);   // ⭐ FIX: Close dropdown
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="right">
        <Link to="/cart">🛒 Cart</Link>
        <Link to="/wishlist">❤️ Wishlist</Link>
        <Link to="/orders">📦 Orders</Link>

        <div
          className="profile"
          onMouseEnter={() => setActive("profile")}
          onMouseLeave={() => setActive(null)}
        >
          <div className="profile-icon">
            {(localStorage.getItem("username") || "R").charAt(0).toUpperCase()}
          </div>

          {active === "profile" && (
            <div className="profile-dropdown">
              <button onClick={() => { navigate("/profile"); setActive(null); }}>👤 View Profile</button>
              <button onClick={() => { navigate("/settings"); setActive(null); }}>⚙ Settings</button>
              <button onClick={() => { navigate("/rewards"); setActive(null); }}>🎁 Rewards</button>
              <button onClick={() => { navigate("/giftcards"); setActive(null); }}>🎟 Gift Cards</button>
              <button onClick={() => { navigate("/help"); setActive(null); }}>❓ Help</button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setActive(null);
                  navigate("/login");
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
