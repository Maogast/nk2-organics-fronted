// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/cartContext';
import HomePage from './pages/HomePage'; // Eagerly loaded
import ChatBot from './components/ChatBot'; // ChatBot widget

// Lazy loaded pages for main public routes
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

// Lazy loaded pages for new customer features
const Auth = lazy(() => import('./pages/Auth')); // Unified login for customers & admins
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));

// Lazy loaded pages for new admin features
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const NewsletterSubscription = lazy(() => import('./pages/NewsletterSubscription'));

// Lazy loaded pages for admin chat features
const AdminChatSessions = lazy(() => import('./pages/AdminChatSessions'));
const AdminChatDetail = lazy(() => import('./pages/AdminChatDetail'));

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        {/* Main content wrapper with top padding to offset the fixed header */}
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

              {/* Unified Login Page */}
              <Route path="/login" element={<Auth />} />

              {/* Customer Specific Routes */}
              <Route path="/dashboard" element={<CustomerDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/newsletter" element={<NewsletterSubscription />} />

              {/* Admin Chat Routes */}
              <Route path="/admin/chat-sessions" element={<AdminChatSessions />} />
              <Route path="/admin/chat/:sessionId" element={<AdminChatDetail />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />

        {/* Floating ChatBot widget positioned above the footer */}
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(90px + 20px)', // leaves space for Footer
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