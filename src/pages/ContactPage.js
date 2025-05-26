// src/pages/ContactPage.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';

function ContactPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements["yourName"].value.trim();
    const email = form.elements["emailAddress"].value.trim();
    const message = form.elements["message"].value.trim();
    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }
    setSuccess("Message sent successfully!");
    setError('');
    form.reset();
  };

  return (
    <Container sx={{ mt: 4, mb: { xs: 16, sm: 16 } }}>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>

      {/* Hotline / Contact Info Banner */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          p: 2,
          borderRadius: 2,
          textAlign: 'center',
          color: 'white',
          mb: 3,
        }}
      >
        <Typography variant="h6">
          Need Immediate Assistance?
        </Typography>
        <Typography variant="body1">
          Call us now at <strong>+254 713624672</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          We’re here to help you with your order and any inquiries 24/7.
        </Typography>
      </Box>

      {/* Contact Form */}
      <Box component="form" noValidate sx={{ mt: 1, pb: 4 }} onSubmit={handleSubmit}>
        <TextField 
          name="yourName" 
          label="Your Name" 
          fullWidth 
          margin="normal" 
        />
        <TextField 
          name="emailAddress" 
          label="Email Address" 
          type="email" 
          fullWidth 
          margin="normal" 
        />
        <TextField 
          name="message" 
          label="Message" 
          multiline 
          rows={4} 
          fullWidth 
          margin="normal" 
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
          Send Message
        </Button>
      </Box>
    </Container>
  );
}

export default ContactPage;