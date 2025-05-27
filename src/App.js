// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/cartContext';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import HomePage from './pages/HomePage'; // Eagerly loaded
import ChatBot from './components/ChatBot'; // ChatBot widget
import AdminContactMessages from './pages/AdminContactMessages'; // Eagerly imported admin contact page
import AdminChatReply from './pages/AdminChatReply'; // Dedicated admin reply page

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

// A simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh or try again later.</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <AuthProvider>
          <Router>
            <Navbar />
            {/* Main content wrapper with top padding to offset the fixed header */}
            <div style={{ paddingTop: '90px', minHeight: 'calc(100vh - 90px)' }}>
              <ErrorBoundary>
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
                    <Route path="/admin/contact-messages" element={<AdminContactMessages />} />

                    {/* Admin Chat Routes */}
                    <Route path="/admin/chat-sessions" element={<AdminChatSessions />} />
                    <Route path="/admin/chat/:sessionId" element={<AdminChatDetail />} />
                    {/* Dedicated admin reply page */}
                    <Route path="/admin/chat-reply/:sessionId" element={<AdminChatReply />} />

                    {/* Redirect /admin to /admin-dashboard */}
                    <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
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
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;