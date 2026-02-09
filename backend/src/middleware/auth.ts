import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function requireAuth(
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'no token' });
  }

  const token = authHeader.replace(/^Bearer\s+/, '');

  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (error) {
    res.status(401).json({ error: 'invalid token' });
  }
}
