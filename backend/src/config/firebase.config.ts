import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

try {
    const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
    // Ensure the JSON exists, otherwise it will throw an error
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('Firebase Admin initialized successfully');
} catch (error) {
    console.error('Firebase Admin initialization error. Be sure to place serviceAccountKey.json in src/config/: ', error);
}

export default admin;
