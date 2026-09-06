import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../portfolio.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err)
  } else {
    console.log('Connected to SQLite database.')
  }
})

// Helper wrappers
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

export async function initDb() {
  // Users table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `)

  // Projects table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      status TEXT,
      description TEXT,
      longDescription TEXT,
      image TEXT,
      tags TEXT,
      github TEXT,
      demo TEXT,
      category TEXT,
      features TEXT,
      techStack TEXT,
      challenges TEXT
    )
  `)

  // Blogs table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      readTime TEXT,
      tags TEXT,
      date TEXT NOT NULL
    )
  `)

  // Messages table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `)

  // Config table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  // Performance Indexes
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date)`)
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date)`)
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_moments_category ON moments(category)`)

  // Seed default admin (username: admin, password: admin123)
  const adminExists = await dbGet('SELECT * FROM users WHERE username = ?', ['admin'])
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await dbRun('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword])
    console.log('Seeded default admin user.')
  }

  // Seed configuration
  const resumeExists = await dbGet('SELECT * FROM config WHERE key = ?', ['resume_path'])
  if (!resumeExists) {
    await dbRun('INSERT INTO config (key, value) VALUES (?, ?)', ['resume_path', '/resume.pdf'])
  }

  // Seed Projects
  const projectCount = await dbGet('SELECT COUNT(*) as count FROM projects')
  if (projectCount.count === 0) {
    const p1 = {
      id: 'innervoice',
      title: 'InnerVoice',
      subtitle: 'Secure Personal Notes & Voice Application',
      status: 'Completed',
      description: 'A full-stack application for secure personal notes with user authentication, JWT-protected APIs, password-protected notes, and cloud deployment via Docker & AWS.',
      longDescription: 'InnerVoice is a full-stack application built to provide a private, secure space for personal notes and voice entries. It implements end-to-end JWT authentication, protected routes, encrypted note access, and a RESTful API architecture — all containerised with Docker and deployed to AWS.',
      image: null,
      tags: JSON.stringify(['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Docker', 'AWS']),
      github: 'https://github.com/ajeetgupta',
      demo: '',
      category: JSON.stringify(['Full Stack', 'Backend']),
      features: JSON.stringify([
        'User registration & login with bcrypt password hashing',
        'JWT-based authentication with refresh token support',
        'Protected API routes with middleware validation',
        'Create, read, update and delete personal notes',
        'Password-protected individual notes',
        'RESTful API with clean endpoint design',
        'MongoDB database with Mongoose ODM',
        'Dockerized application with multi-stage builds',
        'Deployed on AWS EC2 with Nginx reverse proxy'
      ]),
      techStack: JSON.stringify({
        frontend: ['React', 'CSS Modules'],
        backend: ['Node.js', 'Express.js'],
        database: ['MongoDB', 'Mongoose'],
        auth: ['JWT', 'bcrypt'],
        devops: ['Docker', 'AWS EC2', 'Nginx']
      }),
      challenges: JSON.stringify([
        {
          challenge: 'Secure note access control',
          solution: 'Implemented per-note password hashing and middleware-level ownership checks to ensure users can only access their own notes.'
        },
        {
          challenge: 'Containerised deployment',
          solution: 'Used multi-stage Docker builds to keep the image lean, then orchestrated the app behind an Nginx reverse proxy on AWS EC2.'
        }
      ])
    }

    const p2 = {
      id: 'rest-api-backend',
      title: 'REST API Backend',
      subtitle: 'Modular Node.js API with Auth & Role-Based Access',
      status: 'Completed',
      description: 'A production-ready REST API built with Node.js and Express.js, featuring JWT authentication, role-based access control, input validation, and MongoDB integration.',
      longDescription: 'A clean, modular RESTful API server demonstrating backend engineering best practices — layered architecture, JWT auth, role-based permissions, request validation, and error handling middleware.',
      image: null,
      tags: JSON.stringify(['Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST API']),
      github: 'https://github.com/ajeetgupta',
      demo: '',
      category: JSON.stringify(['Backend']),
      features: JSON.stringify([
        'JWT authentication with access & refresh tokens',
        'Role-based access control (admin / user)',
        'Input validation with express-validator',
        'Structured error handling middleware',
        'Clean layered architecture (routes → controllers → services)',
        'MongoDB with Mongoose schemas',
        'Postman-tested API endpoints'
      ]),
      techStack: JSON.stringify({
        backend: ['Node.js', 'Express.js'],
        database: ['MongoDB', 'Mongoose'],
        auth: ['JWT', 'bcrypt'],
        tools: ['Postman', 'Git']
      }),
      challenges: JSON.stringify([
        {
          challenge: 'Consistent error responses',
          solution: 'Built a centralised error-handling middleware that normalises all errors into a consistent JSON response format.'
        }
      ])
    }

    const p3 = {
      id: 'cloud-deployment',
      title: 'Cloud Deployment Pipeline',
      subtitle: 'Docker + AWS Deployment with Nginx',
      status: 'Completed',
      description: 'End-to-end deployment workflow for a Node.js application using Docker containers, AWS EC2, and Nginx as a reverse proxy with SSL configuration.',
      longDescription: 'Demonstrates a real-world deployment pipeline: containerising a Node.js app with Docker, pushing the image, provisioning an AWS EC2 instance, configuring Nginx as a reverse proxy, and securing the endpoint. Built to understand the full journey from code to production.',
      image: null,
      tags: JSON.stringify(['Docker', 'AWS', 'Nginx', 'Linux', 'Node.js', 'Git']),
      github: 'https://github.com/ajeetgupta',
      demo: '',
      category: JSON.stringify(['Cloud', 'Backend']),
      features: JSON.stringify([
        'Dockerised application with Dockerfile',
        'AWS EC2 provisioning and configuration',
        'Nginx reverse proxy setup',
        'SSL/HTTPS with Let\'s Encrypt',
        'Linux server administration',
        'Environment variable management',
        'Git-based deployment workflow'
      ]),
      techStack: JSON.stringify({
        devops: ['Docker', 'AWS EC2', 'Nginx'],
        os: ['Linux (Ubuntu)'],
        tools: ['Git', 'SSH', "Let's Encrypt"]
      }),
      challenges: JSON.stringify([
        {
          challenge: 'Nginx proxy configuration',
          solution: 'Configured Nginx to forward traffic from port 80/443 to the Node.js app, with proper headers and WebSocket support.'
        }
      ])
    }

    const stmt = 'INSERT INTO projects (id, title, subtitle, status, description, longDescription, image, tags, github, demo, category, features, techStack, challenges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    
    await dbRun(stmt, [p1.id, p1.title, p1.subtitle, p1.status, p1.description, p1.longDescription, p1.image, p1.tags, p1.github, p1.demo, p1.category, p1.features, p1.techStack, p1.challenges])
    await dbRun(stmt, [p2.id, p2.title, p2.subtitle, p2.status, p2.description, p2.longDescription, p2.image, p2.tags, p2.github, p2.demo, p2.category, p2.features, p2.techStack, p2.challenges])
    await dbRun(stmt, [p3.id, p3.title, p3.subtitle, p3.status, p3.description, p3.longDescription, p3.image, p3.tags, p3.github, p3.demo, p3.category, p3.features, p3.techStack, p3.challenges])
    
    console.log('Seeded projects.')
  }

  // Seed Blogs
  const blogCount = await dbGet('SELECT COUNT(*) as count FROM blogs')
  if (blogCount.count === 0) {
    const b1 = {
      id: 'jwt-auth-guide',
      title: 'Building Secure JWT Authentication in Node.js',
      content: `# Building Secure JWT Authentication in Node.js

Authentication is a critical component of modern web security. JSON Web Tokens (JWT) provide a stateless mechanism for secure communication between client and server.

## What is a JWT?
A JSON Web Token consists of three parts separated by dots:
1. **Header:** Details about the token type and algorithm.
2. **Payload:** The claims or session data (e.g. userId, permissions).
3. **Signature:** The hash of the header, payload, and a server-side private key.

## Implementation Best Practices
When using JWTs, keep these security guidelines in mind:
- **Never store sensitive data in payload:** Anyone can base64 decode a token to view its claims.
- **Set short expiration times:** Use short-lived access tokens (e.g. 15 minutes) and longer-lived refresh tokens stored securely in HttpOnly cookies.
- **Use secure secrets:** Maintain keys in server environment variables and rotate them periodically.

Below is a quick middleware check example:
\`\`\`javascript
import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' })
  }
}
\`\`\`
`,
      image: null,
      readTime: '5 min read',
      tags: JSON.stringify(['Security', 'Backend', 'Node.js']),
      date: 'Aug 24, 2026'
    }

    const b2 = {
      id: 'express-redis-caching',
      title: 'Scaling Express Applications with Redis Caching',
      content: `# Scaling Express Applications with Redis Caching

Database queries and expensive computations can slow down response times for your APIs. Implementing a caching layer is one of the most effective ways to optimize performance.

## Why Redis?
Redis is an in-memory key-value data store that boasts sub-millisecond retrieval times. By caching query responses, you minimize queries on disk databases like PostgreSQL or MongoDB.

## Caching Strategy
1. **Cache Hit:** If the requested key exists in Redis, return the cached data immediately.
2. **Cache Miss:** If the key is not in Redis, fetch from the database, store in Redis with a Time To Live (TTL), and return the fresh data.

\`\`\`javascript
import express from 'express'
import { createClient } from 'redis'

const app = express()
const redisClient = createClient()
await redisClient.connect()

app.get('/api/data', async (req, res) => {
  const cacheKey = 'api-data'
  const cachedData = await redisClient.get(cacheKey)

  if (cachedData) {
    return res.json(JSON.parse(cachedData))
  }

  const freshData = await fetchFromDB()
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(freshData))
  res.json(freshData)
})
\`\`\`
`,
      image: null,
      readTime: '6 min read',
      tags: JSON.stringify(['Performance', 'Backend', 'Redis']),
      date: 'Aug 18, 2026'
    }

    const stmt = 'INSERT INTO blogs (id, title, content, image, readTime, tags, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    await dbRun(stmt, [b1.id, b1.title, b1.content, b1.image, b1.readTime, b1.tags, b1.date])
    await dbRun(stmt, [b2.id, b2.title, b2.content, b2.image, b2.readTime, b2.tags, b2.date])

    console.log('Seeded blogs.')
  }

  // Moments table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS moments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT,
      location TEXT,
      description TEXT,
      image TEXT,
      videoUrl TEXT,
      thumbnail TEXT,
      tags TEXT
    )
  `)

  // Seed Moments
  const momentsCount = await dbGet('SELECT COUNT(*) as count FROM moments')
  if (momentsCount.count === 0) {
    const defaultMoments = [
      {
        id: 'travel-mountains',
        title: 'Himalayan Trek & Mountain Escapes',
        category: 'Travel',
        type: 'photo',
        date: '2025',
        location: 'Himachal Pradesh, India',
        description: 'Taking a break from the terminal to recharge among snow-capped peaks and quiet mountain trails.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        thumbnail: '',
        tags: JSON.stringify(['Mountains', 'Trekking', 'Travel']),
      },
      {
        id: 'hackathon-night',
        title: 'Hackathon Sprint: 24 Hours of Code',
        category: 'Tech & Hackathons',
        type: 'photo',
        date: '2025',
        location: 'Tech Hub Arena',
        description: 'Brainstorming, prototyping, and shipping a working full-stack MVP alongside amazing developers under intense pressure.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        thumbnail: '',
        tags: JSON.stringify(['Hackathon', 'Coding', 'Teamwork']),
      },
      {
        id: 'demo-walkthrough',
        title: 'Full-Stack Architecture & Cloud Walkthrough',
        category: 'Videos',
        type: 'video',
        date: '2025',
        location: 'Remote Studio',
        description: 'A quick breakdown of RESTful API architecture, JWT authentication flow, and Docker container deployment.',
        image: '',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['Architecture', 'Docker', 'Demo Video']),
      },
      {
        id: 'beach-sunset',
        title: 'Coastal Sunset & Beach Trails',
        category: 'Travel',
        type: 'photo',
        date: '2025',
        location: 'Goa Coastline, India',
        description: 'Golden hour by the Arabian Sea. The best way to unwind after finishing a major deployment milestone.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        thumbnail: '',
        tags: JSON.stringify(['Beach', 'Sunset', 'Travel']),
      },
      {
        id: 'campus-activity',
        title: 'Tech Meetup & Developer Discussions',
        category: 'Activities',
        type: 'photo',
        date: '2025',
        location: 'City Tech Meetup',
        description: 'Discussing modern web engineering trends, microservices, and developer toolkits with local tech enthusiasts.',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        thumbnail: '',
        tags: JSON.stringify(['Community', 'Meetup', 'Networking']),
      },
      {
        id: 'roadtrip-drive',
        title: 'Highway Road Trip & Scenic Drives',
        category: 'Travel',
        type: 'video',
        date: '2025',
        location: 'Western Ghats',
        description: 'Monsoon drive through lush green mountain passes and misty valleys.',
        image: '',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80',
        tags: JSON.stringify(['RoadTrip', 'Nature', 'Travel Video']),
      },
    ]

    for (const m of defaultMoments) {
      await dbRun(
        `INSERT INTO moments (id, title, category, type, date, location, description, image, videoUrl, thumbnail, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [m.id, m.title, m.category, m.type, m.date, m.location, m.description, m.image, m.videoUrl, m.thumbnail, m.tags]
      )
    }
    console.log('Seeded default moments into database.')
  }
}
