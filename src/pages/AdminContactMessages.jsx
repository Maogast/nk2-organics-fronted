// src/pages/AdminContactMessages.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminBackButton from '../components/AdminBackButton';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch contact messages from Supabase
  const fetchContactMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) {
      setMessages(data);
    } else {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchContactMessages();

    // Subscribe to real-time changes for new messages.
    const channel = supabase
      .channel('realtime-contact-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_messages',
        },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Delete a message by its ID
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    if (!error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } else {
      console.error("Error deleting message:", error);
    }
  };

  // When delete icon is clicked, show the confirmation dialog
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  // Handle closing the confirmation dialog without deleting
  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  // Handle confirming deletion and actually deleting the message
  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
    }
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <AdminBackButton /> {/* Back button to navigate back to the admin dashboard */}
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Message</strong></TableCell>
              <TableCell><strong>Submitted At</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell>{new Date(msg.created_at).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDeleteClick(msg.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminContactMessages;