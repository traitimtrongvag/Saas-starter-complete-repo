import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'
export function requireAuth(req: Request & { userId?: string }, res: Response, next: NextFunction){
  const h = req.headers.authorization
  if (!h) return res.status(401).json({ error: 'no token' })
  const token = h.replace(/^Bearer\s+/, '')
  try{
    const p: any = jwt.verify(token, JWT_SECRET)
    req.userId = p.sub
    next()
  }catch(e){ res.status(401).json({ error: 'invalid token' }) }
}
