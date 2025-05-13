// src/components/ChatBot.jsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Box, List, ListItem, ListItemText, TextField, Button, Typography, Paper } from '@mui/material';

// Initialize your Supabase client (ideally as a singleton)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error) {
        setMessages(data);
      }
    };
    fetchMessages();

    // Subscribe to real-time messages using the new channel API
    const channel = supabase.channel('chat_messages_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          // Bot auto-reply logic
          if (payload.new.sender === 'user' &&
              payload.new.message.toLowerCase().includes('help')) {
            setTimeout(() => {
              supabase.from('chat_messages').insert([
                { sender: 'bot', message: 'How can I help you today?' }
              ]);
            }, 1000);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Function to send a new message.
  const handleSend = async () => {
    if (newMsg.trim() === '') return;
    const { error } = await supabase.from('chat_messages').insert([
      { sender: 'user', message: newMsg }
    ]);
    if (!error) {
      setNewMsg('');
    } else {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ width: 300, maxHeight: 400, p: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Chat With Us
      </Typography>
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                backgroundColor: msg.sender === 'bot' ? '#f0f0f0' : '#e3f2fd',
                mb: 1,
                borderRadius: 1
              }}
            >
              <ListItemText
                primary={msg.sender === 'bot' ? 'Support Bot' : 'You'}
                secondary={msg.message}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatBot;