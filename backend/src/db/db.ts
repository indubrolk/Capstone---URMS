import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // XAMPP default
  database: "urms_db", // your DB
});

export default db;