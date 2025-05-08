// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/cartContext';
import AdminDashboard from './pages/AdminDashboard';


// Use React.lazy to load pages asynchronously (this keeps the app interruptible)
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        {/* Suspense ensures that if a page is loading, a fallback UI is shown */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminDashboard />} />

          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;