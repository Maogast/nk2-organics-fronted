// src/pages/Auth.js
import React, { useState } from 'react';
// Import the updated supabase client with enhanced auth configuration.
import { supabase } from '../utils/supabaseClient';
import { Container, TextField, Button, Typography } from '@mui/material';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // authMode can be either 'login' or 'signup'.
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('');

  // Handle Sign Up using Supabase Auth.
  const handleSignUp = async () => {
    // Supabase will send a confirmation email if needed.
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signup successful! Check your email to confirm.');
    }
  };

  // Handle Sign In using Supabase's recommended signInWithPassword method.
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Logged in successfully!');
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    setMessage('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {authMode === 'login' ? 'Login' : 'Sign Up'}
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
        onClick={authMode === 'login' ? handleSignIn : handleSignUp}
        sx={{ mt: 2 }}
      >
        {authMode === 'login' ? 'Login' : 'Sign Up'}
      </Button>
      <Button onClick={toggleMode} sx={{ mt: 2 }}>
        {authMode === 'login' ? 'Switch to Sign Up' : 'Switch to Login'}
      </Button>
      {message && (
        <Typography color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Auth;