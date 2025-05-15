// src/pages/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  // Get the session and loading state from AuthContext.
  const { session, loading } = useAuth();
  
  // Local states for orders, error messages, and orders loading.
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Function to fetch orders for the logged-in customer.
  const fetchOrders = async (customerEmail) => {
    try {
      const res = await axios.get('/api/customerOrders', {
        headers: { 'x-customer-email': customerEmail },
      });
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch orders.');
      console.error('Error fetching customer orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (session && session.user && session.user.email) {
      fetchOrders(session.user.email);
    } else {
      setLoadingOrders(false);
    }
  }, [session]);

  // While authentication or orders are loading, show a spinner.
  if (loading || loadingOrders) {
    return (
      <Container sx={{ mt: 4, pb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // If no session exists, redirect the user to the login page.
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container sx={{ mt: 4, pb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Order Tracking Dashboard
      </Typography>
      {errorMessage && (
        <Typography color="error" sx={{ my: 2 }}>
          {errorMessage}
        </Typography>
      )}
      <List>
        {orders.map((order) => (
          <React.Fragment key={order._id}>
            <ListItem>
              <ListItemText
                primary={`Order ID: ${order._id}`}
                secondary={`Status: ${order.status || 'pending'} – Total: Ksh ${order.totalPrice}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {orders.length === 0 && !errorMessage && (
        <Typography sx={{ mt: 2 }}>No orders found.</Typography>
      )}
    </Container>
  );
};

export default CustomerDashboard;