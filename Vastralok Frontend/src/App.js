import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import ProductGrid from "./components/ProductGrid";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginForm from "./components/LoginForm";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ShopPage from "./pages/ShopPage";
import CartViewer from "./components/CartViewer";
import Register from "./components/Register";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import ProtectedRoute from "./components/ProtectedRoute";
import WishlistPage from "./pages/WishlistPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import GiftCardsPage from "./pages/GiftCardsPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import RewardsPage from "./pages/RewardsPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
//import WeddingSection from "./components/WeddingSection";
import AddProductForm from "./components/AddProductForm";
import MyReturnsPage from "./pages/MyReturnsPage";
import ReturnItemsPage from "./pages/ReturnItemsPage";
import AdminReturnsPage from "./pages/AdminReturnsPage";

//import api from "./axiosConfig";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [cart, setCart] = useState([]); // centralized cart state
  // ✅ Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCart([]);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ViewProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/gifts" element={<GiftCardsPage />} />
        <Route path="/rewards" element={<RewardsPage />} />

        {/* Payment / Checkout */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PaymentPage  cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductsPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

<Route path="/add-product" element={<AddProductForm />} />

<Route path="/my-returns" element={<MyReturnsPage />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CartViewer cart={cart} setCart={setCart}/>
            </ProtectedRoute>
          }
        />

        <Route
  path="/return-items"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <ReturnItemsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/returns"
  element={
      <AdminReturnsPage />

  }
/>



        {/* Default / Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;