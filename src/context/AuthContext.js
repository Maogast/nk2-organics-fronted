// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, fetch initial session and subscribe to auth changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Subscribe to auth state changes.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // On cleanup, safely unsubscribe from auth state changes.
    return () => {
      if (data && data.subscription && typeof data.subscription.unsubscribe === 'function') {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  // Simple login function using Supabase auth.
  const login = async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    // Supabase automatically persists the session.
    setSession(data.session);
  };

  // Logout function.
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper hook to use the AuthContext.
export const useAuth = () => useContext(AuthContext);