// src/components/ProductCard.js
import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { CartContext } from '../context/cartContext';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card sx={{ width: { xs: '100%', sm: 345 }, m: { xs: 1, sm: 2 } }}>
      <CardMedia
        component="img"
        height={{ xs: 150, sm: 200 }}
        image={product.imageUrl || 'https://via.placeholder.com/150'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          {product.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Ksh {Number(product.price).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          variant="contained" 
          color="primary" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;