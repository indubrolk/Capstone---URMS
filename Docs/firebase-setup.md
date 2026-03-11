# Firebase Configuration Guide

This guide explains how to set up Firebase for the URMS project and configure your local environment variables.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the setup steps (you can skip Google Analytics for development).
3. Once the project is created, click on the **Web icon (</>)** in the project overview to register a new web app.

## 2. Register Your Web App
1. Give your app a nickname (e.g., `URMS-Dev`).
2. Click **Register app**.
3. You will see a `firebaseConfig` object containing several keys. **Keep this window open.**

## 3. Configure Local Environment Variables
The project uses `.env.local` to store sensitive configuration. This file is ignored by Git to prevent your keys from being exposed.

1. Open `.env.local` in the root of the project.
2. Replace the placeholder values with the corresponding keys from the `firebaseConfig` object you got from the console:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (apiKey)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com (authDomain)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id (projectId)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com (storageBucket)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 (messagingSenderId)
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456... (appId)
```

## 4. Enable Authentication
1. In the Firebase Console, go to **Build** → **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Add new provider**.
4. Select **Email/Password** and enable it.
5. Click **Save**.

## 5. Add a Test User (Optional)
While you can use the login page, you might want to add a user manually for the first test:
1. Go to **Build** → **Authentication** → **Users**.
2. Click **Add user**.
3. Enter an email and password (e.g., `test@university.ac.lk` and `password123`).

## 6. Restart Development Server
After updating `.env.local`, you must restart your Next.js development server for the changes to take effect:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---
> [!IMPORTANT]
> **Security Reminder**: Never commit your `.env.local` file. It contains keys that should remain private to your local environment.
