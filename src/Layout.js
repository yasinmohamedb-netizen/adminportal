import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const linkStyle = (path) => ({
    color: "#fff",
    marginRight: "15px",
    textDecoration: location.pathname === path ? "underline" : "none",
  });

  const handleLogoutClick = async () => {
    await onLogout(navigate);
  };

  // Hide header for specific paths
  const hideHeader =
    location.pathname === "/privacy-policy" ||
    location.pathname === "/delete-account" ||
    location.pathname.startsWith("/doctor/submit-prescription");

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {!hideHeader && (
        <header
          style={{
            backgroundColor: "#1e90ff",
            color: "#fff",
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>HealthYz Portal</h1>
          <nav>
            <Link to="/" style={linkStyle("/")}>Home</Link>
            {user && (
              <>
                <Link to="/admin/orders" style={linkStyle("/admin/orders")}>Orders</Link>
                <Link to="/admin/consultations" style={linkStyle("/admin/consultations")}>Consultations</Link>
                <Link to="/admin/homecare" style={linkStyle("/admin/homecare")}>Homecare</Link>
                <Link to="/admin/transplants" style={linkStyle("/admin/transplants")}>Transplants</Link>
                <button
                  onClick={handleLogoutClick}
                  style={{
                    marginLeft: "15px",
                    padding: "5px 10px",
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                style={{
                  color: "#fff",
                  marginLeft: "15px",
                  padding: "5px 10px",
                  backgroundColor: "#28a745",
                  borderRadius: "5px",
                  textDecoration: "none",
                }}
              >
                Admin Login
              </Link>
            )}
          </nav>
        </header>
      )}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
