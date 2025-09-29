// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length === 0) return children;

  const hasRole = user.roles?.some((r) => allowedRoles.includes(r));
  if (!hasRole) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
