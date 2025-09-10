import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // attach admin info to req
    (req as any).admin = { id: payload.adminId, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
