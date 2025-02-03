import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'social-media-planner'
    }
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  if (error.code === 'PGRST301') {
    return 'Database row level security policy violation';
  }
  if (error.code === '23514') {
    return 'Invalid date values. Due date must be before or equal to publish date';
  }
  if (error.code === '23505') {
    return 'A post with these details already exists';
  }
  if (error.message?.includes('FetchError')) {
    return 'Network error. Please check your connection';
  }
  return error.message || 'An unexpected error occurred';
};

// Retry wrapper for Supabase operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if it's a validation error
      if (error.code?.startsWith('23')) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}