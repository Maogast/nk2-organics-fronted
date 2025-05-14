// src/pages/AdminChatDetail.js

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ChatBot from '../components/ChatBot';
import { Container, Typography } from '@mui/material';

// Define allowed admin emails.
const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const AdminChatDetail = () => {
  const { sessionId } = useParams();
  
  // Retrieve logged-in admin's email from localStorage (set during login).
  const adminEmail = localStorage.getItem('adminEmail');

  // If adminEmail is not set or not in the allowed list, redirect to login.
  if (!adminEmail || !allowedAdminEmails.includes(adminEmail.toLowerCase())) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat with Visitor - Session: {sessionId}
      </Typography>
      {/* Render ChatBot in admin mode, passing the selected session ID */}
      <ChatBot isAdmin={true} selectedSessionId={sessionId} />
    </Container>
  );
};

export default AdminChatDetail;