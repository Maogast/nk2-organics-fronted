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
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || 'https://via.placeholder.com/150'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
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