import { promisePool } from "../config/db.config";

// Use the consolidated promise pool from config to ensure consistency and efficiency
const db = promisePool;

export default db;