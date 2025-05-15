// src/pages/AdminDashboard.js
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import {
  Container,
  Typography,
  Divider,
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
  List as MUIList,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import AdminNav from '../components/AdminNav';
import { useAuth } from '../context/AuthContext';

const allowedAdminEmails = [
  "stevemagare4@gmail.com",
  "sacalivinmocha@gmail.com",
  "stevecr58@gmail.com"
];

const AdminDashboard = () => {
  // ------------------------------
  // Unconditional Hooks
  // ------------------------------
  const { session, logout, loading } = useAuth();
  const navigate = useNavigate();

  // State for orders and search.
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // State for chat sessions.
  const [chatSessions, setChatSessions] = useState([]);

  // ------------------------------
  // Debounce Hook for Search Term Updates
  // ------------------------------
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );
  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  // ------------------------------
  // Update Filtered Orders on Change
  // ------------------------------
  useEffect(() => {
    const filtered = orders.filter((order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // ------------------------------
  // Fetch Orders Function (with useCallback)
  // ------------------------------
  const fetchOrders = useCallback(async () => {
    const currentAdminEmail = session?.user?.email || "";
    try {
      const res = await axios.get('/api/orders', {
        headers: { 'x-admin-email': currentAdminEmail },
      });
      if (res.data && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setErrorMessage('Unexpected orders format received.');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch orders.');
    }
  }, [session]);

  // ------------------------------
  // Fetch Chat Sessions Function
  // ------------------------------
  const fetchChatSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('session_id, message, created_at, sender');
      if (error) {
        setErrorMessage('Failed to fetch chat sessions.');
      } else if (data) {
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
        const sessionsArray = Object.values(sessionsMap);
        sessionsArray.sort(
          (a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at)
        );
        setChatSessions(sessionsArray);
      }
    } catch (err) {
      setErrorMessage('Failed to fetch chat sessions.');
    }
  };

  // ------------------------------
  // Fetch Data on Mount if Logged In
  // ------------------------------
  useEffect(() => {
    if (session) {
      fetchOrders();
      fetchChatSessions();
    }
  }, [session, fetchOrders]);

  // ------------------------------
  // Update Order Status Function
  // ------------------------------
  const updateOrderStatus = async (orderId, newStatus) => {
    const currentAdminEmail = session?.user?.email || "";
    try {
      await axios.put(
        `/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { 'x-admin-email': currentAdminEmail } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSuccessMessage(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      setErrorMessage('Failed to update order status.');
    }
  };

  // ------------------------------
  // Confirm Payment Function
  // ------------------------------
  const confirmPayment = async (orderId) => {
    const isVerified = window.confirm(
      "Have you verified that the payment is correct? Click OK to confirm payment."
    );
    if (!isVerified) return;
    const currentAdminEmail = session?.user?.email || "";
    try {
      await axios.put(
        `/api/orders/${orderId}/confirm-payment`,
        {},
        { headers: { 'x-admin-email': currentAdminEmail } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: 'confirmed' } : order
        )
      );
      setSuccessMessage(`Payment for Order ${orderId} confirmed.`);
    } catch (error) {
      setErrorMessage('Failed to confirm payment for order.');
    }
  };

  // ------------------------------
  // Handle Order Deletion Function
  // ------------------------------
  const handleDelete = async (orderId) => {
    if (
      window.confirm("Are you sure you want to delete this order? This action cannot be undone.")
    ) {
      const currentAdminEmail = session?.user?.email || "";
      try {
        await axios.delete(`/api/orders/${orderId}`, {
          headers: { 'x-admin-email': currentAdminEmail },
        });
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        setSuccessMessage(`Order ${orderId} deleted successfully.`);
      } catch (error) {
        setErrorMessage('Failed to delete order.');
      }
    }
  };

  // ------------------------------
  // Logout Handler Function
  // ------------------------------
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  // ------------------------------
  // Conditional Render (after hooks)
  // ------------------------------
  if (loading) return <div>Loading...</div>;
  if (!session || !session.user || !allowedAdminEmails.includes(session.user.email.toLowerCase())) {
    return <Navigate to="/login" replace />;
  }

  // ------------------------------
  // Render the Dashboard
  // ------------------------------
  return (
    <>
      <AdminNav handleLogout={handleLogout} />
      <Container sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Orders Dashboard
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search Orders"
              variant="outlined"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                debouncedSetSearchTerm(e.target.value);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={fetchOrders} sx={{ minWidth: '150px' }}>
              Refresh Orders
            </Button>
          </Grid>
        </Grid>
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
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2">Items:</Typography>
                <MUIList>
                  {order.items.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemText
                        primary={`${item.name} x${item.quantity}`}
                        secondary={`Ksh ${(item.price * item.quantity).toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </MUIList>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Update Status</InputLabel>
                  <Select
                    label="Update Status"
                    defaultValue={(order.status && order.status.toLowerCase()) || 'pending'}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="received">Received</MenuItem>
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
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Chat Sessions
        </Typography>
        {chatSessions.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {chatSessions.map((sessionItem) => (
              <Grid item xs={12} sm={6} md={4} key={sessionItem.session_id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Session ID: {sessionItem.session_id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Message by {sessionItem.lastMessage.sender}: {sessionItem.lastMessage.message}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {new Date(sessionItem.lastMessage.created_at).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      component={Link}
                      to={`/admin/chat/${sessionItem.session_id}`}
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
    </>
  );
};

export default AdminDashboard;