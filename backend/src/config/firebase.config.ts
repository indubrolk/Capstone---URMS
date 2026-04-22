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
    if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[33m%s\x1b[0m', 'ℹ️  Firebase Admin not initialized. Auth bypass active for DEV mode.');
    } else {
        console.error('❌ Firebase Admin initialization failed:', error);
    }
}

export { isFirebaseInitialized };
export default admin;
