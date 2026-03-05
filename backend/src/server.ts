import app from './app';
import dotenv from 'dotenv';
// import { pool } from './config/db.config';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Optional: Test DB connection on startup
    // pool.getConnection((err, connection) => {
    //   if (err) {
    //     console.error('Database connection failed: ' + err.stack);
    //     return;
    //   }
    //   console.log('Connected to MySQL database.');
    //   connection.release();
    // });
});
