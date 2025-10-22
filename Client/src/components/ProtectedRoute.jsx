import React from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ isAuthenticated, authUser }) => {
  return isAuthenticated && authUser && authUser.role === "Admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
