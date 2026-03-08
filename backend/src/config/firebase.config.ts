import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

try {
    // Option 1: Initialize using path to service account key file
    // const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
    // const serviceAccount = require(serviceAccountPath);

    // Option 2: Initialize using environment variables if deploying on cloud
    // Or pass credentials manually

    // This is a placeholder initialization. You'll need to download your service account JSON 
    // from Firebase Console and place it appropriately or use ENV variables.

    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount)
    // });

    // console.log('Firebase Admin initialized successfully');
} catch (error) {
    console.error('Firebase Admin initialization error', error);
}

export default admin;
