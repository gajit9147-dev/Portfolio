import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { initDb } from './database.js'

// Import routes
import authRouter from './routes/auth.js'
import projectsRouter from './routes/projects.js'
import blogsRouter from './routes/blogs.js'
import contactRouter from './routes/contact.js'
import uploadsRouter from './routes/uploads.js'
import momentsRouter from './routes/moments.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

// Initialize Database
initDb()
  .then(() => console.log('Database initialized successfully.'))
  .catch(err => console.error('Database initialization failed:', err))

// Middleware
app.use(cors())
app.use(express.json())

// Serve uploaded files statically
const uploadsPath = path.join(__dirname, 'uploads')
app.use('/uploads', express.static(uploadsPath))

// Route mappings
app.use('/api/auth', authRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/uploads', uploadsRouter)
app.use('/api/moments', momentsRouter)

// Error handler middleware
app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err.stack)
  res.status(500).json({ message: err.message || 'Something went wrong on the server' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
