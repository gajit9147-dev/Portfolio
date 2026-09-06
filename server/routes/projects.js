import express from 'express'
import { dbQuery, dbGet, dbRun } from '../database.js'
import { authMiddleware } from '../authMiddleware.js'

const router = express.Router()

// Helper to deserialize SQLite text fields
function formatProject(project) {
  if (!project) return null
  try {
    return {
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      category: project.category ? JSON.parse(project.category) : [],
      features: project.features ? JSON.parse(project.features) : [],
      techStack: project.techStack ? JSON.parse(project.techStack) : {},
      challenges: project.challenges ? JSON.parse(project.challenges) : []
    }
  } catch (err) {
    console.error('Error formatting project:', err)
    return project
  }
}

// Get all projects (Public)
router.get('/', async (req, res) => {
  try {
    const projects = await dbQuery('SELECT * FROM projects')
    res.json(projects.map(formatProject))
  } catch (err) {
    console.error('Fetch projects error:', err)
    res.status(500).json({ message: 'Error fetching projects' })
  }
})

// Get single project (Public)
router.get('/:id', async (req, res) => {
  try {
    const project = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id])
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json(formatProject(project))
  } catch (err) {
    console.error('Fetch project error:', err)
    res.status(500).json({ message: 'Error fetching project' })
  }
})

// Add new project (Admin)
router.post('/', authMiddleware, async (req, res) => {
  const {
    id, title, subtitle, status, description, longDescription,
    image, tags, github, demo, category, features, techStack, challenges
  } = req.body

  if (!id || !title || !description) {
    return res.status(400).json({ message: 'ID, title, and description are required' })
  }

  try {
    const existing = await dbGet('SELECT id FROM projects WHERE id = ?', [id])
    if (existing) {
      return res.status(400).json({ message: 'A project with this ID already exists' })
    }

    const query = `
      INSERT INTO projects (
        id, title, subtitle, status, description, longDescription,
        image, tags, github, demo, category, features, techStack, challenges
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      id, title, subtitle, status || 'Completed', description, longDescription || '',
      image || null,
      JSON.stringify(tags || []),
      github || '',
      demo || '',
      JSON.stringify(category || []),
      JSON.stringify(features || []),
      JSON.stringify(techStack || {}),
      JSON.stringify(challenges || [])
    ]

    await dbRun(query, params)
    const newProject = await dbGet('SELECT * FROM projects WHERE id = ?', [id])
    res.status(201).json(formatProject(newProject))
  } catch (err) {
    console.error('Create project error:', err)
    res.status(500).json({ message: 'Error creating project' })
  }
})

// Update project (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const projectId = req.params.id
  const {
    title, subtitle, status, description, longDescription,
    image, tags, github, demo, category, features, techStack, challenges
  } = req.body

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' })
  }

  try {
    const existing = await dbGet('SELECT id FROM projects WHERE id = ?', [projectId])
    if (!existing) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const query = `
      UPDATE projects SET
        title = ?, subtitle = ?, status = ?, description = ?, longDescription = ?,
        image = ?, tags = ?, github = ?, demo = ?, category = ?, features = ?,
        techStack = ?, challenges = ?
      WHERE id = ?
    `
    const params = [
      title, subtitle, status, description, longDescription,
      image || null,
      JSON.stringify(tags || []),
      github || '',
      demo || '',
      JSON.stringify(category || []),
      JSON.stringify(features || []),
      JSON.stringify(techStack || {}),
      JSON.stringify(challenges || []),
      projectId
    ]

    await dbRun(query, params)
    const updated = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId])
    res.json(formatProject(updated))
  } catch (err) {
    console.error('Update project error:', err)
    res.status(500).json({ message: 'Error updating project' })
  }
})

// Delete project (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  const projectId = req.params.id
  try {
    const existing = await dbGet('SELECT id FROM projects WHERE id = ?', [projectId])
    if (!existing) {
      return res.status(404).json({ message: 'Project not found' })
    }

    await dbRun('DELETE FROM projects WHERE id = ?', [projectId])
    res.json({ message: 'Project deleted successfully', id: projectId })
  } catch (err) {
    console.error('Delete project error:', err)
    res.status(500).json({ message: 'Error deleting project' })
  }
})

export default router
