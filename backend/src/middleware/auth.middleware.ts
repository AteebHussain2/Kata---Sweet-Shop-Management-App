
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET not defined');
        }
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
