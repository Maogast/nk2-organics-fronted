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
  Snackbar,
  Alert,
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
  // Use provided session ID (for admin) or generate one for visitors.
  const sessionId = isAdmin && selectedSessionId ? selectedSessionId : getSessionId();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  // For admin, open chat by default; for visitors, start collapsed.
  const [openChat, setOpenChat] = useState(isAdmin ? true : false);
  // Ref for auto-scrolling.
  const messagesEndRef = useRef(null);
  // State for error toast.
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  // Use theme and media query.
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  // Extra bottom offset on mobile.
  const mobileBottom = isMobileView ? 80 : 16;

  // Define sizing constants.
  // For visitors, set a compact expanded height.
  const chatExpandedHeight = isMobileView ? "300px" : "70vh";
  const headerHeight = "60px"; // Chat header area.
  const inputAreaHeight = "60px"; // Input area (TextField + Button).

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
          setMessages((prev) => {
            if (prev.find((msg) => msg.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Whenever messages update, auto-scroll to the bottom.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to send a message.
  const handleSend = async () => {
    if (newMsg.trim() === '') return;
    const sender = isAdmin ? 'admin' : 'user';
    const msgToSend = newMsg;
    // Immediately clear the input field.
    setNewMsg('');

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{ sender, message: msgToSend, session_id: sessionId }], { returning: 'representation' });
      if (!error && data && data.length > 0) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === data[0].id)) return prev;
          return [...prev, data[0]];
        });
      } else {
        console.error('Error sending message:', error);
        setErrorToast('Oops! Failed to send your message. Please try again.');
        setErrorOpen(true);
      }
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      setErrorToast('An unexpected error occurred. Please try again.');
      setErrorOpen(true);
    }
  };

  // Paper container styles.
  const paperStyles = isAdmin
    ? {
        width: '100%',
        maxWidth: 600,
        p: 2,
        mx: 'auto',
        my: 2,
        mb: 12,
      }
    : {
        width: { xs: '85%', sm: 300 },
        // When open, use a fixed compact height; when closed, auto height.
        height: openChat ? chatExpandedHeight : 'auto',
        position: 'fixed',
        bottom: mobileBottom,
        right: 16,
        zIndex: 1000,
        transition: 'height 0.3s ease',
      };

  return (
    <>
      <Paper elevation={3} sx={paperStyles}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: openChat ? '100%' : 'auto' }}>
          {/* Chat Header */}
          <Box
            sx={{
              height: headerHeight,
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
          {/* Chat Content Area: only shows when open */}
          <Collapse in={openChat}>
            <Box
              sx={{
                // Set container height to fill remaining space
                height: `calc(100% - ${headerHeight})`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Messages Container - scrollable */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
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
              {/* Input Area remains visible at the bottom */}
              <Box
                sx={{
                  height: inputAreaHeight,
                  px: 2,
                  py: 1,
                  borderTop: '1px solid #ccc',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button variant="contained" onClick={handleSend}>
                  Send
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Paper>
      {/* Snackbar for error notifications */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorToast}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatBot;