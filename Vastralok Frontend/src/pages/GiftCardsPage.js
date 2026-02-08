import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GiftCardsPage() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [email, setEmail] = useState("");

  const presetAmounts = [200, 500, 1000, 2000];

  const handleBuyNow = () => {
    if (!amount && !customAmount) return alert("Please select or enter an amount");
    if (!sender || !receiver || !email) return alert("Please fill all details");

    alert("Gift Card Purchased Successfully!");
  };

  return (
    <div style={styles.container}>

      {/* ❌ Close Button */}
      <span style={styles.closeBtn} onClick={() => navigate("/products")}>✖</span>

      <h2 style={styles.heading}>Gift Cards</h2>

      {/* Gift Card Image */}
      <div style={styles.imageBox}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1047/1047501.png"
          alt="giftcard"
          style={{ width: "130px" }}
        />
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Send Happiness 🎁</p>
      </div>

      {/* Amount Selection */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Select Gift Card Amount</h3>

        <div style={styles.amountBox}>
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              style={{
                ...styles.amountButton,
                background: amount === amt ? "#0C73EB" : "#fff",
                color: amount === amt ? "white" : "black"
              }}
              onClick={() => {
                setAmount(amt);
                setCustomAmount("");
              }}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Enter custom amount"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setAmount("");
          }}
          style={styles.customInput}
        />
      </div>

      {/* Sender / Receiver Details */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Gift Card Details</h3>

        <input
          type="text"
          placeholder="Sender Name"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Receiver Name"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Receiver Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Preview */}
      <div style={styles.previewCard}>
        <h3 style={styles.subHeading}>Preview</h3>

        <div style={styles.previewContent}>
          <p><strong>Amount:</strong> ₹{amount || customAmount || "0"}</p>
          <p><strong>From:</strong> {sender || "---"}</p>
          <p><strong>To:</strong> {receiver || "---"}</p>
          <p><strong>Email:</strong> {email || "---"}</p>
        </div>
      </div>

      {/* Buy Now */}
      <button style={styles.buyButton} onClick={handleBuyNow}>
        Buy Now
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px 30px",
    maxWidth: "650px",
    margin: "auto",
    fontFamily: "Arial",
    position: "relative",
  },

  // X Close Button
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    cursor: "pointer",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#444",
  },

  heading: {
    fontSize: "30px",
    marginBottom: "20px",
  },

  imageBox: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },

  subHeading: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  amountBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },

  amountButton: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  customInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  previewCard: {
    background: "#fafafa",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  previewContent: {
    lineHeight: 1.8,
  },

  buyButton: {
    width: "100%",
    padding: "15px",
    background: "#0C73EB",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
