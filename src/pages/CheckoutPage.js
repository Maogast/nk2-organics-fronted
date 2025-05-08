// src/pages/CheckoutPage.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { CartContext } from '../context/cartContext';

function CheckoutPage() {
  const { cartItems } = useContext(CartContext);
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    address: '',
  });

  // Group cart items by product name (since no ID is available)
  const groupedCartItems = Object.values(
    cartItems.reduce((acc, item) => {
      const key = item.name;
      if (!acc[key]) {
        acc[key] = { ...item, quantity: 1 };
      } else {
        acc[key].quantity += 1;
      }
      return acc;
    }, {})
  );

  // Calculate the total price using the grouped items and their quantities
  const totalPrice = groupedCartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the order payload with customer info, grouped items, and the total.
    const orderData = {
      orderInfo,
      items: groupedCartItems,
      total: totalPrice,
    };

    try {
      // POST the order to the backend endpoint.
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      console.log('Order Submitted:', response.data);
      alert('Order received! You will be contacted shortly.');
      // Optionally, clear the cart or reset the form here.
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  return (
    <Container
      sx={{
        mt: 4,
        mb: 4,
        pb: '120px', // extra padding bottom to ensure content isn't hidden behind the footer
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 80px)',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please fill in your details to complete your order.
      </Typography>

      {groupedCartItems.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <List>
            {groupedCartItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`}
                    secondary={`Ksh ${(Number(item.price) * item.quantity).toFixed(2)}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Total: Ksh {totalPrice.toFixed(2)}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Your cart is empty.
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <TextField
          required
          label="Name"
          name="name"
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          required
          label="Email"
          name="email"
          type="email"
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          required
          label="Address"
          name="address"
          margin="normal"
          onChange={handleChange}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Place Order
        </Button>
      </Box>
    </Container>
  );
}

export default CheckoutPage;