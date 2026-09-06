// Project data — edit this file to add/modify projects
export const featuredProjects = [
  {
    id: 'innervoice',
    title: 'InnerVoice',
    subtitle: 'Secure Personal Notes & Voice Application',
    status: 'Completed',
    description:
      'A full-stack application for secure personal notes with user authentication, JWT-protected APIs, password-protected notes, and cloud deployment via Docker & AWS.',
    longDescription:
      'InnerVoice is a full-stack application built to provide a private, secure space for personal notes and voice entries. It implements end-to-end JWT authentication, protected routes, encrypted note access, and a RESTful API architecture — all containerised with Docker and deployed to AWS.',
    image: null, // Replace with actual screenshot path when available
    tags: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Docker', 'AWS'],
    github: 'https://github.com/gajit9147-dev',
    demo: null, // Replace with actual demo URL when deployed
    category: ['Full Stack', 'Backend'],
    features: [
      'User registration & login with bcrypt password hashing',
      'JWT-based authentication with refresh token support',
      'Protected API routes with middleware validation',
      'Create, read, update and delete personal notes',
      'Password-protected individual notes',
      'RESTful API with clean endpoint design',
      'MongoDB database with Mongoose ODM',
      'Dockerized application with multi-stage builds',
      'Deployed on AWS EC2 with Nginx reverse proxy',
    ],
    techStack: {
      frontend: ['React', 'CSS Modules'],
      backend: ['Node.js', 'Express.js'],
      database: ['MongoDB', 'Mongoose'],
      auth: ['JWT', 'bcrypt'],
      devops: ['Docker', 'AWS EC2', 'Nginx'],
    },
    challenges: [
      {
        challenge: 'Secure note access control',
        solution:
          'Implemented per-note password hashing and middleware-level ownership checks to ensure users can only access their own notes.',
      },
      {
        challenge: 'Containerised deployment',
        solution:
          'Used multi-stage Docker builds to keep the image lean, then orchestrated the app behind an Nginx reverse proxy on AWS EC2.',
      },
    ],
  },
  {
    id: 'rest-api-backend',
    title: 'REST API Backend',
    subtitle: 'Modular Node.js API with Auth & Role-Based Access',
    status: 'Completed',
    description:
      'A production-ready REST API built with Node.js and Express.js, featuring JWT authentication, role-based access control, input validation, and MongoDB integration.',
    longDescription:
      'A clean, modular RESTful API server demonstrating backend engineering best practices — layered architecture, JWT auth, role-based permissions, request validation, and error handling middleware.',
    image: null,
    tags: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST API'],
    github: 'https://github.com/gajit9147-dev',
    demo: null,
    category: ['Backend'],
    features: [
      'JWT authentication with access & refresh tokens',
      'Role-based access control (admin / user)',
      'Input validation with express-validator',
      'Structured error handling middleware',
      'Clean layered architecture (routes → controllers → services)',
      'MongoDB with Mongoose schemas',
      'Postman-tested API endpoints',
    ],
    techStack: {
      backend: ['Node.js', 'Express.js'],
      database: ['MongoDB', 'Mongoose'],
      auth: ['JWT', 'bcrypt'],
      tools: ['Postman', 'Git'],
    },
    challenges: [
      {
        challenge: 'Consistent error responses',
        solution:
          'Built a centralised error-handling middleware that normalises all errors into a consistent JSON response format.',
      },
    ],
  },
  {
    id: 'cloud-deployment',
    title: 'Cloud Deployment Pipeline',
    subtitle: 'Docker + AWS Deployment with Nginx',
    status: 'Completed',
    description:
      'End-to-end deployment workflow for a Node.js application using Docker containers, AWS EC2, and Nginx as a reverse proxy with SSL configuration.',
    longDescription:
      'Demonstrates a real-world deployment pipeline: containerising a Node.js app with Docker, pushing the image, provisioning an AWS EC2 instance, configuring Nginx as a reverse proxy, and securing the endpoint. Built to understand the full journey from code to production.',
    image: null,
    tags: ['Docker', 'AWS', 'Nginx', 'Linux', 'Node.js', 'Git'],
    github: 'https://github.com/gajit9147-dev',
    demo: null,
    category: ['Cloud', 'Backend'],
    features: [
      'Dockerised application with Dockerfile',
      'AWS EC2 provisioning and configuration',
      'Nginx reverse proxy setup',
      'SSL/HTTPS with Let\'s Encrypt',
      'Linux server administration',
      'Environment variable management',
      'Git-based deployment workflow',
    ],
    techStack: {
      devops: ['Docker', 'AWS EC2', 'Nginx'],
      os: ['Linux (Ubuntu)'],
      tools: ['Git', 'SSH', "Let's Encrypt"],
    },
    challenges: [
      {
        challenge: 'Nginx proxy configuration',
        solution:
          'Configured Nginx to forward traffic from port 80/443 to the Node.js app, with proper headers and WebSocket support.',
      },
    ],
  },
]

export const allProjects = [...featuredProjects]
