import React, { useState, useEffect } from 'react';

const ProductList = () => {
  // State to store products, loading status, and potential errors
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch products once when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/products') // Adjust the URL if your backend is hosted elsewhere
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle loading and error states
  if (loading) {
    return <div>Loading products…</div>;
  }

  if (error) {
    return <div>Error fetching products: {error}</div>;
  }

  // Render the product list
  return (
    <div>
      <h1>Product Catalog</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li key={product._id} style={{ marginBottom: '2rem' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${Number(product.price).toFixed(2)}</p>
            <img src={product.imageUrl} alt={product.name} width="150" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;