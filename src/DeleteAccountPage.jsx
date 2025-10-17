import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const API_BASE = "https://healthyz-backend.onrender.com/api";

function DeleteAccountPage() {
  const auth = getAuth();

  const [userDetails, setUserDetails] = useState({
    email: "",
    mobileNo: "",
    username: "",
    firebaseUid: "",
  });
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const reasons = [
    "Privacy concerns",
    "Creating a new account",
    "No longer using the service",
    "Other",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          email: user.email || "",
          username: user.displayName || "",
          firebaseUid: user.uid,
          mobileNo: "",
        };

        try {
          // Fetch extra details like mobileNo from backend
          const res = await axios.get(`${API_BASE}/users/firebase/${user.uid}`);
          if (res.data?.mobileNo) {
            userData.mobileNo = res.data.mobileNo;
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }

        setUserDetails(userData);
      } else {
        setUserDetails({ email: "", username: "", mobileNo: "", firebaseUid: "" });
      }
    });

    return unsubscribe;
  }, [auth]);

  const handleDelete = async () => {
    if (!userDetails.firebaseUid) {
      alert("User not found. Please log in again.");
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
          Hi <strong>{userDetails.username}</strong>, please confirm your account deletion.
        </p>
      )}
      <p>Your account details are automatically fetched below.</p>

      <input type="email" value={userDetails.email} readOnly style={inputStyle} />
      <input type="tel" value={userDetails.mobileNo} readOnly style={inputStyle} />

      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={{ ...inputStyle, height: "45px" }}
      >
        <option value="">Select a reason</option>
        {reasons.map((r, idx) => (
          <option key={idx} value={r}>
            {r}
          </option>
        ))}
      </select>

      <button onClick={handleDelete} disabled={loading} style={buttonStyle}>
        {loading ? "Deleting..." : "Delete Account"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.includes("success") ? "green" : "red",
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
