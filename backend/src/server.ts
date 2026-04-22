import app from './app';
import dotenv from 'dotenv';
import { promisePool } from './config/db.config';

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Attempts to connect to the database with a retry mechanism.
 * @param retries Number of attempts left
 * @param delay Delay between attempts in ms
 */
async function connectWithRetry(retries = 10, delay = 5000) {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Connected to MySQL database.');
        connection.release();
    } catch (err: any) {
        if (retries > 0) {
            console.log(`⚠️ Database connection failed (${err.code}). Retrying in ${delay / 1000}s... (${11 - retries}/10)`);
            setTimeout(() => connectWithRetry(retries - 1, delay), delay);
        } else {
            console.log('\x1b[33m%s\x1b[0m', 'ℹ️ Database connection not available after maximum retries. Application will run using Mock Data.');
        }
    }
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    // Start the connection retry loop
    connectWithRetry();
});
