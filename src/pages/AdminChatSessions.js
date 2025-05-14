// src/pages/AdminChatSessions.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminChatSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      // Fetch all chat messages – you can fine-tune this query for better performance (e.g., using a PostgREST RPC to get distinct sessions)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('session_id, message, created_at, sender');
      if (error) {
        console.error('Error fetching chat sessions:', error);
      } else if (data) {
        // Group messages by session_id
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
          // Update lastMessage if this message is newer
          if (new Date(msg.created_at) > new Date(sessionsMap[msg.session_id].lastMessage.created_at)) {
            sessionsMap[msg.session_id].lastMessage = msg;
          }
        });
        // Convert the sessions map into an array and sort by last message date (most recent first)
        const sessionsArray = Object.values(sessionsMap).sort(
          (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
        );
        setSessions(sessionsArray);
      }
    };

    fetchSessions();
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