import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink
          to="/products"
          className="text-2xl sm:text-3xl font-bold tracking-wider text-yellow-400 hover:text-yellow-300 transition"
        >
          VastraLok
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {["Shop", "Cart", "My Orders"].map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "hover:text-yellow-400"
                }`
              }
            >
              {link}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="hidden md:inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-md transition"
        >
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-6 pb-4 space-y-3 animate-slide-down">
          {["Shop", "Cart", "My Orders"].map((link) => (
            <NavLink
              key={link}
              to={`/${link.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `block text-lg transition-colors duration-200 ${
                  isActive
                    ? "text-yellow-400 font-semibold"
                    : "hover:text-yellow-400"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </NavLink>
          ))}
          <button
            onClick={handleLogoutClick}
            className="w-full mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
