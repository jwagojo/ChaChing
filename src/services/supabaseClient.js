import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[supabase] URL loaded:', supabaseUrl ? supabaseUrl.slice(0, 30) + '...' : 'MISSING');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
