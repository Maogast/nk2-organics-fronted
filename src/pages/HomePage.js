// src/pages/HomePage.js
import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button 
} from '@mui/material';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';

function HomePage() {
  return (
    <Container
      sx={{
        mt: { xs: '70px', sm: '80px' }, // Extra top margin to offset the fixed navbar.
        px: { xs: 2, sm: 4 },
        pb: { xs: '120px', sm: '140px' }, // Bottom padding reserved for the fixed footer.
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          p: { xs: 2, sm: 4 },
          textAlign: 'center',
          borderRadius: 2,
          mb: { xs: 2, sm: 4 },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          Welcome to NK-Organics!
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
        >
          Discover our range of natural herbs, spices, essential oils, nuts, natural sweeteners, and more – all designed to nurture your body and soul.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/products"
          sx={{ mt: 2 }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Image Carousel Section */}
      <ImageCarousel />
    </Container>
  );
}

export default HomePage;