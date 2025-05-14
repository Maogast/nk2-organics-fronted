// src/components/AdminNav.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminNav = ({ handleLogout }) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NK2 Organics Admin Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/admin/analytics">
          Analytics
        </Button>
        <Button color="inherit" component={Link} to="/admin/newsletter">
          Newsletter
        </Button>
        <Button color="inherit" component={Link} to="/admin/chat-sessions">
          Chat Sessions
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNav;