import express from 'express'
import cors from 'cors'
import auth from './routes/auth'
import todos from './routes/todos'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', auth)
app.use('/api/todos', todos)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))
export default app
