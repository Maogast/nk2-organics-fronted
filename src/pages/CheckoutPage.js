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
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CartContext } from '../context/cartContext';

function CheckoutPage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { cartItems, clearCart } = useContext(CartContext);
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    email: '',
    address: '',
  });
  const [transactionId, setTransactionId] = useState('');

  // Group cart items by product name (since no unique ID is available)
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

  // Calculate the total price using grouped cart items
  const totalPrice = groupedCartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value });
  };

  const handleTransactionChange = (e) => {
    setTransactionId(e.target.value.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      orderInfo,
      items: groupedCartItems,
      total: totalPrice,
      transactionId,
    };

    try {
      const response = await axios.post('/api/orders', orderData);
      console.log('Order Submitted:', response.data);
      alert('Order received! You will be contacted shortly.');
      clearCart();
      setOrderInfo({ name: '', email: '', address: '' });
      setTransactionId('');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  return (
    <Container
      sx={{
        mt: { xs: 2, md: 4 },
        mb: 4,
        // Increase bottom padding to ensure the submit button isn't overlapped by the footer.
        pb: { xs: '180px', md: '120px' },
        // Removed maxHeight property to allow full scroll.
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Checkout
      </Typography>
      <Typography variant="body1" gutterBottom align="center">
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
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel your current order and start fresh?')) {
                clearCart();
              }
            }}
          >
            Clear Cart
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Your cart is empty.
        </Typography>
      )}

      {/* Payment Instructions Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment Instructions
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please send your payment to <strong>Pochi la Biashara number 0768564533</strong>.
          </Typography>
          <Typography variant="body2" gutterBottom>
            After payment, enter your transaction ID below to confirm your payment.
          </Typography>
          <TextField
            label="Transaction ID"
            variant="outlined"
            value={transactionId}
            onChange={handleTransactionChange}
            fullWidth
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* Order Details Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        <TextField
          required
          label="Name"
          name="name"
          margin="normal"
          value={orderInfo.name}
          onChange={handleChange}
        />
        <TextField
          required
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={orderInfo.email}
          onChange={handleChange}
        />
        <TextField
          required
          label="Address"
          name="address"
          margin="normal"
          value={orderInfo.address}
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