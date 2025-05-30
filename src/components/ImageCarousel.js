// src/components/ImageCarousel.js
import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const images = [
   // Fresh Ingredients – a bright kitchen flatlay with fresh vegetables and herbs
  'https://cdn.pixabay.com/photo/2018/06/10/17/39/market-3466906_1280.jpg',
  // Natural Herbs – a vibrant image showing fresh herbs
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  // Organic Spices – a colorful close-up of assorted spices
  'https://media.istockphoto.com/id/941858854/photo/herbs-and-spices-for-cooking-on-dark-background.jpg?s=2048x2048&w=is&k=20&c=E820zsA3GWdQLJCeMI-s7tZXvr6FsLc3Fd756dAkOg4=',
  // Local image from the public/images folder:
  '/images/WhatsApp_Image_2025-04-23_at_17.48.39.jpeg',
];

function ImageCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: 'auto',
        mt: { xs: 2, sm: 4 },
        mb: { xs: 2, sm: 4 },
      }}
    >
      <Slider {...settings}>
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '200px', sm: '400px' }, // Controls the slide height
            }}
          >
            <Box 
              component="img"
              src={img}
              alt={`Slide ${index + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                // Apply 'contain' only for the last image; otherwise, 'cover'
                objectFit: index === images.length - 1 ? 'contain' : 'cover',
                borderRadius: 2,
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default ImageCarousel;