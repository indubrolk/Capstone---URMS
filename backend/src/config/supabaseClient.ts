/**
 * supabaseClient.ts
 * ─────────────────────────────────────────────────────────────
 * Singleton Supabase client for the URMS backend.
 *
 * Environment variable loading order (last wins):
 *   1. backend/.env        — local overrides (PORT, NODE_ENV)
 *   2. root .env.local     — shared secrets (SUPABASE_URL, keys)
 *
 * Required env vars:
 *   SUPABASE_URL      — e.g. https://xxxx.supabase.co
 *   SUPABASE_ANON_KEY — anon/public key from Supabase dashboard
 * ─────────────────────────────────────────────────────────────
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// 1. Load backend/.env (PORT, NODE_ENV, local overrides)
dotenv.config();

// 2. Load root .env.local — contains SUPABASE_URL, SUPABASE_ANON_KEY,
//    and Firebase keys shared with the Next.js frontend.
//    `override: true` ensures these take precedence if duplicated.
dotenv.config({
    path: path.join(__dirname, '../../../.env.local'),
    override: true
});

const supabaseUrl     = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('your-project-ref')) {
    console.warn(
        '\x1b[33m%s\x1b[0m',
        '⚠️  SUPABASE_URL is not configured. Edit .env.local and set SUPABASE_URL.'
    );
}

if (!supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key')) {
    console.warn(
        '\x1b[33m%s\x1b[0m',
        '⚠️  SUPABASE_ANON_KEY is not configured. Edit .env.local and set SUPABASE_ANON_KEY.'
    );
}

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Singleton Supabase client.
 * Uses the service role key to bypass RLS for backend operations.
 */
export const supabase: SupabaseClient = createClient(
    supabaseUrl  || '',
    supabaseServiceKey || supabaseAnonKey || ''
);

/**
 * Lightweight connectivity check.
 * Returns true  → Supabase is reachable and `resources` table exists.
 * Returns false → Supabase unreachable or not configured.
 */
export async function checkSupabaseConnection(): Promise<boolean> {
    try {
        if (!supabaseUrl || !supabaseAnonKey) return false;

        const { error } = await supabase.from('resources').select('id').limit(1);

        // PGRST116/PGRST205 = table not found → Supabase IS reachable, schema not run yet
        if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
            console.error('❌ Supabase health check failed:', error.message);
            return false;
        }
        return true;
    } catch (err) {
        console.error('❌ Supabase health check threw an error:', err);
        return false;
    }
}

export default supabase;
