import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [tab, setTab] = useState("login"); // "login" | "register" | "forgot"
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tab === "login") {
        const res = await axios.post("http://localhost:8080/api/auth/login", {
          username: formData.username,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/products"), 1500);
      } else if (tab === "register") {
        await axios.post("http://localhost:8080/api/auth/signup", formData);
        setMessage("✅ Registration successful! Please login.");
        setTab("login");
      } else if (tab === "forgot") {
        await axios.post("http://localhost:8080/api/auth/forgot-password", {
          email: formData.email,
        });
        setMessage("✅ OTP sent to your email!");
      }
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Something went wrong"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Tabs */}
        <div className="flex justify-around mb-6 border-b">
          <button
            className={`pb-2 font-semibold ${
              tab === "login" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`pb-2 font-semibold ${
              tab === "register" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
          <button
            className={`pb-2 font-semibold ${
              tab === "forgot" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setTab("forgot")}
          >
            Forgot Password
          </button>
        </div>

        {/* Messages */}
        {message && (
          <p
            className={`text-center mb-4 text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "login" && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
            </>
          )}

          {tab === "register" && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
            </>
          )}

          {tab === "forgot" && (
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {tab === "login"
              ? "Login"
              : tab === "register"
              ? "Register"
              : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
