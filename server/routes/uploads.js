import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { authMiddleware } from '../authMiddleware.js'
import { dbRun, dbGet } from '../database.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = express.Router()

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, 'resume.pdf')
    } else {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  }
})

const ALLOWED_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'])
const ALLOWED_MEDIA_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.mp4', '.webm', '.mov'])

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()

    if (file.fieldname === 'resume') {
      if (file.mimetype === 'application/pdf' && ext === '.pdf') {
        cb(null, true)
      } else {
        cb(new Error('Only PDF files are allowed for resume!'), false)
      }
    } else if (file.fieldname === 'avatar' || file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/') && ALLOWED_IMAGE_EXTS.has(ext)) {
        cb(null, true)
      } else {
        cb(new Error('Only valid image files (JPG, PNG, WEBP, SVG, GIF) are allowed!'), false)
      }
    } else {
      if ((file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) && ALLOWED_MEDIA_EXTS.has(ext)) {
        cb(null, true)
      } else {
        cb(new Error('Only safe image and video files are allowed!'), false)
      }
    }
  }
})

// Upload media file (photo or video)
router.post('/media', upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  const fileUrl = `/uploads/${req.file.filename}`
  const isVideo = req.file.mimetype.startsWith('video/')
  res.json({
    message: 'Media uploaded successfully',
    url: fileUrl,
    type: isVideo ? 'video' : 'photo',
    filename: req.file.filename
  })
})

// Upload project/blog image (Admin Only)
router.post('/image', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  const fileUrl = `/uploads/${req.file.filename}`
  res.json({ message: 'Image uploaded successfully', url: fileUrl })
})

// Upload resume PDF (Admin Only)
router.post('/resume', authMiddleware, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  const fileUrl = `/uploads/${req.file.filename}`
  
  try {
    await dbRun('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', ['resume_path', fileUrl])
    res.json({ message: 'Resume uploaded successfully', url: fileUrl })
  } catch (err) {
    console.error('Save resume path error:', err)
    res.status(500).json({ message: 'Error updating resume path in database' })
  }
})

// Get current resume path (Public)
router.get('/resume-path', async (req, res) => {
  try {
    const row = await dbGet('SELECT value FROM config WHERE key = ?', ['resume_path'])
    res.json({ path: row ? row.value : '/resume.pdf' })
  } catch {
    res.json({ path: '/resume.pdf' })
  }
})

// Get current avatar photo (Public)
router.get('/avatar', async (req, res) => {
  try {
    const row = await dbGet('SELECT value FROM config WHERE key = ?', ['avatar_url'])
    res.json({ avatar: row && row.value ? row.value : null })
  } catch {
    res.json({ avatar: null })
  }
})

// Save/Update avatar photo URL
router.post('/avatar', async (req, res) => {
  try {
    const { avatar } = req.body
    await dbRun('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', ['avatar_url', avatar || ''])
    res.json({ message: 'Avatar updated successfully', avatar: avatar || null })
  } catch (err) {
    console.error('Save avatar error:', err)
    res.status(500).json({ message: 'Error saving avatar' })
  }
})

// Upload avatar file directly
router.post('/avatar-upload', upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  const fileUrl = `/uploads/${req.file.filename}`
  try {
    await dbRun('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', ['avatar_url', fileUrl])
    res.json({ message: 'Avatar uploaded and saved successfully', avatar: fileUrl })
  } catch (err) {
    console.error('Save avatar error:', err)
    res.status(500).json({ message: 'Error updating avatar in database' })
  }
})

export default router
