import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewProfilePage.css";
import api from "../axiosConfig";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch profile
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/auth/profile");
      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Image preview
  useEffect(() => {
    if (selectedImage) setPreview(URL.createObjectURL(selectedImage));
    else setPreview(null);
  }, [selectedImage]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setFormData(user);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATE PROFILE (BACKEND CALL)
  const handleSave = async () => {
    try {
      const res = await api.put("/api/auth/update-profile", formData);
      setUser(res.data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
    }
  };

  // Upload profile picture
  const handleImageUpload = async () => {
  if (!selectedImage) return alert("Please select an image first!");

  const imageForm = new FormData();
  imageForm.append("file", selectedImage);

  try {
    const response = await api.post(
      "/api/auth/upload-profile-pic",
      imageForm,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // backend returns fileName
    const fileName = response.data.fileName || response.data;

    setUser({ ...user, profileImage: fileName });
    setFormData({ ...formData, profileImage: fileName });

    setSelectedImage(null);
    setPreview(null);

    alert("Profile picture updated successfully!");
  } catch (err) {
    console.error("Upload error:", err);
    alert("Error uploading profile picture");
  }
};

useEffect(() => {
  if (!selectedImage) return;

  const objectUrl = URL.createObjectURL(selectedImage);
  setPreview(objectUrl);

  return () => URL.revokeObjectURL(objectUrl);
}, [selectedImage]);



  const handleRemovePhoto = async () => {
    try {
      await api.delete("/api/auth/remove-profile-pic");
      setUser({ ...user, profileImage: null });
      setFormData({ ...formData, profileImage: null });
      alert("Profile picture removed successfully!");
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  if (!user) return <div className="profile-page">Loading...</div>;

    const getProfileImageUrl = () => {
  if (preview) return preview;

  if (user?.profileImage) {
    // If backend already returned full URL
    if (user.profileImage.startsWith("http")) {
      return user.profileImage;
    }

    // If only filename stored
    return `http://localhost:8080/uploads/profile-pics/${user.profileImage}`;
  }

  return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
};




  return (
    <div className="profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <div className="sidebar-header">
          <div className="profile-avatar">
            <img
             src={getProfileImageUrl()}
             alt="Profile"
             className="avatar-img"
            />
          </div>
          <h3>Hello,</h3>
          <p>{user.name}</p>
        </div>

        <ul className="sidebar-menu">
          <li><strong>MY ORDERS</strong></li>
          <li>Orders</li>

          <li className="clickable" onClick={() => navigate("/admin/returns")}>
            Admin Requests
          </li>

          <li className="clickable" onClick={() => navigate("/add-product")}>
            ➕ Add Products
          </li>

          <li><strong>ACCOUNT SETTINGS</strong></li>
          <li>Profile Information</li>
          <li>Manage Addresses</li>
          <li>PAN Card Information</li>

          <li><strong>PAYMENTS</strong></li>
          <li>Gift Cards</li>
          <li>Saved UPI</li>
          <li>Saved Cards</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <h2>Personal Information</h2>

        {/* Profile Picture */}
        <div className="profile-picture-section">
          <img
               src={getProfileImageUrl()}
               alt="Profile"
               className="profile-pic"
           />


          <input
            type="file"
            accept="image/*"
            id="profilePicInput"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />

          <div className="upload-btns">
            <button
              className="btn-upload"
              onClick={() => document.getElementById("profilePicInput").click()}
            >
              📸 Choose Photo
            </button>

            {selectedImage && (
              <button className="btn-save" onClick={handleImageUpload}>
                Save Photo
              </button>
            )}

            {user.profileImage && (
              <button className="btn-remove" onClick={handleRemovePhoto}>
                ❌ Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* INFO SECTION */}
        {!editing ? (
          <div className="info-section">
            <div className="info-row"><label>Name:</label><span>{user.name}</span></div>
            <div className="info-row"><label>Gender:</label><span>{user.gender}</span></div>
            <div className="info-row"><label>Email:</label><span>{user.email}</span></div>
            <div className="info-row"><label>Mobile:</label><span>{user.phone}</span></div>

            <button className="edit-btn" onClick={handleEdit}>
              ✏️ Edit
            </button>
          </div>
        ) : (
          <div className="edit-section">
            <div className="form-row">
              <label>Name:</label>
              <input name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Gender:</label>
              <input name="gender" value={formData.gender} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Email:</label>
              <input name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Mobile:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="btn-group">
              <button className="save-btn" onClick={handleSave}>💾 Save</button>
              <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
