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

// Lazy loaded pages for new customer features
const Auth = lazy(() => import('./pages/Auth'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));

// Lazy loaded pages for new admin features
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const NewsletterSubscription = lazy(() => import('./pages/NewsletterSubscription'));

// Lazy load ChatBot
import ChatBot from './components/ChatBot';

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
              <Route path="/dashboard" element={<CustomerDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/newsletter" element={<NewsletterSubscription />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />

        {/* Floating ChatBot widget positioned above the footer */}
        <div
          style={{
            position: 'fixed',
            // Calculate a bottom offset to leave space for the Footer (e.g., Footer height 90px + 20px margin)
            bottom: 'calc(90px + 20px)',
            right: 20,
            zIndex: 1100,
          }}
        >
          <ChatBot />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;