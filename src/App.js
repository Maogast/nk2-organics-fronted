// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/cartContext';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage'; // Loaded eagerly

// Lazy loaded pages for main public routes
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

// Lazy loaded pages for new customer features:
// Auth: For customer sign-up/sign-in and profile management.
// CustomerDashboard: To allow customers to track their orders.
const Auth = lazy(() => import('./pages/Auth'));                    
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        {/* Main content wrapper with padding to offset the fixed header */}
        <div style={{ paddingTop: '90px', minHeight: 'calc(100vh - 90px)' }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Customer Specific Routes */}
              <Route path="/auth" element={<Auth />} /> 
              {/* 
                /auth: Customer authentication page for login / sign-up 
                and profile management.
              */}
              <Route path="/dashboard" element={<CustomerDashboard />} /> 
              {/* 
                /dashboard: Customer order tracking dashboard where 
                authenticated users can view their order history.
              */}

              {/* Admin Route */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;