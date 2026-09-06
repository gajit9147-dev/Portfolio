import express from 'express'
import { dbQuery, dbGet, dbRun } from '../database.js'

const router = express.Router()

// Helper to format moment record from DB
const formatMoment = (row) => {
  if (!row) return null
  let tags = []
  try {
    tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || []
  } catch {
    tags = row.tags ? row.tags.split(',').map(s => s.trim()) : []
  }
  return {
    ...row,
    tags,
  }
}

// GET all moments
router.get('/', async (req, res) => {
  try {
    const rows = await dbQuery('SELECT * FROM moments')
    const moments = rows.map(formatMoment)
    res.json(moments)
  } catch (err) {
    console.error('Fetch moments error:', err)
    res.status(500).json({ message: 'Error fetching moments' })
  }
})

// GET single moment by ID
router.get('/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM moments WHERE id = ?', [req.params.id])
    if (!row) {
      return res.status(400).json({ message: 'Moment not found' })
    }
    res.json(formatMoment(row))
  } catch (err) {
    console.error('Fetch moment error:', err)
    res.status(500).json({ message: 'Error fetching moment' })
  }
})

// POST create new moment
router.post('/', async (req, res) => {
  try {
    const {
      title,
      category = 'Travel',
      type = 'photo',
      date = new Date().getFullYear().toString(),
      location = '',
      description = '',
      image = '',
      videoUrl = '',
      thumbnail = '',
      tags = []
    } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const id = req.body.id || `moment-${Date.now()}`
    const tagsString = typeof tags === 'string' ? JSON.stringify(tags.split(',').map(s => s.trim()).filter(Boolean)) : JSON.stringify(tags)

    await dbRun(
      `INSERT INTO moments (id, title, category, type, date, location, description, image, videoUrl, thumbnail, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, category, type, date, location, description, image, videoUrl, thumbnail, tagsString]
    )

    const created = await dbGet('SELECT * FROM moments WHERE id = ?', [id])
    res.status(201).json(formatMoment(created))
  } catch (err) {
    console.error('Create moment error:', err)
    res.status(500).json({ message: 'Error creating moment' })
  }
})

// PUT update existing moment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const existing = await dbGet('SELECT * FROM moments WHERE id = ?', [id])
    if (!existing) {
      return res.status(404).json({ message: 'Moment not found' })
    }

    const {
      title = existing.title,
      category = existing.category,
      type = existing.type,
      date = existing.date,
      location = existing.location,
      description = existing.description,
      image = existing.image,
      videoUrl = existing.videoUrl,
      thumbnail = existing.thumbnail,
      tags = existing.tags
    } = req.body

    const tagsString = typeof tags === 'string' ? JSON.stringify(tags.split(',').map(s => s.trim()).filter(Boolean)) : JSON.stringify(tags)

    await dbRun(
      `UPDATE moments
       SET title = ?, category = ?, type = ?, date = ?, location = ?, description = ?, image = ?, videoUrl = ?, thumbnail = ?, tags = ?
       WHERE id = ?`,
      [title, category, type, date, location, description, image, videoUrl, thumbnail, tagsString, id]
    )

    const updated = await dbGet('SELECT * FROM moments WHERE id = ?', [id])
    res.json(formatMoment(updated))
  } catch (err) {
    console.error('Update moment error:', err)
    res.status(500).json({ message: 'Error updating moment' })
  }
})

// DELETE moment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const existing = await dbGet('SELECT * FROM moments WHERE id = ?', [id])
    if (!existing) {
      return res.status(404).json({ message: 'Moment not found' })
    }

    await dbRun('DELETE FROM moments WHERE id = ?', [id])
    res.json({ message: 'Moment deleted successfully', id })
  } catch (err) {
    console.error('Delete moment error:', err)
    res.status(500).json({ message: 'Error deleting moment' })
  }
})

export default router
