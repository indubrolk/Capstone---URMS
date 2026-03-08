# URMS Project Documentation

Welcome to the **University Resource Management System (URMS)** documentation portal. URMS is a centralized platform for managing specialized laboratory equipment and facilities across all university faculties.

---

## 🚀 Quick Start
Ready to set up URMS in your local environment? Follow these guides:

1. [**Firebase Setup Guide**](Docs/firebase-setup.md) - Get your authentication system up and running.
2. [**Frontend & Backend Setup**](backend/README.md) - How to run the Next.js frontend and the Node.js backend.

---

## 📂 Core Architecture

### **Next.js Frontend (`/app`)**
The frontend is built with Next.js 15, Tailwind CSS v4, and Lucide icons.
- **Routing**: Uses the App Router for both public and protected pages.
- **Styling**: Premium, responsive UI powered by `@apply` and CSS variables in `globals.css`.
- **Components**: Reusable blocks like `Navbar`, `Footer`, and `ProtectedRoute`.

### **Node.js Backend (`/backend`)**
The backend manages data persistence and high-level logic.
- **Environment**: Node.js ecosystem.
- **Scripts**: See `package.json` for details on how to run.

---

## 🔒 Authentication & Access Control
URMS uses **Firebase Authentication** for user management.
- **Protected Routes**: Pages like `/dashboard`, `/bookings`, and `/resources` are wrapped in `ProtectedRoute`.
- **Auth Provider**: A custom `AuthProvider` manages the login state and user sessions.

---

## 🎨 Branding & Design System
- **Colors**: Deep Navy (`brand-primary`) and Vibrant Cerulean (`brand-accent`).
- **Logo**: Stylized building + network node (`public/urms-logo.png`).
- **Typography**: Modern, clean sans-serif (Inter).

---

## 🛠️ Key Scripts
- `npm run dev` - Start the Next.js frontend.
- `npm run test` - Run unit tests for core utilities.
- `npm run build` - Create a production-ready bundle.

---
> [!NOTE]
> This project is developed as part of **Capstone Group 15**.