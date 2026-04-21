import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Run backup every Sunday at midnight, or use setInterval for simplicity in this implementation
const BACKUP_DIR = path.join(__dirname, '../../backups');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export const startBackupCron = () => {
    // 24 hours in milliseconds
    const INTERVAL = 24 * 60 * 60 * 1000;

    console.log('Automated database backup cron initialized. Running every 24 hours.');

    setInterval(() => {
        const date = new Date().toISOString().split('T')[0];
        const fileName = `urms_backup_${date}.sql`;
        const filePath = path.join(BACKUP_DIR, fileName);

        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || '3307';
        const user = process.env.DB_USER || 'root';
        const pass = process.env.DB_PASSWORD || '';
        const dbName = process.env.DB_NAME || 'urms_db';

        // Note: mysqldump must be in the system PATH
        const passArg = pass ? `-p${pass}` : '';
        const dumpCommand = `mysqldump -h ${host} -P ${port} -u ${user} ${passArg} ${dbName} > "${filePath}"`;

        exec(dumpCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Backup failed: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Backup stderr: ${stderr}`);
            }
            console.log(`Database backup successful: ${filePath}`);
        });
    }, INTERVAL);
};
