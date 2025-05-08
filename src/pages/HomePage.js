// src/pages/HomePage.js
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to NK-Organics!
        </Typography>
        <Typography variant="body1">
          Discover our range of natural herbs and spices designed to nurture your body and soul.
        </Typography>
        <Button variant="contained" color="secondary" component={Link} to="/products" sx={{ mt: 2 }}>
          Shop Now
        </Button>
      </Box>
      {/* You could add sections for featured products, testimonials, etc., here */}
    </Container>
  );
}

export default HomePage;