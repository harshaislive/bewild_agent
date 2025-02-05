import { createClient, PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export type SupabaseQuery<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export async function withRetry<T>(
  fn: () => Promise<SupabaseQuery<T>>,
  maxRetries = 3
): Promise<SupabaseQuery<T>> {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        return { data: null, error: error as PostgrestError };
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
  return { data: null, error: null };
}

export function handleSupabaseError(error: PostgrestError | unknown): string {
  if (!error) return 'An unknown error occurred';

  if (typeof error === 'string') return error;

  if (error instanceof Error) return error.message;

  const postgrestError = error as PostgrestError;
  if (postgrestError.message) return postgrestError.message;

  return 'An unknown error occurred';
}