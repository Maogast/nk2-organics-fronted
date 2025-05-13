// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL and public anon key from environment variables,
// or fall back to default values (for development purposes).
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://bgxbnmllwlzmjkebgpdw.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneGJubWxsd2x6bWprZWJncGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMTMwMDEsImV4cCI6MjA2MjU4OTAwMX0.u-BVjAkTV7CcRhV74txSINh9EkserKLUH9xWQIdgh4c';

// Create and export the Supabase client instance.
// This client supports all interactions, including authentication, storage, and realtime.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// You can now use supabase.auth in your Auth pages for login, sign-up, 
// and other authentication-related operations.