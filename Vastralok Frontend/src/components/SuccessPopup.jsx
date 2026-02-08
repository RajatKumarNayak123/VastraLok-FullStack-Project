import React, { useEffect } from "react";
import "./SuccessPopup.css";

const SuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-overlay">
      <div className="success-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="success"
          className="success-tick"
        />

        <h3>{message}</h3>
      </div>
    </div>
  );
};

export default SuccessPopup;
