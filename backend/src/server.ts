/**
 * server.ts
 * ─────────────────────────────────────────────────────────────
 * Application entry point.
 * Starts the Express server and verifies Supabase connectivity.
 * ─────────────────────────────────────────────────────────────
 */
import app from './app';
import dotenv from 'dotenv';
import { checkSupabaseConnection } from './config/supabaseClient';

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Verify Supabase connection on startup with retry logic.
 */
async function connectWithRetry(retries = 10, delay = 5000): Promise<void> {
    const connected = await checkSupabaseConnection();

    if (connected) {
        console.log('✅ Connected to Supabase (PostgreSQL).');
        return;
    }

    if (retries > 0) {
        console.log(`⚠️  Supabase connection check failed. Retrying in ${delay / 1000}s... (${11 - retries}/10)`);
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
    } else {
        console.log(
            '\x1b[33m%s\x1b[0m',
            'ℹ️  Supabase not reachable after maximum retries. Application will run using Mock Data.'
        );
    }
}

app.listen(PORT, () => {
    console.log(`🚀 URMS Server running on http://localhost:${PORT}`);
    connectWithRetry();
});
