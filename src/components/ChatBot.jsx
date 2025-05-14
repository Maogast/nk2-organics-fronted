// src/components/ChatBot.jsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Initialize your Supabase client (ideally as a singleton)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to retrieve or generate a session id
const getSessionId = () => {
  const sessionKey = 'chat_session_id';
  let sessionId = localStorage.getItem(sessionKey);
  if (!sessionId) {
    // You can use a more robust generation method such as uuid if preferred.
    sessionId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem(sessionKey, sessionId);
  }
  return sessionId;
};

/*
  The ChatBot component now accepts two optional props:
  - isAdmin: boolean indicating if the component is used by the admin interface.
  - selectedSessionId: for admin usage, the session being viewed.
  
  For visitors, the sessionId is generated/retrieved via local storage.
  For admins, you can pass the desired session id as selectedSessionId.
*/
const ChatBot = ({ isAdmin = false, selectedSessionId }) => {
  // Use the passed session id for admin if provided; otherwise, use visitor's session.
  const sessionId = isAdmin && selectedSessionId ? selectedSessionId : getSessionId();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    // Fetch messages only for the given session.
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (!error) {
        setMessages(data);
      } else {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    // Subscribe to realtime messages for this session.
    // Note: we're filtering with the sessionId.
    const channel = supabase
      .channel(`chat_messages_channel_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Function to send a new message. It includes the session_id field.
  const handleSend = async () => {
    if (newMsg.trim() === '') return;
    const sender = isAdmin ? 'admin' : 'user';
    const { error } = await supabase.from('chat_messages').insert([
      { sender, message: newMsg, session_id: sessionId },
    ]);
    if (!error) {
      setNewMsg('');
    } else {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: '90%', sm: 300 },
        maxHeight: '80vh',
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      {/* Chat Header with toggle button */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1976d2',
          color: '#fff',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        }}
      >
        <Typography variant="h6">
          {isAdmin ? 'Chat with Visitor' : 'Chat with Admin'}
        </Typography>
        <IconButton onClick={() => setOpenChat(!openChat)} sx={{ color: '#fff' }}>
          {openChat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={openChat}>
        <Box
          sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          <List>
            {messages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  backgroundColor: msg.sender === 'admin' ? '#f0f0f0' : '#e3f2fd',
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                <ListItemText
                  primary={msg.sender === 'admin' ? 'Admin' : 'You'}
                  secondary={msg.message}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ChatBot;