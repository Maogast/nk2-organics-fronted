// src/components/Footer.js
import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
// We'll use TwitterIcon for X (formerly Twitter)
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { FaTiktok } from 'react-icons/fa';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.dark',
        color: 'white',
        p: { xs: 0.5, sm: 1 },
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: { xs: '70px', sm: '90px' }, // increased height to accommodate additional links
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Social Media Links */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <IconButton
          href="https://www.facebook.com/profile.php?id=61574450740676"
          target="_blank"
          sx={{ color: 'white', p: 0.5 }}
          aria-label="Facebook"
        >
          <FacebookIcon fontSize="small" />
        </IconButton>
        <IconButton
          href="https://www.instagram.com/yourprofile"
          target="_blank"
          sx={{ color: 'white', p: 0.5 }}
          aria-label="Instagram"
        >
          <InstagramIcon fontSize="small" />
        </IconButton>
        <IconButton
          href="https://x.com/Naturekitchenor"
          target="_blank"
          sx={{ color: 'white', p: 0.5 }}
          aria-label="X"
        >
          <TwitterIcon fontSize="small" />
        </IconButton>
        <IconButton
          href="https://wa.me/254748423135"
          target="_blank"
          sx={{ color: 'white', p: 0.5 }}
          aria-label="WhatsApp"
        >
          <WhatsAppIcon fontSize="small" />
        </IconButton>
        <IconButton
          href="https://vm.tiktok.com/ZMByLLCKP/"
          target="_blank"
          sx={{ color: 'white', p: 0.5 }}
          aria-label="TikTok"
        >
          <FaTiktok size={16} color="white" />
        </IconButton>
        <IconButton
          href="https://www.youtube.com/@NaturesKitchenorganics"
          target="_blank"
          sx={{ color: 'white', p: 0.5 }}
          aria-label="YouTube"
        >
          <YouTubeIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Quick Navigation Links */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          mt: 0.5,
        }}
      >
        <Link
          href="/about"
          underline="hover"
          sx={{ color: 'white', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
        >
          About Us
        </Link>
        <Link
          href="/contact"
          underline="hover"
          sx={{ color: 'white', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
        >
          Contact
        </Link>
        <Link
          href="/privacy-policy"
          underline="hover"
          sx={{ color: 'white', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          underline="hover"
          sx={{ color: 'white', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
        >
          Terms of Service
        </Link>
      </Box>
      
      {/* Copyright */}
      <Typography variant="caption" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, mt: 0.5 }}>
        © {new Date().getFullYear()} NK-Organics. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;