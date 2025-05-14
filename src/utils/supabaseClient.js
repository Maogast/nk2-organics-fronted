// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// For secure development, we retrieve the Supabase URL and public anon key from
// environment variables. In case these variables are not set (for example, when
// running locally in development), we fall back to default values.
// IMPORTANT: These fallback values must only be used in a secure, non-production
// environment. In production, always set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  'https://bgxbnmllwlzmjkebgpdw.supabase.co';

const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneGJubWxsd2x6bWprZWJncGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMTMwMDEsImV4cCI6MjA2MjU4OTAwMX0.u-BVjAkTV7CcRhV74txSINh9EkserKLUH9xWQIdgh4c';

// Create and export the Supabase client instance.
// The following auth configuration options ensure that:
// - autoRefreshToken: Tokens are automatically refreshed.
// - persistSession: Sessions are persisted across page reloads.
// - detectSessionInUrl: Supabase attempts to process auth redirects automatically.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});