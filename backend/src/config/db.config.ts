import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to handle multiple concurrent connections
export const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'urms_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// To use promises for async/await pattern
export const promisePool = pool.promise();
