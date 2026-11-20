import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project-id')
);

// Instantiate Supabase client safely with fallback
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface ConnectionHealth {
  isConfigured: boolean;
  isConnected: boolean;
  status: 'connected' | 'offline' | 'unconfigured' | 'error';
  message: string;
  url: string;
  latencyMs?: number;
}

/**
 * Checks live connectivity to Supabase
 */
export async function checkSupabaseConnection(): Promise<ConnectionHealth> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      isConfigured: false,
      isConnected: false,
      status: 'unconfigured',
      url: supabaseUrl || 'Not configured',
      message: 'Supabase credentials are not configured or using placeholders. Running in local state mode.',
    };
  }

  const start = performance.now();
  try {
    // Ping the auth settings or rest endpoint
    const { error } = await supabase.from('subjects').select('id', { head: true, count: 'exact' });
    const latencyMs = Math.round(performance.now() - start);

    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist or RLS blocks
      return {
        isConfigured: true,
        isConnected: false,
        status: 'error',
        url: supabaseUrl,
        latencyMs,
        message: `Connected to Supabase but query returned: ${error.message}`,
      };
    }

    return {
      isConfigured: true,
      isConnected: true,
      status: 'connected',
      url: supabaseUrl,
      latencyMs,
      message: `Successfully connected to Supabase (${latencyMs}ms)`,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      status: 'offline',
      url: supabaseUrl,
      message: `Unable to reach Supabase server: ${err.message || 'Network error'}`,
    };
  }
}

