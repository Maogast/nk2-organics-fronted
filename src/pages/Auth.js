// src/pages/Auth.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// List of allowed admin email addresses.
const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // authMode can be either 'login' or 'signup'
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Listen for auth state changes (this will catch email confirmation logins)
  useEffect(() => {
    // Destructure the nested subscription from the returned data.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change event:', event);
        if (session && session.user) {
          const lowerEmail = session.user.email.toLowerCase();
          console.log('User session detected for:', lowerEmail);
          if (allowedAdminEmails.includes(lowerEmail)) {
            console.log('Admin detected. Redirecting to /admin-dashboard');
            navigate('/admin-dashboard');
          } else {
            console.log('Non-admin detected. Redirecting to /dashboard');
            navigate('/dashboard');
          }
        } else {
          console.log('No session detected');
        }
      }
    );
    return () => {
      // Unsubscribe from the listener when the component unmounts.
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Handle sign up. Supabase sends a confirmation email.
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signup successful! Check your email to confirm.');
    }
  };

  // Handle sign in. After a successful sign in, redirect based on email.
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Logged in successfully!');
      const lowerEmail = email.toLowerCase();
      console.log('Explicit sign in detected for:', lowerEmail);
      if (allowedAdminEmails.includes(lowerEmail)) {
        console.log('Redirecting admin from sign in to /admin-dashboard');
        navigate('/admin-dashboard');
      } else {
        console.log('Redirecting non-admin from sign in to /dashboard');
        navigate('/dashboard');
      }
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