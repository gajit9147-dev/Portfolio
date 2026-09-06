import express from 'express'
import { dbQuery, dbGet, dbRun } from '../database.js'
import { authMiddleware } from '../authMiddleware.js'

const router = express.Router()

// Helper to deserialize SQLite text fields
function formatBlog(blog) {
  if (!blog) return null
  try {
    return {
      ...blog,
      tags: blog.tags ? JSON.parse(blog.tags) : []
    }
  } catch (err) {
    console.error('Error formatting blog:', err)
    return blog
  }
}

// Get all blogs (Public)
router.get('/', async (req, res) => {
  try {
    const blogs = await dbQuery('SELECT * FROM blogs ORDER BY date DESC')
    res.json(blogs.map(formatBlog))
  } catch (err) {
    console.error('Fetch blogs error:', err)
    res.status(500).json({ message: 'Error fetching blog posts' })
  }
})

// Get single blog (Public)
router.get('/:id', async (req, res) => {
  try {
    const blog = await dbGet('SELECT * FROM blogs WHERE id = ?', [req.params.id])
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' })
    }
    res.json(formatBlog(blog))
  } catch (err) {
    console.error('Fetch blog error:', err)
    res.status(500).json({ message: 'Error fetching blog post' })
  }
})

// Add new blog (Admin)
router.post('/', authMiddleware, async (req, res) => {
  const { id, title, content, image, readTime, tags } = req.body

  if (!id || !title || !content) {
    return res.status(400).json({ message: 'ID, title, and content are required' })
  }

  try {
    const existing = await dbGet('SELECT id FROM blogs WHERE id = ?', [id])
    if (existing) {
      return res.status(400).json({ message: 'A blog post with this ID already exists' })
    }

    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    const query = `
      INSERT INTO blogs (id, title, content, image, readTime, tags, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      id, title, content, image || null,
      readTime || '3 min read',
      JSON.stringify(tags || []),
      today
    ]

    await dbRun(query, params)
    const newBlog = await dbGet('SELECT * FROM blogs WHERE id = ?', [id])
    res.status(201).json(formatBlog(newBlog))
  } catch (err) {
    console.error('Create blog error:', err)
    res.status(500).json({ message: 'Error creating blog post' })
  }
})

// Update blog (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const blogId = req.params.id
  const { title, content, image, readTime, tags } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' })
  }

  try {
    const existing = await dbGet('SELECT id FROM blogs WHERE id = ?', [blogId])
    if (!existing) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    const query = `
      UPDATE blogs SET
        title = ?, content = ?, image = ?, readTime = ?, tags = ?
      WHERE id = ?
    `
    const params = [
      title, content, image || null,
      readTime || '3 min read',
      JSON.stringify(tags || []),
      blogId
    ]

    await dbRun(query, params)
    const updated = await dbGet('SELECT * FROM blogs WHERE id = ?', [blogId])
    res.json(formatBlog(updated))
  } catch (err) {
    console.error('Update blog error:', err)
    res.status(500).json({ message: 'Error updating blog post' })
  }
})

// Delete blog (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  const blogId = req.params.id
  try {
    const existing = await dbGet('SELECT id FROM blogs WHERE id = ?', [blogId])
    if (!existing) {
      return res.status(404).json({ message: 'Blog post not found' })
    }

    await dbRun('DELETE FROM blogs WHERE id = ?', [blogId])
    res.json({ message: 'Blog post deleted successfully', id: blogId })
  } catch (err) {
    console.error('Delete blog error:', err)
    res.status(500).json({ message: 'Error deleting blog post' })
  }
})

export default router
