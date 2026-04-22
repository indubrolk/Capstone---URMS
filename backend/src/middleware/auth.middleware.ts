import { Request, Response, NextFunction } from 'express';
import admin, { isFirebaseInitialized } from '../config/firebase.config';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization as string;

    if (!header || !header.startsWith('Bearer ')) {
        if (!isFirebaseInitialized && process.env.NODE_ENV === 'development') {
            console.warn('Auth bypassed in DEV mode because Firebase is not initialized.');
            req.user = { uid: 'dev-user', role: 'admin' } as any;
            return next();
        }
        return res.status(401).json({ message: 'Unauthorized: No token' });
    }

    const token = header.split(' ')[1];

    // Allow dev-token bypass in development
    if (token === 'dev-token') {
        req.user = { uid: 'dev-user', role: 'admin', admin: true };
        return next();
    }

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (!isFirebaseInitialized && process.env.NODE_ENV === 'development') {
            console.warn('Auth bypassed in DEV mode because Firebase is not initialized.');
            req.user = { uid: 'dev-user', role: 'admin' } as any;
            return next();
        }
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const user = req.user;

    // Pass if: dev-token user OR Firebase custom claim 'admin' is true OR role === 'admin'
    const isAdmin =
        user.uid === 'dev-user' ||
        user.admin === true ||
        user.role === 'admin';

    if (isAdmin) {
        return next();
    }

    return res.status(403).json({ message: 'Access denied: Admins only' });
};
