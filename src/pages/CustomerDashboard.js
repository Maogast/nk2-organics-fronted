import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { supabase } from '../supabaseClient';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
    }
  };

  useEffect(() => {
    const user = supabase.auth.user();
    if (user && user.email) {
      fetchOrders(user.email);
    } else {
      setErrorMessage('User is not logged in.');
    }
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Tracking Dashboard
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
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
      {orders.length === 0 && <Typography>No orders found.</Typography>}
    </Container>
  );
};

export default CustomerDashboard;