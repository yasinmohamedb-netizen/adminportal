import React, { useState } from "react";
import axios from "axios";
const API_BASE = "https://healthyz-backend.onrender.com/api";

function DeleteAccountPage({ user }) {
  const [email, setEmail] = useState(user?.email || "");
  const [username] = useState(user?.fullName || "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const reasons = [
    "Privacy concerns",
    "Creating a new account",
    "No longer using the service",
    "Other"
  ];

  const handleDelete = async () => {
    if (!email) return alert("Please enter your email");
    if (!reason) return alert("Please select a reason for deleting your account");

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/delete-account`, {
        email,
        username,
        reason,
      });
      setMessage(res.data.message || "Account deleted successfully.");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Delete Your Account</h2>
      {username && <p>Hi <strong>{username}</strong>, please confirm your account deletion.</p>}
      <p>Enter your email and select a reason for deleting your account.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        readOnly={!!user} // If coming from app, email cannot be edited
      />

      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ ...inputStyle, height: "45px" }}
      >
        <option value="">Select a reason</option>
        {reasons.map((r, idx) => (
          <option key={idx} value={r}>{r}</option>
        ))}
      </select>

      <button onClick={handleDelete} disabled={loading} style={buttonStyle}>
        {loading ? "Deleting..." : "Delete Account"}
      </button>

      {message && <p style={{ marginTop: "15px", color: message.includes("success") ? "green" : "red" }}>{message}</p>}
    </div>
  );
}

const containerStyle = {
  maxWidth: "400px",
  margin: "50px auto",
  textAlign: "center",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
};

const inputStyle = {
  padding: "10px",
  width: "100%",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default DeleteAccountPage;
