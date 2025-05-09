// src/components/Navbar.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CartContext } from '../context/cartContext';

function Navbar() {
  const { cartItems } = useContext(CartContext);

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 3 },
        }}
      >
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} to="/checkout">
            Checkout&nbsp;
            <Badge badgeContent={cartItems.length} color="secondary" />
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Admin Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;