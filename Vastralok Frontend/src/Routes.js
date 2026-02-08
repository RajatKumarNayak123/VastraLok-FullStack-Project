import { Routes, Route } from "react-router-dom";
import LoginForm from "./LoginForm";
import Register from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import ProductGrid from "./ProductGrid";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="/products" element={<ProductGrid />} />
    </Routes>
  );
};

export default AppRoutes;
