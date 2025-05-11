// src/pages/AboutPage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function AboutPage() {
  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" gutterBottom>
        About NK‑Organics
      </Typography>
      
      {/* Our Story */}
      <Typography variant="body1" paragraph>
        NK‑Organics was founded by Sacalivin Mocha and Stephen Magare, driven by a deep passion for natural wellness and a commitment to serve the community. Inspired by the timeless healing power found in nature, their vision was to create a "Balm of Gilead"—a natural remedy that soothes, heals, and uplifts.
      </Typography>
      
      {/* Our Mission */}
      <Typography variant="body1" paragraph>
        At NK‑Organics, our mission is to share the best that nature has to offer. By carefully curating an exclusive range of organic herbs, spices, essential oils, nuts, and natural sweeteners, we strive to nurture both body and soul. We combine revered traditional practices with modern quality standards to ensure every product we offer remains pure, potent, and sustainable.
      </Typography>
      
      {/* Our Core Values */}
      <Typography variant="body1" paragraph>
        Our core values are the foundation of everything we do:
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <Typography component="li" variant="body1">
          <strong>Quality & Purity:</strong> We use only the finest, ethically sourced ingredients to create effective natural remedies.
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Sustainability:</strong> We are committed to preserving our planet’s resources through environmentally responsible practices.
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Holistic Wellness:</strong> Our products nurture the mind, body, and spirit, promoting a balanced, healthy lifestyle.
        </Typography>
        <Typography component="li" variant="body1">
          <strong>Community‑Centric:</strong> We believe in offering a true Balm of Gilead—natural healing solutions that support and empower our community.
        </Typography>
      </Box>
      
      {/* Our Invitation */}
      <Typography variant="body1" paragraph>
        We invite you to explore our carefully crafted range of products and join us on a journey toward holistic wellness and balance. Thank you for choosing NK‑Organics; your well‑being is our foremost mission.
      </Typography>
    </Container>
  );
}

export default AboutPage;