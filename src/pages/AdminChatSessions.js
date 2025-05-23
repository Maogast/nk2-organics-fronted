// src/pages/AdminChatSessions.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import AdminBackButton from '../components/AdminBackButton';

const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const AdminChatSessions = () => {
  const { session, loading } = useAuth();
  const [sessions, setSessions] = useState([]);

  // Always call hooks unconditionally.
  useEffect(() => {
    // Only proceed if a valid admin session exists.
    if (session && session.user && allowedAdminEmails.includes(session.user.email.toLowerCase())) {
      const fetchSessions = async () => {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('session_id, message, created_at, sender');
        if (error) {
          console.error('Error fetching chat sessions:', error);
        } else if (data) {
          // Group messages by session_id.
          const sessionsMap = {};
          data.forEach((msg) => {
            if (!sessionsMap[msg.session_id]) {
              sessionsMap[msg.session_id] = {
                session_id: msg.session_id,
                messages: [],
                lastMessage: msg,
              };
            }
            sessionsMap[msg.session_id].messages.push(msg);
            // Update lastMessage if this message is newer.
            if (new Date(msg.created_at) > new Date(sessionsMap[msg.session_id].lastMessage.created_at)) {
              sessionsMap[msg.session_id].lastMessage = msg;
            }
          });
          // Convert sessionsMap to array and sort by most recent activity.
          const sessionsArray = Object.values(sessionsMap).sort(
            (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
          );
          setSessions(sessionsArray);
        }
      };

      fetchSessions();

      // Subscribe to realtime INSERT events for chat messages.
      const channel = supabase
        .channel('chat_sessions_channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
          },
          (payload) => {
            console.log('New chat message payload:', payload);
            fetchSessions();
          }
        )
        .subscribe();

      // Cleanup the subscription on unmount.
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  // Now, conditionally render if needed.
  if (loading) return <div>Loading...</div>;
  if (!session || !session.user || !allowedAdminEmails.includes(session.user.email.toLowerCase())) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <AdminBackButton />
      <Typography variant="h4" gutterBottom>
        Chat Sessions
      </Typography>
      {sessions.length > 0 ? (
        <List>
          {sessions.map((sessionItem) => (
            <ListItem key={sessionItem.session_id} divider>
              <ListItemText
                primary={`Session ID: ${sessionItem.session_id}`}
                secondary={`Last message by ${sessionItem.lastMessage.sender}: ${sessionItem.lastMessage.message}`}
              />
              <Button
                variant="outlined"
                component={Link}
                to={`/admin/chat/${sessionItem.session_id}`}
              >
                View Chat
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">No chat sessions available</Typography>
      )}
    </Container>
  );
};

export default AdminChatSessions;