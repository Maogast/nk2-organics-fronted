// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/cartContext';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage'; // Loaded eagerly
import ChatBot from './components/ChatBot'; // ChatBot widget

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

// Lazy loaded pages for admin chat features
const AdminChatSessions = lazy(() => import('./pages/AdminChatSessions'));
const AdminChatDetail = lazy(() => import('./pages/AdminChatDetail'));

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

              {/* New Admin Chat Routes */}
              {/* 
                  Route to view a list of all chat sessions.
                  This will display an overview of chat sessions (each representing a dedicated conversation with a visitor).
              */}
              <Route path="/admin/chat-sessions" element={<AdminChatSessions />} />
              
              {/* 
                  Detailed chat view for a specific session.
                  The session ID is passed as a URL parameter.
                  This allows the admin to view and respond to a dedicated visitor chat.
              */}
              <Route path="/admin/chat/:sessionId" element={<AdminChatDetail />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />

        {/* Floating ChatBot widget positioned above the footer */}
        <div
          style={{
            position: 'fixed',
            // Leaves space for the Footer (Footer height 90px + 20px margin)
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