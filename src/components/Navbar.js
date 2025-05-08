// src/components/Navbar.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CartContext } from '../context/cartContext';

function Navbar() {
  const { cartItems } = useContext(CartContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img 
            src={logo} 
            alt="NK-Organics Logo" 
            style={{ height: '40px', marginRight: '10px' }} 
          />
          <Typography variant="h6" component="div">
            NK-Organics
          </Typography>
        </Box>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/products">Products</Button>
        <Button color="inherit" component={Link} to="/checkout">
          Checkout&nbsp;
          <Badge badgeContent={cartItems.length} color="secondary">
            {/* A cart icon or similar can be placed here if needed */}
          </Badge>
        </Button>
        {/* New Admin Login button added to allow easy admin access */}
        <Button color="inherit" component={Link} to="/admin">
          Admin Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;