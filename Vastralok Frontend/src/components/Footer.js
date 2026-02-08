// Footer.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Quick Links */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Quick Links</h3>
          <ul style={styles.list}>
            <li><a href="/" style={styles.link}>Home</a></li>
            <li><a href="/products" style={styles.link}>Products</a></li>
            <li><a href="/cart" style={styles.link}>Cart</a></li>
            <li><a href="/contact" style={styles.link}>Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Follow Us</h3>
          <div style={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={styles.iconCircle}>
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={styles.iconCircle}>
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.iconCircle}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={styles.iconCircle}>
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Newsletter</h3>
          <p>Subscribe to get the latest offers and updates.</p>
          <div style={styles.newsletter}>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
            />
            <button style={styles.subscribeBtn}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <p>© {new Date().getFullYear()} ShopZone. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "40px 20px 15px",
    marginTop: "40px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "30px",
    marginBottom: "30px",
  },
  section: {
    flex: "1 1 250px",
  },
  heading: {
    fontSize: "18px",
    marginBottom: "15px",
    borderBottom: "2px solid #444",
    display: "inline-block",
    paddingBottom: "5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "#bbb",
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
    transition: "color 0.3s",
  },
  iconCircle: {
    width: "40px",
    height: "40px",
    backgroundColor: "#222",
    color: "#bbb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontSize: "18px",
    marginRight: "10px",
    transition: "all 0.3s ease",
  },
  socialIcons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  newsletter: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px 0 0 4px",
    border: "none",
    outline: "none",
  },
  subscribeBtn: {
    backgroundColor: "#ff6600",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  bottomBar: {
    textAlign: "center",
    borderTop: "1px solid #333",
    paddingTop: "12px",
    fontSize: "14px",
    color: "#aaa",
  },
};

export default Footer;


