import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const reduxUser = useSelector((state) => state.auth.user);
  const storedUser = JSON.parse(localStorage.getItem("adminUser") || "null");
  const user = reduxUser || storedUser;
  const token = localStorage.getItem("token");
  if (!token || !user || user.role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
};
export default AdminRoute;
