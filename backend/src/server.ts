import app from './app';
import dotenv from 'dotenv';
import { pool } from './config/db.config';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    // Test DB connection on startup and handle failure gracefully
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(
                '\x1b[33m%s\x1b[0m',
                `ℹ️  Database connection not available (${err.code || 'UNKNOWN'}). Check XAMPP MySQL on ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'} and database ${process.env.DB_NAME || 'urms_db'}. Application will run using Mock Data.`
            );
            return;
        }
        console.log('✅ Connected to MySQL database.');
        connection.release();
    });
});
