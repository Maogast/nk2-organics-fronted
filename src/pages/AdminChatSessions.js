// src/pages/AdminChatSessions.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { Link } from 'react-router-dom';
// Import the single Supabase client instance.
import { supabase } from '../utils/supabaseClient';

const AdminChatSessions = () => {
  const [sessions, setSessions] = useState([]);

  // Function to fetch, group, and sort chat sessions from the chat_messages table.
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
      // Convert the sessions map to an array and sort by most recent activity.
      const sessionsArray = Object.values(sessionsMap).sort(
        (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
      );
      setSessions(sessionsArray);
    }
  };

  // Initial fetch of sessions plus a realtime subscription for changes.
  useEffect(() => {
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
          // For simplicity, re-fetch the sessions on each new message.
          fetchSessions();
        }
      )
      .subscribe();

    // Cleanup the subscription when the component unmounts.
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chat Sessions
      </Typography>
      {sessions.length > 0 ? (
        <List>
          {sessions.map((session) => (
            <ListItem key={session.session_id} divider>
              <ListItemText
                primary={`Session ID: ${session.session_id}`}
                secondary={`Last message by ${session.lastMessage.sender}: ${session.lastMessage.message}`}
              />
              {/* Link to a detailed chat view with the session ID passed as a parameter */}
              <Button variant="outlined" component={Link} to={`/admin/chat/${session.session_id}`}>
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