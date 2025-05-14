// src/pages/AdminChatDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatBot from '../components/ChatBot';
import { Container, Typography } from '@mui/material';

const AdminChatDetail = () => {
  const { sessionId } = useParams();
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat with Visitor - Session: {sessionId}
      </Typography>
      <ChatBot isAdmin={true} selectedSessionId={sessionId} />
    </Container>
  );
};

export default AdminChatDetail;