import express from 'express'
import { dbQuery, dbRun, dbGet } from '../database.js'
import { authMiddleware } from '../authMiddleware.js'
import { createRateLimiter } from '../rateLimiter.js'

const router = express.Router()

// Rate limiter: Max 5 contact messages per 10 minutes per IP
const contactLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many messages sent. Please wait a few minutes before sending another message.'
})

// Save contact message (Public with rate limit)
router.post('/', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Length bounds
  if (name.trim().length > 100) {
    return res.status(400).json({ message: 'Name cannot exceed 100 characters' })
  }
  if (email.trim().length > 150) {
    return res.status(400).json({ message: 'Email cannot exceed 150 characters' })
  }
  if (message.trim().length > 3000) {
    return res.status(400).json({ message: 'Message cannot exceed 3000 characters' })
  }

  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' })
  }

  if (message.length < 10) {
    return res.status(400).json({ message: 'Message must be at least 10 characters long' })
  }

  try {
    const today = new Date().toISOString()
    const query = 'INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)'
    const result = await dbRun(query, [name, email, message, today])
    res.status(201).json({ message: 'Message sent successfully', id: result.id })
  } catch (err) {
    console.error('Save message error:', err)
    res.status(500).json({ message: 'Error processing your message' })
  }
})

// Get all messages (Admin Only)
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await dbQuery('SELECT * FROM messages ORDER BY date DESC')
    res.json(messages)
  } catch (err) {
    console.error('Fetch messages error:', err)
    res.status(500).json({ message: 'Error fetching messages' })
  }
})

// Delete contact message (Admin Only)
router.delete('/messages/:id', authMiddleware, async (req, res) => {
  const messageId = req.params.id
  try {
    const existing = await dbGet('SELECT id FROM messages WHERE id = ?', [messageId])
    if (!existing) {
      return res.status(404).json({ message: 'Message not found' })
    }

    await dbRun('DELETE FROM messages WHERE id = ?', [messageId])
    res.json({ message: 'Message deleted successfully', id: messageId })
  } catch (err) {
    console.error('Delete message error:', err)
    res.status(500).json({ message: 'Error deleting message' })
  }
})

export default router
