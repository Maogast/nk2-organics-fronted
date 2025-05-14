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
import { supabase } from '../utils/supabaseClient';

const CustomerDashboard = () => {
  // Local states for orders, error messages, and loading state
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to fetch orders for the given customer email.
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
      setLoading(false);
    }
  };

  useEffect(() => {
    // Asynchronously retrieve the session and fetch the orders for the logged-in user.
    const getUserAndFetchOrders = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setErrorMessage('Error retrieving session.');
        console.error('Session retrieval error:', error);
        setLoading(false);
        return;
      }
      if (session && session.user && session.user.email) {
        fetchOrders(session.user.email);
      } else {
        setErrorMessage('User is not logged in.');
        setLoading(false);
      }
    };

    getUserAndFetchOrders();
  }, []);

  return (
    // A Container with top margin and bottom padding ensures content isn’t overlapped by a fixed footer.
    <Container sx={{ mt: 4, pb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Order Tracking Dashboard
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
        </>
      )}
    </Container>
  );
};

export default CustomerDashboard;