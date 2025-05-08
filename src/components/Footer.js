// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ 
      backgroundColor: 'primary.dark', 
      color: 'white', 
      p: 2,
      textAlign: 'center',
      position: 'fixed',
      bottom: 0,
      width: '100%'
    }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} NK-Organics. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;