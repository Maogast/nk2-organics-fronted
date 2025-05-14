// src/pages/Login.js
import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// List of allowed admin email addresses.
const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('');
      const lowerEmail = email.toLowerCase();
      // Redirect admin users to the admin dashboard; others to the customer dashboard.
      if (allowedAdminEmails.includes(lowerEmail)) {
        navigate('/admin-dashboard'); // Admin dashboard route.
      } else {
        navigate('/dashboard'); // Updated: Redirect non-admin users to customer dashboard combined route at "/dashboard".
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
      {message && (
        <Typography color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;