import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const API_BASE = "https://healthyz-backend.onrender.com/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function DeleteAccountPage() {
  const query = useQuery();

  // No need for setUserDetails since it's static
  const userDetails = {
    email: query.get("email") || "",
    mobileNo: query.get("mobileNo") || "",
    username: query.get("fullName") || "",
    firebaseUid: query.get("uid") || "",
  };

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleted, setDeleted] = useState(false);

  const reasons = [
    "Privacy concerns",
    "Creating a new account",
    "No longer using the service",
    "Other",
  ];

  const handleDelete = async () => {
    if (!userDetails.firebaseUid) {
      alert("User UID not provided.");
      return;
    }
    if (!reason) {
      alert("Please select a reason for deleting your account");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete(
        `${API_BASE}/users/firebase/${userDetails.firebaseUid}`,
        { data: { reason } }
      );

      setMessage(res.data.message || "Account deleted successfully.");
      setDeleted(true);

      // If embedded in app/webview
      setTimeout(() => {
        window.ReactNativeWebView?.postMessage("accountDeleted");
      }, 2000);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(err.response?.data?.message || "Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Delete Your Account</h2>
      {userDetails.username && (
        <p>
          Hi <strong>{userDetails.username}</strong>, please confirm your account
          deletion.
        </p>
      )}

      <input
        type="email"
        value={userDetails.email}
        readOnly
        style={inputStyle}
        placeholder="Email"
      />
      <input
        type="tel"
        value={userDetails.mobileNo}
        readOnly
        style={inputStyle}
        placeholder="Mobile Number"
      />

      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ ...inputStyle, height: "45px" }}
        disabled={deleted}
      >
        <option value="">Select a reason</option>
        {reasons.map((r, idx) => (
          <option key={idx} value={r}>
            {r}
          </option>
        ))}
      </select>

      <button
        onClick={handleDelete}
        disabled={loading || deleted}
        style={buttonStyle}
      >
        {loading ? "Deleting..." : deleted ? "Account Deleted" : "Delete Account"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.toLowerCase().includes("success") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
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
  backgroundColor: "#eee",
  color: "#555",
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
