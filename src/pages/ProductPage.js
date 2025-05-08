import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // An AbortController allows us to cancel the request if this component unmounts
    const abortController = new AbortController();

    axios
      .get(
        // This URL calls your local backend which is connected to Atlas
        // For a production build, consider using an environment variable like process.env.REACT_APP_API_URL
        'http://localhost:5000/products',
        { signal: abortController.signal }
      )
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        // Check if the error is due to cancelled request; ignore if so.
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.error('Error fetching products:', err);
          setError('Error fetching products');
          setLoading(false);
        }
      });

    // Cleanup to cancel the request if the component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6">Loading products…</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product Catalog
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ProductPage;