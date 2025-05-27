// src/pages/AdminChatReply.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import AdminBackButton from '../components/AdminBackButton';
import { supabase } from '../utils/supabaseClient';

const AdminChatReply = () => {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Memoized conversation fetch function.
  const fetchConversation = useCallback(async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (!error) {
      setMessages(data);
    } else {
      console.error("Error fetching conversation:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchConversation();

    // Listen for realtime inserts so the conversation updates automatically.
    const channel = supabase
      .channel(`admin_chat_reply_${sessionId}`)
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
  }, [sessionId, fetchConversation]);

  // Auto-scroll to the bottom whenever messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async () => {
    if (reply.trim() === "") return;
    // Save reply into a temporary variable.
    const messageToSend = reply;
    // Clear the text field immediately to avoid duplicate sends.
    setReply("");
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ sender: "admin", message: messageToSend, session_id: sessionId }], { returning: "representation" });
    if (!error && data && data.length > 0) {
      setConfirmOpen(true);
      // Real-time subscription will update the conversation.
    } else {
      console.error("Error sending reply:", error);
      // Optionally, you could restore messageToSend into reply on error.
    }
  };

  return (
    // Extra bottom margin prevents the input from being obscured by a fixed footer.
    <Container sx={{ mt: 4, mb: 16 }}>
      <AdminBackButton />
      <Typography variant="h4" gutterBottom>
        Chat Session: {sessionId}
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: "60vh", overflowY: "auto" }}>
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemText
                primary={msg.sender === "admin" ? "Admin" : "Visitor"}
                secondary={msg.message}
              />
            </ListItem>
          ))}
          {/* The scroll target */}
          <span ref={messagesEndRef} />
        </List>
      </Paper>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendReply();
              }
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSendReply}>
            Send
          </Button>
        </Grid>
      </Grid>
      
      {/* Optional spacer */}
      <Box sx={{ height: "120px" }} />

      <Snackbar
        open={confirmOpen}
        autoHideDuration={3000}
        onClose={() => setConfirmOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setConfirmOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          Reply sent successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminChatReply;