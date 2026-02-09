import { Router } from 'express';
import prisma from '../services/prismaClient';
import { requireAuth } from '../middleware/auth';

const router = Router();
const MAX_TODOS_PER_REQUEST = 100;

router.get('/', requireAuth, async (req: any, res) => {
  const todos = await prisma.todo.findMany({
    where: { ownerId: req.userId },
    take: MAX_TODOS_PER_REQUEST
  });

  res.json(todos);
});

router.post('/', requireAuth, async (req: any, res) => {
  const { title, body } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title required' });
  }

  const todo = await prisma.todo.create({
    data: { title, body, ownerId: req.userId }
  });

  res.status(201).json(todo);
});

router.patch('/:id/toggle', requireAuth, async (req: any, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo || todo.ownerId !== req.userId) {
    return res.status(404).json({ error: 'not found' });
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { done: !todo.done }
  });

  res.json(updatedTodo);
});

export default router;
