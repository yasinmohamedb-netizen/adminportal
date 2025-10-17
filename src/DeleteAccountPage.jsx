import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const API_BASE = "https://healthyz-backend.onrender.com/api";

function DeleteAccountPage({ urlUser }) { // urlUser can come from query params or props
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
  const [deleted, setDeleted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Track auth initialization

  const reasons = [
    "Privacy concerns",
    "Creating a new account",
    "No longer using the service",
    "Other",
  ];

  useEffect(() => {
    // If urlUser is passed (from query params), use it
    if (urlUser?.firebaseUid) {
      setUserDetails(urlUser);
      setAuthChecked(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          email: user.email || "",
          username: user.displayName || "",
          firebaseUid: user.uid,
          mobileNo: "",
        };

        try {
          const res = await axios.get(`${API_BASE}/users/firebase/${user.uid}`);
          if (res.data?.mobileNo) userData.mobileNo = res.data.mobileNo;
        } catch (err) {
          console.error("Error fetching user details:", err);
        }

        setUserDetails(userData);
      }
      setAuthChecked(true);
    });

    return unsubscribe;
  }, [auth, urlUser]); // Added urlUser to dependency array

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
      setDeleted(true);

      // Auto logout after deletion
      await signOut(auth);

      // Redirect to home/login after 2 seconds
      setTimeout(() => {
        window.location.href = "/"; // Change to your login or landing page
      }, 2000);

    } catch (err) {
      console.error("Delete error:", err);
      setMessage(err.response?.data?.message || "Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while Firebase auth is being checked
  if (!authChecked) {
    return <p style={containerStyle}>Checking authentication...</p>;
  }

  // User not logged in
  if (!userDetails.firebaseUid) {
    return <p style={containerStyle}>Please log in to delete your account.</p>;
  }

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

// Styles
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
