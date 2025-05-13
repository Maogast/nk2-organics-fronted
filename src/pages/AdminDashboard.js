// src/pages/AdminDashboard.js

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';

const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const AdminDashboard = () => {
  // States related to orders and filtering.
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // States for admin login.
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Function to fetch orders – wrapped in useCallback so its reference stays stable.
  const fetchOrders = useCallback(async () => {
    // Log the admin email used in the request header.
    console.log(`Fetching orders with adminEmail: ${adminEmail}`);

    try {
      // Use a relative URL so that the request is routed via Vercel.
      const res = await axios.get('/api/orders', {
        headers: { 'x-admin-email': adminEmail },
      });
      // Debug: Check the shape of the response.
      console.log('Orders fetch response:', res.data);
      if (res.data && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
        setFilteredOrders(res.data.orders);
      } else {
        console.error('Unexpected orders format:', res.data);
        setErrorMessage('Unexpected orders format received.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Failed to fetch orders.');
    }
  }, [adminEmail]);

  // Fetch orders when admin is logged in.
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn, fetchOrders]);

  // Update filtered orders when orders or search term changes.
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Function to update the shipping status of a specific order.
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { 'x-admin-email': adminEmail } }
      );
      console.log('Order update response:', res.data);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSuccessMessage(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      setErrorMessage('Failed to update order status.');
    }
  };

  // Function to confirm payment (update paymentStatus to confirmed) with confirmation prompt.
  const confirmPayment = async (orderId) => {
    // Ask the admin if they're sure they've verified the payment details.
    const isVerified = window.confirm("Have you verified that the payment is correct? Click OK to confirm payment.");
    if (!isVerified) return; // Exit if the admin cancels the confirmation.

    try {
      // Await the PUT request without capturing the response, as it's not used.
      await axios.put(
        `/api/orders/${orderId}/confirm-payment`,
        {},
        { headers: { 'x-admin-email': adminEmail } }
      );
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, paymentStatus: 'confirmed' } : order
        )
      );
      setSuccessMessage(`Payment for Order ${orderId} confirmed.`);
    } catch (error) {
      console.error('Error confirming payment:', error);
      setErrorMessage('Failed to confirm payment for order.');
    }
  };

  // Function to handle deletion of an order.
  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/orders/${orderId}`, {
          headers: { 'x-admin-email': adminEmail },
        });
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        setSuccessMessage(`Order ${orderId} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting order:", error);
        setErrorMessage('Failed to delete order.');
      }
    }
  };

  // Simple login handler.
  const handleLogin = () => {
    if (allowedAdminEmails.includes(adminEmail.toLowerCase())) {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError('Unauthorized email. Access denied.');
    }
  };

  // If not logged in, show only the login form.
  if (!isLoggedIn) {
    return (
      <Container sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          label="Admin Email"
          variant="outlined"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
        {loginError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}
      </Container>
    );
  }

  // Render the dashboard after login.
  return (
    <Container sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      {/* Navigation Links for Additional Admin Features */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Button
          variant="outlined"
          component={Link}
          to="/admin/analytics"
          sx={{ minWidth: '150px' }}
        >
          Analytics Dashboard
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to="/admin/newsletter"
          sx={{ minWidth: '150px' }}
        >
          Newsletter Management
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 2,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <TextField
          label="Search Orders"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ maxWidth: { xs: '100%', sm: '300px' } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchOrders}
          sx={{ minWidth: '150px' }}
        >
          Refresh Orders
        </Button>
      </Box>
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <Box
            key={order._id}
            sx={{
              border: '1px solid #ddd',
              borderRadius: 1,
              p: { xs: 1, sm: 2 },
              mb: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Order ID: {order._id}
            </Typography>
            <Typography variant="subtitle1">Customer: {order.customerName}</Typography>
            <Typography variant="body1">Email: {order.email}</Typography>
            <Typography variant="body1">Address: {order.address}</Typography>
            <Typography variant="body2">
              Total: Ksh {Number(order.totalPrice).toFixed(2)}
            </Typography>
            <Typography variant="body2">
              Placed on: {new Date(order.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              Status: {order.status || 'pending'}
            </Typography>
            <Typography variant="body2">
              Transaction ID: {order.transactionId ? order.transactionId : 'Not Provided'}
            </Typography>
            <Typography variant="body2">
              Payment Status: {order.paymentStatus}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Items:</Typography>
            <List>
              {order.items.map((item, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText
                    primary={`${item.name} x${item.quantity}`}
                    secondary={`Ksh ${(item.price * item.quantity).toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Update Status</InputLabel>
              <Select
                label="Update Status"
                defaultValue={order.status || 'pending'}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processed">Processed</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            {order.paymentStatus === 'pending' && order.transactionId && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => confirmPayment(order._id)}
                >
                  Confirm Payment
                </Button>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(order._id)}
              >
                Delete Order
              </Button>
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No orders to display.
        </Typography>
      )}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;