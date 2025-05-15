// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !allowedAdminEmails.includes(session.user.email.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;