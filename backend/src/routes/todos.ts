import { Router } from 'express'
import prisma from '../services/prismaClient'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', requireAuth, async (req: any, res) => {
  const items = await prisma.todo.findMany({ where: { ownerId: req.userId }, take: 100 })
  res.json(items)
})

router.post('/', requireAuth, async (req: any, res) => {
  const { title, body } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const todo = await prisma.todo.create({ data: { title, body, ownerId: req.userId } })
  res.status(201).json(todo)
})

router.patch('/:id/toggle', requireAuth, async (req: any, res) => {
  const { id } = req.params
  const t = await prisma.todo.findUnique({ where: { id } })
  if (!t || t.ownerId !== req.userId) return res.status(404).json({ error: 'not found' })
  const updated = await prisma.todo.update({ where: { id }, data: { done: !t.done } })
  res.json(updated)
})

export default router
