import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const API_BASE = "https://healthyz-backend.onrender.com/api";

function DeleteAccountPage() {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [username, setUsername] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const reasons = [
    "Privacy concerns",
    "Creating a new account",
    "No longer using the service",
    "Other"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
        setUsername(user.displayName || "");
        // If your app saves mobile number separately, fetch from your backend or auth provider
        // setMobileNo(user.phoneNumber || "");
      } else {
        setEmail("");
        setUsername("");
        setMobileNo("");
      }
    });
    return unsubscribe;
  }, [auth]);

  const handleDelete = async () => {
    if (!email && !mobileNo) {
      alert("Please provide your email or mobile number");
      return;
    }
    if (!reason) {
      alert("Please select a reason for deleting your account");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/delete-account`, {
        email,
        mobileNo,
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
      <p>Enter your email or mobile number and select a reason for deleting your account.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        readOnly={!!email}
      />

      <input
        type="tel"
        placeholder="Mobile Number"
        value={mobileNo}
        onChange={(e) => setMobileNo(e.target.value)}
        style={inputStyle}
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
