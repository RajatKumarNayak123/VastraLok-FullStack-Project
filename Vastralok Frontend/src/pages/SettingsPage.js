import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

function SettingsPage() {
  const navigate = useNavigate();

  // Fake user data
  const fakeData = {
    fullName: "Rajat Kumar Nayak",
    email: "rajatnayak@example.com",
    phone: "+91 9876543210",
    address: "123, Green Park, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    zip: "110016",
    bio: "Hi! I am a software developer. Love coding and coffee.",
  };

  const [formData, setFormData] = useState(fakeData);
  const [backupData, setBackupData] = useState(fakeData); // Backup to restore on cancel
  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditable(false);
    setBackupData(formData); // Save current data as backup
    alert("✅ Information saved!");
  };

  const handleCancel = () => {
    setFormData(backupData); // Restore previous data
    setIsEditable(false);
  };

  return (
    <div className="account-settings-container">
      {/* Top Buttons */}
      <div className="top-bar">
        <button className="close-btn" onClick={() => navigate("/products")}>✕</button>
        {!isEditable && <button className="edit-btn" onClick={() => setIsEditable(true)}>Edit</button>}
      </div>

      <h2>Account Settings</h2>

      <form className="account-settings-form" onSubmit={handleSave}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditable} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditable} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditable} />
          </div>
          <div className="form-group">
            <label>ZIP Code</label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} disabled={!isEditable} />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditable} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} disabled={!isEditable} />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} disabled={!isEditable} />
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} disabled={!isEditable}></textarea>
        </div>

        {isEditable && (
          <div className="form-buttons">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default SettingsPage;
