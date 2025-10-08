import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  // If user not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If user exists but role is not allowed, redirect home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If user exists and role is allowed, render children
  return children;
};

export default ProtectedRoute;
