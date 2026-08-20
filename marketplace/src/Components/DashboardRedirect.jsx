import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardRedirect = () => {
  const { userType } = useSelector((state) => state.auth);

  if (!userType) return null;

  return (
    <Navigate 
      to={userType === "organization" ? "/dashboard/org-overview" : "/dashboard/overview"} 
      replace 
    />
  );
};

export default DashboardRedirect;
