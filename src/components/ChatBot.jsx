// src/components/ChatBot.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Chat icon

// Helper function to retrieve or generate a session ID for visitors.
const getSessionId = () => {
  const sessionKey = "chat_session_id";
  let sessionId = localStorage.getItem(sessionKey);
  if (!sessionId) {
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
  // If admin and a session id is provided, use that; otherwise, generate or fetch from localStorage.
  const sessionId = isAdmin && selectedSessionId ? selectedSessionId : getSessionId();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [openChat, setOpenChat] = useState(isAdmin ? true : false);
  const messagesEndRef = useRef(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorToast, setErrorToast] = useState("");

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));

  // Footer height (for positioning)
  const footerHeight = 120; // Adjust this to match your Footer's height.
  const baseBottomOffset = 30;
  const mobileBottom = isMobileView ? footerHeight + baseBottomOffset : baseBottomOffset;

  // Sizing constants:
  // On mobile, we want the chat window to be smaller.
  const chatExpandedHeight = isMobileView ? "300px" : "70vh";
  const fullHeaderHeight = "40px"; // Height for the open chat header.
  const inputAreaHeight = "40px";  // Fixed height for the input area.

  // Wrap fetchMessages in a useCallback so its reference is stable.
  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });
    if (!error) {
      setMessages(data);
    } else {
      console.error("Error fetching messages:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    // Initial fetch of messages.
    fetchMessages();

    // Subscribe to realtime INSERT events for messages with the current sessionId.
    const channel = supabase
      .channel(`chat_messages_channel_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.find((msg) => msg.id === payload.new.id)) return prev;
            const updated = [...prev, payload.new];
            updated.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, sessionId]);

  // Auto-scroll to the bottom when messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (newMsg.trim() === "") return;
    const sender = isAdmin ? "admin" : "user";
    const msgToSend = newMsg;
    setNewMsg(""); // Clear the input immediately
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert([{ sender, message: msgToSend, session_id: sessionId }], { returning: "representation" });
      if (!error && data && data.length > 0) {
        // Re-fetch messages after successful send to ensure proper ordering.
        fetchMessages();
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

  // Styles for the open chat window.
  const paperStyles = {
    width: { xs: "85%", sm: 300 },
    height: chatExpandedHeight,
    position: "fixed",
    bottom: mobileBottom,
    right: 16,
    zIndex: 1000,
    transition: "height 0.3s ease",
  };

  return (
    <>
      {/* When chat is closed, display only the floating chat bubble icon */}
      {!openChat && (
        <IconButton 
          onClick={() => setOpenChat(true)}
          sx={{
            position: "fixed",
            bottom: mobileBottom,
            right: 16,
            zIndex: 1000,
            backgroundColor: "#1976d2",
            width: 50,
            height: 50,
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          <ChatBubbleOutlineIcon sx={{ color: "#fff" }} />
        </IconButton>
      )}

      {/* When chat is open, display the full chat window */}
      {openChat && (
        <Paper elevation={3} sx={paperStyles}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Chat window header with close button */}
            <Box
              sx={{
                height: fullHeaderHeight,
                px: 2,
                py: 1,
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "#1976d2",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <IconButton onClick={() => setOpenChat(false)} sx={{ color: "#fff" }}>
                <ExpandLessIcon />
              </IconButton>
            </Box>
            {/* Chat Content Area */}
            <Box sx={{ display: "flex", flexDirection: "column", height: `calc(100% - ${fullHeaderHeight})` }}>
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
          </Box>
        </Paper>
      )}
      
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