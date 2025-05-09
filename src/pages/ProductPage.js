// src/pages/ProductPage.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const abortController = new AbortController();

    // Using a relative URL will let the proxy (in package.json) handle routing.
    axios
      .get('/api/data/products.json', { signal: abortController.signal })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.error('Error fetching products:', err);
          setError('Error fetching products');
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Loading products…
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  // Normalize category strings (trim them) and filter out falsy values.
  const normalizedCategories = products
    .map((product) => product.category ? product.category.trim() : '')
    .filter(Boolean);
  
  // Use a Set to extract unique values.
  const uniqueCategories = Array.from(new Set(normalizedCategories));
  
  // Include "All" at the beginning.
  const categories = ['All', ...uniqueCategories];

  // Filter products based on category and search term.
  const filteredByCategory =
    categoryFilter === 'All'
      ? products
      : products.filter((product) => product.category.trim() === categoryFilter);
  
  const filteredProducts = filteredByCategory.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem' } }}
      >
        Product Catalog
      </Typography>

      {/* Search and Category Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth={isSmallScreen}
          sx={{ maxWidth: { xs: '100%', sm: '300px' } }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Display Products */}
      <Grid container spacing={3}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={product._id || product.name}
            >
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              No products found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default ProductPage;