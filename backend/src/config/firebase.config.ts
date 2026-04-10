import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

let isFirebaseInitialized = false;

try {
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    isFirebaseInitialized = true;
    console.log('Firebase Admin initialized successfully');
} catch (error) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Firebase Admin initialization failed. Auth will be disabled/bypassable in dev mode.');
    console.warn('Please place serviceAccountKey.json in backend/src/config/ to enable full authentication.');
}

export { isFirebaseInitialized };
export default admin;
