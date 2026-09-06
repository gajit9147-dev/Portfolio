import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { dbGet } from '../database.js'
import { authMiddleware } from '../authMiddleware.js'
import { createRateLimiter } from '../rateLimiter.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123'

if (!process.env.JWT_SECRET) {
  console.warn('[SECURITY WARNING]: JWT_SECRET is not defined in .env. Using fallback for local development.')
}

// Rate limiter: Max 10 login attempts per 15 minutes
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again after 15 minutes.'
})

// Login endpoint
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username])
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// Token verification check
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user })
})

export default router
