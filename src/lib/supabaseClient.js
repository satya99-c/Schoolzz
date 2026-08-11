import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mvsqyahtzbvszxrfmawv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12c3F5YWh0emJ2c3p4cmZtYXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTY3MDEsImV4cCI6MjEwMTMzMjcwMX0.8PIYpaLLzLfS3sYuqab4AAA50axJc95uUZVxPrX8Yek';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('YOUR_SUPABASE')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
