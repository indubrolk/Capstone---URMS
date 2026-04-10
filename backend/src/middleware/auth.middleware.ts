import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase.config';

export interface AuthRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization as string;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token' });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    if (req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
};
