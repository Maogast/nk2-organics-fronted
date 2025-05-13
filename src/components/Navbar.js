// src/components/Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { CartContext } from '../context/cartContext';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { supabase } from '../utils/supabaseClient';

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorElNav, setAnchorElNav] = useState(null);
  
  // State to manage user session from Supabase Auth.
  const [session, setSession] = useState(null);

  // Set up an auth listener to update the session when authentication changes.
  useEffect(() => {
    const currentSession = supabase.auth.session();
    setSession(currentSession);
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => authListener.unsubscribe();
  }, []);

  // Function handlers to open/close the mobile nav menu.
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Determine which customer-specific link to show:
  // If the user is logged in (session exists), show "Dashboard"
  // Otherwise, show "Login"
  const customerLink = session
    ? { name: 'Dashboard', path: '/dashboard' }
    : { name: 'Login', path: '/auth' };

  // Array of navigation links including new customer features.
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Checkout', path: '/checkout' },
    customerLink, // Conditionally rendered customer auth/dashboard link.
    { name: 'Admin Login', path: '/admin' },
  ];

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
        {/* Logo and Title */}
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
        {/* Desktop vs Mobile Navigation */}
        {isMobile ? (
          <>
            <IconButton size="large" color="inherit" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {navLinks.map((link) => (
                <MenuItem key={link.name} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    component={Link}
                    to={link.path}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {link.name}
                    {link.name === 'Checkout' && (
                      <Badge badgeContent={cartItems.length} color="secondary" sx={{ ml: 0.5 }} />
                    )}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => (
              <Button key={link.name} color="inherit" component={Link} to={link.path}>
                {link.name}
                {link.name === 'Checkout' && (
                  <Badge badgeContent={cartItems.length} color="secondary" sx={{ ml: 0.5 }} />
                )}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;