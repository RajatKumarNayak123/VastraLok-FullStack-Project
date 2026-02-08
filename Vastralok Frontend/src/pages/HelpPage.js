import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function HelpPage() {
  const [faqOpen, setFaqOpen] = useState(null);
  const navigate = useNavigate();
  const toggleFAQ = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div style={styles.container}>

       {/* ❌ Close Button (Top Right) */}
        <button className="close-btn" onClick={() => navigate("/products")}>✕</button>
      <h2 style={styles.heading}>Help & Support</h2>

      {/* Section 1: Quick Action Buttons */}
      <div style={styles.buttons}>
        <button style={styles.button}>Track My Order</button>
        <button style={styles.button}>Start a Return</button>
        <button style={styles.button}>Report an Issue</button>
      </div>

      {/* Section 2: Common Issues */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Common Issues</h3>
        <ul style={styles.list}>
          <li>Order not delivered</li>
          <li>Payment deducted but order not placed</li>
          <li>Item received is damaged / wrong</li>
          <li>Return not picked up</li>
          <li>Refund taking too long</li>
        </ul>
      </div>

      {/* Section 3: FAQ Accordion */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Frequently Asked Questions</h3>

        {faqData.map((faq, i) => (
          <div key={i} style={styles.faqItem}>
            <div style={styles.faqQuestion} onClick={() => toggleFAQ(i)}>
              <span>{faq.question}</span>
              <span>{faqOpen === i ? "▲" : "▼"}</span>
            </div>

            {faqOpen === i && (
              <div style={styles.faqAnswer}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* Section 4: Submit a Support Ticket */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Submit a Support Ticket</h3>

        <form style={styles.form}>
          <input type="text" placeholder="Your Name" style={styles.input} />
          <input type="email" placeholder="Email Address" style={styles.input} />
          <input type="text" placeholder="Order ID (Optional)" style={styles.input} />
          <textarea
            placeholder="Describe your issue..."
            rows="4"
            style={styles.textarea}
          ></textarea>
          <button style={styles.submitButton}>Submit Ticket</button>
        </form>
      </div>

      {/* Section 5: Contact Info */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Contact Us</h3>
        <p><strong>📞 Customer Care:</strong> +91 98765 43210 (9 AM – 9 PM)</p>
        <p><strong>📧 Email:</strong> support@vastralok.in</p>
        <p><strong>📍 Address:</strong> Vastralok Pvt Ltd, Bengaluru, India</p>
      </div>
    </div>
  );
}

// ----------------- FAQ DATA -----------------
const faqData = [
  {
    question: "How do I track my order?",
    answer:
      "Go to 'My Orders' page → Select your order → Click 'Track Order'. You will see live tracking updates.",
  },
  {
    question: "What is the return period?",
    answer:
      "Most items can be returned within 7 days of delivery. Some categories may differ depending on seller policy.",
  },
  {
    question: "How long will my refund take?",
    answer:
      "Refunds usually take 3–7 business days after pickup or drop-off is completed.",
  },
  {
    question: "I received a damaged product. What should I do?",
    answer:
      "Start a return immediately or raise a ticket using the form above. We will resolve it within 24 hours.",
  },
  {
    question: "Why is my payment stuck?",
    answer:
      "Sometimes banks delay confirmation. If the amount is deducted, it will be auto-refunded within 24–48 hours.",
  },
];

// ----------------- Styles -----------------
const styles = {
  container: {
    padding: "20px 30px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial",
  },
  heading: {
    fontSize: "30px",
    marginBottom: "20px",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#0C73EB",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
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
  list: {
    lineHeight: "2",
  },
  faqItem: {
    marginBottom: "10px",
  },
  faqQuestion: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    background: "#f7f7f7",
    padding: "10px",
    borderRadius: "8px",
  },
  faqAnswer: {
    marginTop: "8px",
    background: "#fafafa",
    padding: "10px",
    borderRadius: "8px",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "2px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#28A745",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};
