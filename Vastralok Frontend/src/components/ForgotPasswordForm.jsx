import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPasswordForm.css"; // ✅ CSS file import

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    setMessage("❌ Please enter your email!");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    await axios.post(
      "http://localhost:8080/api/auth/forgot-password",
      { email },
      { headers: { "Content-Type": "application/json" } }
    );

    setMessage("✅ OTP sent to your registered email. Please check inbox/spam.");

    setTimeout(() => {
      navigate("/reset-password", { state: { email } });
    }, 2500);

  } catch (err) {
    setMessage(
      typeof err.response?.data === "string"
        ? err.response.data
        : "❌ Email not found or request failed!"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Forgot Password</h2>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="btn-group">
            <button type="submit" disabled={loading} className="btn-forgot">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
