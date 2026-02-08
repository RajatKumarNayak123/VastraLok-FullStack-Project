// AddressForm.js
import React, { useState } from "react";
import { toast } from "react-toastify";

function AddressForm({ onSubmit, onClose }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [village, setVillage] = useState("");
  const [town, setTown] = useState("");
  const [dist, setDist] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone ||!village || !street || !town || !dist ||!state || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    onSubmit({ fullName, phone, village, street, town, dist, state, pincode });
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>📍 Delivery Address</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="text" placeholder="Full Name *" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
        <input type="tel" placeholder="Phone Number *" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Street *" value={street} onChange={e => setStreet(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Village" value={village} onChange={e => setVillage(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="Town/City *" value={town} onChange={e => setTown(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="District *" value={dist} onChange={e => setDist(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="State *" value={state} onChange={e => setState(e.target.value)} style={inputStyle}/>
        <input type="text" placeholder="Pincode *" value={pincode} onChange={e => setPincode(e.target.value)} style={inputStyle} />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}>Cancel</button>
          <button type="submit" style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#006e65", color: "white", fontWeight: "bold", cursor: "pointer" }}>Continue</button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box"
};

export default AddressForm;
