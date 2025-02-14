import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContextProvider } from "../context/authContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuthContextProvider();

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, return the protected component
  return element;
};

export default ProtectedRoute;
