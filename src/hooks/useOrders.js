// src/hooks/useOrders.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useOrders = (adminEmail, searchTerm = '') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { 'x-admin-email': adminEmail },
      });
      if (res.data && Array.isArray(res.data.orders)) {
        const filtered = res.data.orders.filter((order) =>
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setOrders(filtered);
      } else {
        setErrorMessage('Unexpected orders format received.');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  }, [adminEmail, searchTerm]);

  useEffect(() => {
    if (adminEmail) {
      fetchOrders();
    }
  }, [adminEmail, fetchOrders]);

  return { orders, loading, errorMessage, refetch: fetchOrders };
};

export default useOrders;