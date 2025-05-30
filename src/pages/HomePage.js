// src/pages/HomePage.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  MobileStepper,
  Paper,
  Divider,
} from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import SwipeableViews from 'react-swipeable-views';

function HomePage() {
  // Testimonials Slider Data & State
  const testimonials = [
    {
      name: "Liz Kwamboka",
      text: "NK‑Organics changed my life! Their natural remedies are truly exceptional.",
    },
    {
      name: "John Orechi",
      text: "I love the quality and authenticity. I recommend NK‑Organics to everyone.",
    },
    {
      name: "Margaret Obilo",
      text: "Great products and fantastic customer service. My go‑to for natural wellness.",
    },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const testimonialMaxSteps = testimonials.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % testimonialMaxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + testimonialMaxSteps) % testimonialMaxSteps);
  };

  // New Featured Products Data (Prices in Kenyan Shillings)
  const featuredProducts = [
    {
      name: "Activated Charcoal",
      description: "Helps to flush out impurities.",
      price: 250,
      imageUrl: "/images/activated-charcoal.jpg",
      category: "Herbs",
    },
    {
      name: "Eucalyptus Oil",
      description: "Relieve respiratory issues.",
      price: 300,
      imageUrl: "/images/eucalyptus-oil.jpg",
      category: "Essential Oils",
    },
    {
      name: "Turmeric",
      description: "Anti-inflammatory.",
      price: 200,
      imageUrl: "/images/turmeric.JPG",
      category: "Spice",
    },
    {
      name: "Jaggery",
      description: "Natural sweetener.",
      price: 200,
      imageUrl: "/images/jaggery.png",
      category: "Baking & Sweet Spices",
    },
  ];

  return (
    <Container
      sx={{
        mt: { xs: '40px', sm: '40px' },
        px: { xs: 2, sm: 4 },
        pb: { xs: '100px', sm: '120px' },
      }}
    >
      {/* Hero Section (Former design restored) */}
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
          Welcome to NK‑Organics!
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

      <Divider sx={{ my: 4 }} />

      {/* Featured Products Section */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Featured Products
        </Typography>
        <Grid container spacing={2}>
          {featuredProducts.map((product, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ height: { xs: 180, sm: 200 } }}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">{product.description}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    KSh {product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined" component={Link} to="/products">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* YouTube Video Section */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Our YouTube Video
        </Typography>
        <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <iframe
            src="https://www.youtube.com/embed/3--P8_Lpwe8?rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Testimonials Slider Section */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          What Our Customers Say
        </Typography>
        <Paper
          elevation={3}
          sx={{ p: 2, maxWidth: 600, margin: '0 auto', position: 'relative' }}
        >
          <SwipeableViews
            index={activeStep}
            onChangeIndex={setActiveStep}
            enableMouseEvents
          >
            {testimonials.map((testimonial, index) => (
              <Box key={index} sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1, textAlign: 'right' }}>
                  - {testimonial.name}
                </Typography>
              </Box>
            ))}
          </SwipeableViews>
          <MobileStepper
            steps={testimonialMaxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button size="small" onClick={handleNext}>
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack}>
                <KeyboardArrowLeft />
                Back
              </Button>
            }
            sx={{ justifyContent: 'center', mt: 2 }}
          />
        </Paper>
      </Box>
    </Container>
  );
}

export default HomePage;