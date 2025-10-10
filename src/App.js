import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Pages / Screens
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

// Link Styles
const linkStyle = {
  display: "inline-block",
  margin: "10px 5px",
  padding: "10px 15px",
  backgroundColor: "#1e90ff",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "5px",
};

// Wrapper component to handle undefined consultationId param
function DoctorSubmitPrescriptionRoute() {
  const { consultationId } = useParams();

  if (consultationId === "undefined") {
    // Redirect to clean URL without the "undefined" string param
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

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const role = firebaseUser.email === "admin@healthy.com" ? "admin" : "user";
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role });
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async (navigate) => {
    try {
      await auth.signOut();
      setUser(null);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loadingUser) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <Routes>
      <Route path="/*" element={<Layout user={user} onLogout={handleLogout} />}>
        {/* Home Page */}
        <Route
          index
          element={
            <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" }}>
              <h2>Welcome to HealthYz Portal</h2>
              <div style={{ margin: "15px 0" }}>
                {/* Link without consultation ID */}
                <Link to="doctor/submit-prescription" style={linkStyle}>
                  Doctor Consultation (Empty Form)
                </Link>
              </div>
              {!user && (
                <div>
                  <Link to="login" style={{ ...linkStyle, backgroundColor: "#28a745" }}>
                    Admin Login
                  </Link>
                </div>
              )}
              <div style={{ marginTop: "20px" }}>
                <Link to="privacy-policy" style={{ ...linkStyle, backgroundColor: "#6c757d" }}>
                  Privacy Policy
                </Link>
                <Link to="delete-account" style={{ ...linkStyle, backgroundColor: "#dc3545" }}>
                  Delete Account
                </Link>
              </div>
            </div>
          }
        />

        {/* Login */}
        <Route path="login" element={<LoginWrapper setUser={setUser} />} />

        {/* Doctor Consultation with optional consultationId */}
        <Route
          path="doctor/submit-prescription/:consultationId?"
          element={<DoctorSubmitPrescriptionRoute />}
        />

        {/* Admin Dashboards */}
        <Route
          path="admin/orders"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminOrdersDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/consultations"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminConsultationsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/homecare"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminHomecareDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/transplants"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminTransplantsDashboard />
            </ProtectedRoute>
          }
        />

        {/* Privacy / Delete Account */}
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="delete-account" element={<DeleteAccountPage />} />
      </Route>
    </Routes>
  );
}

// Login wrapper
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
