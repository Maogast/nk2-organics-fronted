// src/pages/AdminChatDetail.js
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ChatBot from '../components/ChatBot';
import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AdminBackButton from '../components/AdminBackButton';

// Define allowed admin email addresses.
const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const AdminChatDetail = () => {
  const { session, loading } = useAuth();
  const { sessionId } = useParams();

  if (loading) return <div>Loading...</div>;

  // Redirect if the admin is not authorized.
  if (!session || !session.user || !allowedAdminEmails.includes(session.user.email.toLowerCase())) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <AdminBackButton />
      <Typography variant="h4" gutterBottom>
        Chat with Visitor (Session: {sessionId})
      </Typography>
      {/* Render ChatBot in admin mode, which opens automatically */}
      <Box sx={{ mt: 2 }}>
        <ChatBot isAdmin={true} selectedSessionId={sessionId} />
      </Box>
    </Container>
  );
};

export default AdminChatDetail;