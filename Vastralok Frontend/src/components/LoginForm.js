import React, { useState, useEffect } from "react";
//import api from "../axiosConfig";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react"; 
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
    const [showPassword, setShowPassword] = useState(false); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("registered") === "true") {
      setMessage("✅ Registration successful! Please login.");
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/login",
      {
        username: formData.username,
        password: formData.password,
      }
    );

    console.log("LOGIN RESPONSE 👉", res.data);

    localStorage.setItem("token", res.data.token);
   
    // 🔥 STEP 2 — YAHIN ADD HOGA
    const decoded = jwtDecode(res.data.token);
    console.log("DECODED TOKEN 👉", decoded);

    // Spring Security usually "sub" me username rakhta hai
    localStorage.setItem("username", decoded.username);
    

    setMessage("✅ Login successful");
    navigate("/products");

  } catch (err) {
    setMessage("❌ Invalid username or password");
  }
};


  return (
    <div className="login-wrapper">
      <div className="login-box premium-card">
        <h1 className="LOGO">VASTRALOK</h1>

        <h2 className="login-title">Welcome</h2>
        <p className="subtitle">Login to continue shopping with Vastralok</p>

        {message && (
          <div
            className={`message ${message.includes("✅") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group floating">
            <Mail className="icon" size={20} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label>Username Or Email</label>
          </div>

          {/* Password */}
          <div className="input-group floating">
           <Lock className="icon" size={20} />

  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  <label>Password</label>

  <div
    className="eye-wrapper"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </div>
</div>

          {/* Remember me + Forgot */}
          <div className="options">
            <label className="remember">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember Me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="forgot"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Social logins */}
        <div className="social-buttons">
          <button className="google-btn">
            <img
              src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
              alt="Google"
            />
            Continue with Google
          </button>
          <button className="fb-btn">
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
            />
            Continue with Facebook
          </button>
        </div>

        <p className="register-text">
          Don’t have an account?{" "}
          <button onClick={() => navigate("/register")} className="register">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

