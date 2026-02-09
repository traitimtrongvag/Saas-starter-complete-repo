import { Router } from 'express'
import prisma from '../services/prismaClient'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hashed, name } })
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
  res.status(201).json({ token })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email and password required' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) return res.status(401).json({ error: 'invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'invalid credentials' })
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

export default router
