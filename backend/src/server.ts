import app from './app';
import dotenv from 'dotenv';
import { pool } from './config/db.config';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Test DB connection on startup and handle failure gracefully
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'ℹ️  Database connection not available (ECONNREFUSED). Application will run using Mock Data.');
            return;
        }
        console.log('✅ Connected to MySQL database.');
        connection.release();
    });
});
