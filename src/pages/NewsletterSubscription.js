// src/pages/NewsletterSubscription.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box } from '@mui/material';
import axios from 'axios';
import AdminBackButton from '../components/AdminBackButton';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/subscribe', { email });
      if (res.data && res.data.success) {
        setSuccess('Subscription successful!');
        setEmail('');
      } else {
        setError('Subscription failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Subscription failed. Please try again.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <AdminBackButton />
      <Typography variant="h4" gutterBottom>
        Newsletter Subscription
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Subscribe
        </Button>
      </Box>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewsletterSubscription;