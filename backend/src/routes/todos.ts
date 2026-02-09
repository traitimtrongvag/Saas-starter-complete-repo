import { Router, Response } from 'express';
import prisma from '../services/prismaClient';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const MAX_TODOS_PER_REQUEST = 100;

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const todos = await prisma.todo.findMany({
      where: { ownerId: req.userId },
      take: MAX_TODOS_PER_REQUEST
    });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch todos' });
  }
});

router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, body } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title required' });
    }

    if (!req.userId) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const todo = await prisma.todo.create({
      data: { title, body, ownerId: req.userId }
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'failed to create todo' });
  }
});

router.patch('/:id/toggle', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    if (!req.userId) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.ownerId !== req.userId) {
      return res.status(404).json({ error: 'not found' });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { done: !todo.done }
    });

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'failed to toggle todo' });
  }
});

export default router;
