// src/components/RequireAuth.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Not logged in → redirect to signin
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but role not allowed → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireAuth;
