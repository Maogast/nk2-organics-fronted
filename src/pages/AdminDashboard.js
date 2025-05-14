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
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
// Import Supabase client to fetch chat session data
import { createClient } from '@supabase/supabase-js';

const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

// Initialize Supabase client (for chat sessions)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminDashboard = () => {
  // States related to orders and filtering.
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State for Chat Sessions (new feature)
  const [chatSessions, setChatSessions] = useState([]);

  // States for admin login.
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Function to fetch orders – wrapped in useCallback so its reference stays stable.
  const fetchOrders = useCallback(async () => {
    console.log(`Fetching orders with adminEmail: ${adminEmail}`);
    try {
      const res = await axios.get('/api/orders', {
        headers: { 'x-admin-email': adminEmail },
      });
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

  // Function to fetch chat sessions from your Supabase chat_messages table.
  // Assumes that each message has a "session_id" field.
  const fetchChatSessions = async () => {
    try {
      // Query all chat messages and select session-related fields.
      const { data, error } = await supabase
        .from('chat_messages')
        .select('session_id, message, created_at, sender');
      if (error) {
        console.error('Error fetching chat sessions:', error);
        setErrorMessage('Failed to fetch chat sessions.');
      } else if (data) {
        // Group messages by session_id and determine the latest message.
        const sessionsMap = {};
        data.forEach((msg) => {
          if (!sessionsMap[msg.session_id]) {
            sessionsMap[msg.session_id] = {
              session_id: msg.session_id,
              messages: [],
              lastMessage: msg,
            };
          }
          sessionsMap[msg.session_id].messages.push(msg);
          if (new Date(msg.created_at) > new Date(sessionsMap[msg.session_id].lastMessage.created_at)) {
            sessionsMap[msg.session_id].lastMessage = msg;
          }
        });
        // Convert grouped sessions to an array and sort by latest message date.
        const sessionsArray = Object.values(sessionsMap);
        sessionsArray.sort(
          (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
        );
        setChatSessions(sessionsArray);
      }
    } catch (err) {
      console.error('Error in fetchChatSessions:', err);
      setErrorMessage('Failed to fetch chat sessions.');
    }
  };

  // Fetch orders when admin is logged in.
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      // Also fetch chat session data once logged in.
      fetchChatSessions();
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
    const isVerified = window.confirm("Have you verified that the payment is correct? Click OK to confirm payment.");
    if (!isVerified) return;
    try {
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
        <Button variant="outlined" component={Link} to="/admin/analytics" sx={{ minWidth: '150px' }}>
          Analytics Dashboard
        </Button>
        <Button variant="outlined" component={Link} to="/admin/newsletter" sx={{ minWidth: '150px' }}>
          Newsletter Management
        </Button>
        {/* New Navigation Link for Admin Chat Sessions */}
        <Button variant="outlined" component={Link} to="/admin/chat-sessions" sx={{ minWidth: '150px' }}>
          Chat Sessions
        </Button>
      </Box>

      {/* Search bar and Refresh Orders Button */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search Orders"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="flex-end">
          <Button variant="contained" onClick={fetchOrders} sx={{ minWidth: '150px' }}>
            Refresh Orders
          </Button>
        </Grid>
      </Grid>

      {/* Orders Section - Order Cards */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <Card key={order._id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Order ID: {order._id}
              </Typography>
              <Typography variant="subtitle1">
                Customer: {order.customerName}
              </Typography>
              <Typography variant="body1">
                Email: {order.email}
              </Typography>
              <Typography variant="body1">
                Address: {order.address}
              </Typography>
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
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2">
                Items:
              </Typography>
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
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {order.paymentStatus === 'pending' && order.transactionId && (
                <Button variant="contained" color="success" onClick={() => confirmPayment(order._id)}>
                  Confirm Payment
                </Button>
              )}
              <Button variant="outlined" color="error" onClick={() => handleDelete(order._id)}>
                Delete Order
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No orders to display.
        </Typography>
      )}

      {/* Chat Sessions Section - New Feature */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Chat Sessions
      </Typography>
      {chatSessions.length > 0 ? (
        <Grid container spacing={2}>
          {chatSessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session.session_id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Session ID: {session.session_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Message by {session.lastMessage.sender}: {session.lastMessage.message}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {new Date(session.lastMessage.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* Link to detailed view of this chat session */}
                  <Button
                    size="small"
                    variant="outlined"
                    component={Link}
                    to={`/admin/chat/${session.session_id}`}
                  >
                    View Chat
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No chat sessions available.
        </Typography>
      )}

      {/* Snackbar for error messages */}
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar for success messages */}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;