// src/components/Navbar.js
import React, { useState, useContext } from 'react';
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
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorElNav, setAnchorElNav] = useState(null);

  // Retrieve the session from our AuthContext.
  const { session, loading } = useAuth();

  // Define allowed admin emails.
  const allowedAdminEmails = [
    "stevemagare4@gmail.com",
    "sacalivinmocha@gmail.com",
    "stevecr58@gmail.com"
  ];
  const isAdmin = session && session.user && allowedAdminEmails.includes(session.user.email.toLowerCase());

  // Construct navigation links.
  // Always include Home, Products, and Checkout.
  // Then, if loading is complete, if the user is logged in:
  //   * If the user is an admin, show "Admin Dashboard"
  //   * Otherwise, show "Dashboard" for regular customers.
  // If not logged in, show "Login".
  let navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Checkout', path: '/checkout' },
  ];
  if (!loading) {
    if (session) {
      if (isAdmin) {
        navLinks.push({ name: 'Admin Dashboard', path: '/admin-dashboard' });
      } else {
        navLinks.push({ name: 'Dashboard', path: '/dashboard' });
      }
    } else {
      navLinks.push({ name: 'Login', path: '/login' });
    }
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

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

        {/* Responsive Navigation */}
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
                      <Badge
                        badgeContent={cartItems.length}
                        color="secondary"
                        sx={{ ml: 0.5 }}
                      />
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