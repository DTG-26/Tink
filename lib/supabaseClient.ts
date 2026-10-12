/**
 * Supabase Client Initialization
 * Conforms to Master Build Blueprint Section 3
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

// Supabase client instance
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://dummy.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'dummy-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);
