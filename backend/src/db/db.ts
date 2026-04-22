import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // XAMPP default
  database: process.env.DB_NAME || "urms_db_new", // your DB
  port: Number(process.env.DB_PORT) || 3306,
});

export default db;