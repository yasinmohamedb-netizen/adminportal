// /Users/mohamedyasin/Desktop/HealthcareApp/adminportal/src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

// Screens / Pages
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import DoctorSubmitPrescriptionScreen from "./DoctorSubmitPrescriptionScreen";
import AdminOrdersDashboard from "./AdminOrdersDashboard";
import AdminConsultationsDashboard from "./AdminConsultationsDashboard";
import AdminHomecareDashboard from "./AdminHomecareDashboard";
import AdminTransplantsDashboard from "./AdminTransplantsDashboard";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import DeleteAccountPage from "./DeleteAccountPage";
import Layout from "./Layout";

// NEW imports
import AdminQA from "./AdminQA";
import AdminProductForm from "./AdminProductForm";

// Wrapper for DoctorSubmitPrescription when consultationId is undefined
function DoctorSubmitPrescriptionRoute() {
  const { consultationId } = useParams();
  if (consultationId === "undefined") {
    return <Navigate to="/doctor/submit-prescription" replace />;
  }
  return <DoctorSubmitPrescriptionScreen />;
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loadingUser)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>
    );

  return (
    <Routes>
      <Route
        path="/"
        element={<Layout user={user} onLogout={handleLogout} />}
      >
        {/* =========================== */}
        {/* HOME PAGE */}
        {/* =========================== */}
        <Route
          index
          element={
            <div
              style={{
                maxWidth: "600px",
                margin: "auto",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h2>Welcome to HealthYz Portal</h2>

              {user && (
                <div style={{ margin: "20px 0" }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Force Logout
                  </button>
                </div>
              )}

              {!user && (
                <div style={{ margin: "20px 0" }}>
                  <Link
                    to="/login"
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: "5px",
                    }}
                  >
                    Admin Login
                  </Link>
                </div>
              )}

              <div style={{ marginTop: "20px" }}>
                <Link
                  to="/doctor/submit-prescription"
                  style={{
                    display: "inline-block",
                    padding: "10px 15px",
                    backgroundColor: "#1e90ff",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "5px",
                    margin: "5px",
                  }}
                >
                  Doctor Consultation (Empty Form)
                </Link>
              </div>

              <div style={{ marginTop: "20px" }}>
                <Link
                  to="/privacy-policy"
                  style={{
                    display: "inline-block",
                    padding: "10px 15px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "5px",
                    margin: "5px",
                  }}
                >
                  Privacy Policy
                </Link>

                <Link
                  to="/delete-account"
                  style={{
                    display: "inline-block",
                    padding: "10px 15px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "5px",
                    margin: "5px",
                  }}
                >
                  Delete Account
                </Link>
              </div>
            </div>
          }
        />

        {/* =========================== */}
        {/* AUTH */}
        {/* =========================== */}
        <Route path="login" element={<LoginWrapper setUser={setUser} />} />

        {/* Doctor submit prescription */}
        <Route
          path="doctor/submit-prescription/:consultationId?"
          element={<DoctorSubmitPrescriptionRoute />}
        />

        {/* =========================== */}
        {/* ADMIN DASHBOARDS */}
        {/* =========================== */}
        <Route
          path="admin/orders"
          element={
            <ProtectedRoute user={user}>
              <AdminOrdersDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/consultations"
          element={
            <ProtectedRoute user={user}>
              <AdminConsultationsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/homecare"
          element={
            <ProtectedRoute user={user}>
              <AdminHomecareDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/transplants"
          element={
            <ProtectedRoute user={user}>
              <AdminTransplantsDashboard />
            </ProtectedRoute>
          }
        />

        {/* =========================== */}
        {/* NEW: Admin Product Upload Page */}
        {/* =========================== */}
        <Route
          path="admin/products"
          element={
            <ProtectedRoute user={user}>
              <AdminProductForm />
            </ProtectedRoute>
          }
        />

        {/* =========================== */}
        {/* NEW: Admin Anonymous QA */}
        {/* =========================== */}
        <Route
          path="admin/qa"
          element={
            <ProtectedRoute user={user}>
              <AdminQA />
            </ProtectedRoute>
          }
        />

        {/* Policies */}
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="delete-account" element={<DeleteAccountPage />} />
      </Route>
    </Routes>
  );
}

function LoginWrapper({ setUser }) {
  const navigate = useNavigate();
  return (
    <Login
      setUser={(user) => {
        setUser(user);
        navigate("/", { replace: true });
      }}
    />
  );
}
