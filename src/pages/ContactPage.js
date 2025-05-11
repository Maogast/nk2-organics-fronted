import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function ContactPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField label="Your Name" fullWidth margin="normal" />
        <TextField label="Email Address" type="email" fullWidth margin="normal" />
        <TextField label="Message" multiline rows={4} fullWidth margin="normal" />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Send Message
        </Button>
      </Box>
    </Container>
  );
}

export default ContactPage;