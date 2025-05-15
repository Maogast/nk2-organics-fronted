// src/pages/ContactPage.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';

function ContactPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation:
    const form = e.target;
    const name = form.elements["yourName"].value.trim();
    const email = form.elements["emailAddress"].value.trim();
    const message = form.elements["message"].value.trim();
    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }
    // Submit form or simulate send message; then:
    setSuccess("Message sent successfully!");
    setError('');
    form.reset();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <TextField name="yourName" label="Your Name" fullWidth margin="normal" />
        <TextField name="emailAddress" label="Email Address" type="email" fullWidth margin="normal" />
        <TextField name="message" label="Message" multiline rows={4} fullWidth margin="normal" />
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