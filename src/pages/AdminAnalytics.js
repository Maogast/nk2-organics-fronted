// src/pages/AdminAnalytics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AdminBackButton from '../components/AdminBackButton';

// Register chart components.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/analytics');
        // Expecting response in the shape: { dates: [...], revenue: [...] }
        setAnalyticsData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error(err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Configure data for the Line chart.
  const data = {
    labels: analyticsData.dates,
    datasets: [
      {
        label: 'Revenue',
        data: analyticsData.revenue,
        fill: false,
        backgroundColor: 'rgb(75,192,192)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Container sx={{ mt: 4 }}>
      <AdminBackButton />
      <Typography variant="h4" gutterBottom>
        Sales Analytics
      </Typography>
      <Line data={data} />
    </Container>
  );
};

export default AdminAnalytics;