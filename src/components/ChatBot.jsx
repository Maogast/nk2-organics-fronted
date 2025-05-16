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
    - isAdmin: if true, adjusts UI for admin use.
    - selectedSessionId: for admins, the session ID to interact with.
  For visitors, the session ID is generated/retrieved from localStorage.
*/
const ChatBot = ({ isAdmin = false, selectedSessionId }) => {
  const sessionId = isAdmin && selectedSessionId ? selectedSessionId : getSessionId();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [openChat, setOpenChat] = useState(isAdmin ? true : false);
  const messagesEndRef = useRef(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  // Since your footer is fixed, define its height (in pixels)
  const footerHeight = 120; // Adjust this to match your Footer's height.
  const baseBottomOffset = 30;
  // On mobile, add an extra offset so the chatbox sits above the footer.
  const mobileBottom = isMobileView ? footerHeight + baseBottomOffset : baseBottomOffset;

  // Sizing constants:
  // For visitors, the expanded chatbox has a fixed height.
  const chatExpandedHeight = isMobileView ? "400px" : "70vh";
  const headerHeight = "5px";     // The (small) header.
  const inputAreaHeight = "40px";  // Fixed height for the input field & button.

  useEffect(() => {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (newMsg.trim() === "") return;
    const sender = isAdmin ? "admin" : "user";
    const msgToSend = newMsg;
    setNewMsg(""); // Clear input immediately
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
        console.error("Error sending message:", error);
        setErrorToast("Your message has been sent, but new responses might not appear automatically. Please refresh your page to see updated responses.");
        setErrorOpen(true);
      }
    } catch (err) {
      console.error("Unexpected error sending message:", err);
      setErrorToast("Your message has been sent, but new responses might not appear automatically. Please refresh your page to see updated responses.");
      setErrorOpen(true);
    }
  };

  // Paper container styles.
  const paperStyles = isAdmin
    ? {
        width: "100%",
        maxWidth: 600,
        p: 2,
        mx: "auto",
        my: 2,
        mb: 12,
      }
    : {
        width: { xs: "85%", sm: 300 },
        height: openChat ? chatExpandedHeight : "auto",
        position: "fixed",
        bottom: mobileBottom,
        right: 16,
        zIndex: 1000,
        transition: "height 0.3s ease",
      };

  return (
    <>
      <Paper elevation={3} sx={paperStyles}>
        <Box sx={{ display: "flex", flexDirection: "column", height: openChat ? "100%" : "auto" }}>
          {/* Chat Header */}
          <Box
            sx={{
              height: headerHeight,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#1976d2",
              color: "#fff",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          >
            <Typography variant="h6">
              {isAdmin ? "Chat with Visitor" : "Chat with Us"}
            </Typography>
            <IconButton onClick={() => setOpenChat(!openChat)} sx={{ color: "#fff" }}>
              {openChat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          {/* Chat Content Area */}
          <Collapse
            in={openChat}
            sx={{
              height: openChat ? `calc(${chatExpandedHeight} - ${headerHeight})` : 0,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Messages Container */}
              <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
                <List>
                  {messages.map((msg) => (
                    <ListItem
                      key={msg.id}
                      sx={{
                        backgroundColor: msg.sender === "admin" ? "#f0f0f0" : "#e3f2fd",
                        mb: 1,
                        borderRadius: 1,
                      }}
                    >
                      <ListItemText
                        primary={msg.sender === "admin" ? "Admin" : "You"}
                        secondary={msg.message}
                      />
                    </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              </Box>
              {/* Input Area */}
              <Box
                sx={{
                  height: inputAreaHeight,
                  px: 2,
                  py: 1,
                  borderTop: "1px solid #ccc",
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  backgroundColor: "background.paper",
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
                    if (e.key === "Enter") {
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
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorOpen(false)} severity="info" variant="filled" sx={{ width: "100%" }}>
          {errorToast}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatBot;