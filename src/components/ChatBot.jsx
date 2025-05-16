// src/components/ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Helper function to retrieve or generate a session ID for visitors.
const getSessionId = () => {
  const sessionKey = 'chat_session_id';
  let sessionId = localStorage.getItem(sessionKey);
  if (!sessionId) {
    // In production, consider using a more robust method (e.g., uuid).
    sessionId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem(sessionKey, sessionId);
  }
  return sessionId;
};

/*
  ChatBot props:
    - isAdmin: if true, adjusts UI for admin use (e.g., labeling and styling).
    - selectedSessionId: for admins, the session ID to interact with.
  For visitors, the session ID is generated/retrieved from localStorage.
*/
const ChatBot = ({ isAdmin = false, selectedSessionId }) => {
  // Use provided session ID (for admin) or a visitor-generated session.
  const sessionId = isAdmin && selectedSessionId ? selectedSessionId : getSessionId();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  // For admin, open chat by default; for visitors, allow toggling.
  const [openChat, setOpenChat] = useState(isAdmin ? true : false);
  // Ref for auto-scrolling.
  const messagesEndRef = useRef(null);

  // Use theme and media query to adjust mobile view.
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  // When on mobile and not admin, add extra bottom margin so it doesn't cover footer.
  const mobileBottom = isMobileView ? 80 : 16;

  useEffect(() => {
    // Fetch existing messages for the session.
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
          // Check and prevent duplicate messages.
          setMessages((prev) => {
            if (prev.find((msg) => msg.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Auto-scroll to the bottom whenever messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to send a message.
  const handleSend = async () => {
    if (newMsg.trim() === '') return;
    const sender = isAdmin ? 'admin' : 'user';
    try {
      // Insert message and request the inserted record back.
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{ sender, message: newMsg, session_id: sessionId }], { returning: 'representation' });
      if (!error && data && data.length > 0) {
        // Immediately update the messages state with the new message.
        setMessages((prev) => {
          if (prev.find((m) => m.id === data[0].id)) return prev;
          return [...prev, data[0]];
        });
        setNewMsg('');
      } else {
        console.error('Error sending message:', error);
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
    }
  };

  // Conditional styles.
  // In admin mode, remove fixed positioning and add extra margin so it won't be overlapped by the footer.
  const paperStyles = isAdmin
    ? {
        width: '100%',
        maxWidth: 600,
        p: 2,
        mx: 'auto',
        my: 2,
        mb: 12, // Adjust this margin value to avoid footer overlap.
      }
    : {
        width: { xs: '90%', sm: 300 },
        maxHeight: '80vh',
        position: 'fixed',
        bottom: mobileBottom,
        right: 16,
        zIndex: 1000,
      };

  return (
    <Paper elevation={3} sx={paperStyles}>
      {/* Chat Header */}
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
          {isAdmin ? 'Chat with Visitor' : 'Chat with Us'}
        </Typography>
        <IconButton onClick={() => setOpenChat(!openChat)} sx={{ color: '#fff' }}>
          {openChat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={openChat}>
        <Box
          sx={{
            p: 2,
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
            {/* Dummy element to assist auto-scroll */}
            <div ref={messagesEndRef} />
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
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submit/reload
                handleSend();
              }
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