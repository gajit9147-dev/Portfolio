import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Printer,
  Sparkles,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Plus,
  Trash2,
  RotateCcw,
  Mail,
  MapPin,
  Phone,
  Globe,
  Check,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

// Accent themes for the resume builder
const ACCENT_THEMES = [
  { id: 'cyan', label: 'Cyan Tech', color: '#0ea5e9', border: 'rgba(14,165,233,0.3)', lightBg: '#f0f9ff' },
  { id: 'indigo', label: 'Indigo Pro', color: '#6366f1', border: 'rgba(99,102,241,0.3)', lightBg: '#eef2ff' },
  { id: 'emerald', label: 'Emerald', color: '#10b981', border: 'rgba(16,185,129,0.3)', lightBg: '#ecfdf5' },
  { id: 'slate', label: 'Minimal', color: '#334155', border: 'rgba(51,65,85,0.3)', lightBg: '#f8fafc' },
]

const SAMPLE_BUILDER_DATA = {
  personal: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Full-Stack Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
  },
  summary:
    'Innovative and detail-oriented Full-Stack Engineer with 5+ years of experience designing, developing, and scaling high-performance web applications. Expert in modern React architectures, Node.js microservices, distributed cloud systems, and database optimization.',
  skills: [
    'JavaScript (ES6+)',
    'TypeScript',
    'React.js',
    'Next.js',
    'Node.js',
    'Express',
    'Tailwind CSS',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'AWS (S3, EC2)',
    'GraphQL',
    'REST APIs',
    'Git & CI/CD',
  ],
  experience: [
    {
      id: '1',
      role: 'Senior Software Engineer',
      company: 'Apex Cloud Solutions',
      location: 'San Francisco, CA',
      period: '2023 - Present',
      bullets: [
        'Architected and deployed a multi-tenant SaaS analytics platform handling 2M+ monthly active requests with 99.98% uptime.',
        'Spearheaded frontend migration to Next.js 14 server components, slashing initial page load times by 48%.',
        'Engineered real-time collaboration engine using WebSockets and Redis pub/sub.',
      ],
    },
    {
      id: '2',
      role: 'Full-Stack Developer',
      company: 'NovaTech Digital',
      location: 'Austin, TX',
      period: '2021 - 2023',
      bullets: [
        'Built 15+ high-conversion enterprise client dashboards using React, TypeScript, and Node.js REST APIs.',
        'Optimized PostgreSQL query schemas, reducing database load by 35% during peak traffic spikes.',
        'Mentored 4 junior developers and implemented company-wide code review and automated testing guidelines.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. in Computer Science',
      institution: 'State University of New York',
      year: '2017 - 2021',
      details: 'Magna Cum Laude (GPA 3.85) · Honors Program · Lead of Web Development Club',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'DevPulse — Developer Metrics Suite',
      tech: 'React, Node.js, GraphQL, Docker',
      summary: 'Open-source productivity insights platform tracking automated GitHub PR workflows and CI build latencies.',
    },
    {
      id: '2',
      title: 'CloudVault — End-to-End Encrypted Storage',
      tech: 'TypeScript, Express, MongoDB, AWS S3',
      summary: 'Zero-knowledge personal cloud storage application featuring client-side AES-256 encryption.',
    },
  ],
}

export default function ResumeHub({ onBack }) {
  const [activeTab, setActiveTab] = useState('official') // 'official' | 'builder'
  const [resumePdfPath, setResumePdfPath] = useState('/resume.pdf')
  const [accentTheme, setAccentTheme] = useState('cyan')
  const [copied, setCopied] = useState(false)
  const resumePrintRef = useRef(null)

  // Builder form state
  const [builderData, setBuilderData] = useState(() => {
    const saved = localStorage.getItem('user_custom_resume')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return SAMPLE_BUILDER_DATA
      }
    }
    return SAMPLE_BUILDER_DATA
  })

  // Active accordion section in builder
  const [editorSection, setEditorSection] = useState('personal')

  // Fetch official resume file path
  useEffect(() => {
    fetch('/api/uploads/resume-path')
      .then((res) => res.json())
      .then((data) => {
        if (data?.path) setResumePdfPath(data.path)
      })
      .catch(() => {})
  }, [])

  // Persist builder data changes to localStorage
  useEffect(() => {
    if (activeTab === 'builder') {
      localStorage.setItem('user_custom_resume', JSON.stringify(builderData))
    }
  }, [builderData, activeTab])

  const currentAccent = ACCENT_THEMES.find((t) => t.id === accentTheme) || ACCENT_THEMES[0]

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Builder field handlers
  const updatePersonal = (field, val) => {
    setBuilderData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: val },
    }))
  }

  const updateSummary = (val) => {
    setBuilderData((prev) => ({ ...prev, summary: val }))
  }

  const updateSkillsString = (str) => {
    const arr = str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    setBuilderData((prev) => ({ ...prev, skills: arr }))
  }

  const addExperience = () => {
    setBuilderData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          role: 'Job Title / Role',
          company: 'Company Name',
          location: 'City, Country',
          period: 'Year - Present',
          bullets: ['Key achievement or core responsibility here.'],
        },
      ],
    }))
  }

  const updateExperience = (id, field, val) => {
    setBuilderData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: val } : exp)),
    }))
  }

  const updateExpBullets = (id, text) => {
    const bullets = text.split('\n').filter((l) => l.trim().length > 0)
    setBuilderData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, bullets } : exp)),
    }))
  }

  const deleteExperience = (id) => {
    setBuilderData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const addEducation = () => {
    setBuilderData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          degree: 'Degree or Certification',
          institution: 'University or Organization',
          year: '2020 - 2024',
          details: 'Key coursework or honors',
        },
      ],
    }))
  }

  const updateEducation = (id, field, val) => {
    setBuilderData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: val } : edu)),
    }))
  }

  const deleteEducation = (id) => {
    setBuilderData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const addProject = () => {
    setBuilderData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now().toString(),
          title: 'Project Name',
          tech: 'React, Node.js',
          summary: 'Brief description of project goals and achievements.',
        },
      ],
    }))
  }

  const updateProject = (id, field, val) => {
    setBuilderData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    }))
  }

  const deleteProject = (id) => {
    setBuilderData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }))
  }

  const handleResetBuilder = () => {
    if (window.confirm('Reset resume data to sample template?')) {
      setBuilderData(SAMPLE_BUILDER_DATA)
      localStorage.setItem('user_custom_resume', JSON.stringify(SAMPLE_BUILDER_DATA))
    }
  }

  return (
    <div className="min-h-screen text-slate-100" style={{ background: 'var(--bg-page)' }}>
      {/* ========================================================
          TOP CONTROL NAVIGATION BAR (Hidden during printing)
      ======================================================== */}
      <header
        className="no-print sticky top-0 z-40 backdrop-blur-xl border-b px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'var(--nav-bg)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Left: Back to Portfolio Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: 'var(--bg-btn-ghost)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.color = 'var(--text-1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-2)'
            }}
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </button>
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: 'var(--bg-tag)', color: 'var(--accent)', border: '1px solid var(--border-tag)' }}>
            Resume Hub
          </span>
        </div>

        {/* Center: Mode Switcher Tabs */}
        <div
          className="flex items-center p-1 rounded-xl"
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setActiveTab('official')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'official' ? 'shadow-sm' : ''
            }`}
            style={{
              background: activeTab === 'official' ? 'var(--bg-tag)' : 'transparent',
              color: activeTab === 'official' ? 'var(--accent)' : 'var(--text-4)',
              border: activeTab === 'official' ? '1px solid var(--border-tag)' : '1px solid transparent',
            }}
          >
            <FileText size={14} /> View Ajeet's Resume
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === 'builder' ? 'shadow-sm' : ''
            }`}
            style={{
              background: activeTab === 'builder' ? 'var(--bg-tag)' : 'transparent',
              color: activeTab === 'builder' ? 'var(--accent)' : 'var(--text-4)',
              border: activeTab === 'builder' ? '1px solid var(--border-tag)' : '1px solid transparent',
            }}
          >
            <Sparkles size={14} /> Create Your Own Resume
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {activeTab === 'official' ? (
            <a
              href={resumePdfPath}
              download="Ajeet_Gupta_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: '#080c14',
              }}
            >
              <Download size={14} /> Download PDF
            </a>
          ) : (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: '#080c14',
              }}
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          )}

          <button
            onClick={handleCopyLink}
            title="Copy Page Link"
            className="p-1.5 rounded-lg text-xs transition-colors"
            style={{
              background: 'var(--bg-btn-ghost)',
              border: '1px solid var(--border)',
              color: 'var(--text-4)',
            }}
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Globe size={14} />}
          </button>
        </div>
      </header>

      {/* ========================================================
          MAIN CONTENT CONTAINER
      ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'official' ? (
            /* ========================================================
               OPTION 1: AJEET'S OFFICIAL RESUME (READER MODE)
            ======================================================== */
            <motion.div
              key="official-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {/* Top Banner with Quick Actions */}
              <div
                className="no-print p-4 sm:p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    Ajeet Gupta — Official Resume
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified Full-Stack Developer resume with production experience in React, Node.js, Express, Docker & AWS.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <a
                    href={resumePdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{
                      background: 'var(--bg-tag)',
                      color: 'var(--accent)',
                      border: '1px solid var(--border-tag)',
                    }}
                  >
                    <FileText size={14} /> Open Original PDF
                  </a>
                  <button
                    onClick={handlePrint}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{
                      background: 'var(--bg-btn-ghost)',
                      color: 'var(--text-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Printer size={14} /> Print
                  </button>
                </div>
              </div>

              {/* Printable Official Resume Sheet */}
              <div
                id="resume-printable-sheet"
                className="p-8 sm:p-12 rounded-2xl shadow-2xl transition-all"
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid var(--border)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {/* Header */}
                <div className="border-b pb-6 mb-6" style={{ borderColor: '#e2e8f0' }}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Ajeet Gupta
                      </h2>
                      <p className="text-base font-semibold text-sky-600 mt-0.5">
                        Full-Stack Developer · Node.js · React · Docker · AWS
                      </p>
                    </div>
                  </div>

                  {/* Contact Badges */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs font-medium text-slate-600">
                    <a href="mailto:ajeetgupta80045@gmail.com" className="flex items-center gap-1.5 hover:text-sky-600">
                      <Mail size={13} className="text-sky-600" /> ajeetgupta80045@gmail.com
                    </a>
                    <a href="https://github.com/gajit9147-dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-sky-600">
                      <GithubIcon size={13} className="text-slate-800" /> github.com/gajit9147-dev
                    </a>
                    <a href="https://www.linkedin.com/in/ajeet-gupta-970478273/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-sky-600">
                      <LinkedinIcon size={13} className="text-sky-700" /> linkedin.com/in/ajeet-gupta-970478273
                    </a>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={13} className="text-slate-400" /> India
                    </span>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-7">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700">
                    Results-driven Full-Stack Developer with hands-on expertise building scalable web applications, robust RESTful APIs, and secure database architectures. Proficient in JavaScript (ES6+), React.js, Node.js, Express.js, and SQLite/MongoDB. Experienced in containerizing applications with Docker and deploying cloud infrastructures on AWS (EC2, Nginx). Passionate about writing clean, maintainable code with high performance, accessibility, and security standards.
                  </p>
                </div>

                {/* Technical Skills */}
                <div className="mb-7">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3">
                    Technical Expertise
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800">Languages & Core:</span>
                      <p className="text-slate-600 mt-1">JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL, Python basics</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800">Frontend Development:</span>
                      <p className="text-slate-600 mt-1">React.js, Tailwind CSS, Framer Motion, Responsive UI/UX, Vite</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800">Backend & APIs:</span>
                      <p className="text-slate-600 mt-1">Node.js, Express.js, RESTful APIs, JWT Authentication, Multer, Middleware</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800">Databases & DevOps:</span>
                      <p className="text-slate-600 mt-1">SQLite3, MongoDB, Docker, AWS (EC2, S3), Nginx Reverse Proxy, Git, GitHub</p>
                    </div>
                  </div>
                </div>

                {/* Projects & Work */}
                <div className="mb-7">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-4">
                    Featured Projects
                  </h3>
                  <div className="space-y-4">
                    {/* Project 1 */}
                    <div className="border-l-2 border-sky-500 pl-4">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-sm text-slate-900">
                          InnerVoice — Secure Notes & Personal Storage Platform
                        </span>
                        <span className="text-xs font-medium text-slate-500">React · Node.js · Docker · AWS</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        Full-stack application engineered with end-to-end JWT authentication, bcrypt password hashing, per-note access encryption, and granular REST APIs. Containerized using multi-stage Docker builds and orchestrated behind an Nginx reverse proxy on AWS EC2.
                      </p>
                    </div>

                    {/* Project 2 */}
                    <div className="border-l-2 border-sky-500 pl-4">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-sm text-slate-900">
                          Modular REST API Backend & Auth Architecture
                        </span>
                        <span className="text-xs font-medium text-slate-500">Node.js · Express · JWT · Security</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        Production-ready REST API featuring layered MVC pattern (routes, controllers, database models), sliding-window IP rate limiters, token expiration handling, and structured centralized error-handling middleware.
                      </p>
                    </div>

                    {/* Project 3 */}
                    <div className="border-l-2 border-sky-500 pl-4">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-sm text-slate-900">
                          Interactive Portfolio & Content Management System
                        </span>
                        <span className="text-xs font-medium text-slate-500">React · Vite · Tailwind · SQLite</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        High-performance responsive personal portal scoring 98/100 across Code Quality, Efficiency, and Accessibility. Includes a JWT-authenticated admin dashboard, live file upload pipelines, life moments gallery, and dynamic theme switching.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3">
                    Education
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">Bachelor of Technology (B.Tech) in Computer Science & Engineering</span>
                      <p className="text-slate-600">Core focus on Data Structures, Algorithms, Database Management, and Web Technologies</p>
                    </div>
                    <span className="font-medium text-slate-500">2021 – 2025</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               OPTION 2: INTERACTIVE RESUME BUILDER (CREATOR MODE)
            ======================================================== */
            <motion.div
              key="builder-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-12 gap-8 items-start"
            >
              {/* LEFT COLUMN: BUILDER FORM CONTROLS (Hidden during print) */}
              <div className="no-print lg:col-span-5 space-y-6">
                {/* Builder Header Card */}
                <div
                  className="p-5 rounded-2xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                      Interactive Resume Studio
                    </span>
                    <button
                      onClick={handleResetBuilder}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <RotateCcw size={12} /> Reset Template
                    </button>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">Create Your Custom Resume</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Fill in your details below. The preview updates in real-time. Once satisfied, click <strong>Print / Save PDF</strong>.
                  </p>

                  {/* Accent Color Chooser */}
                  <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[11px] font-medium text-slate-400 mr-1">Style Accent:</span>
                    {ACCENT_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setAccentTheme(theme.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                          accentTheme === theme.id ? 'ring-2 ring-white/40 scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          background: theme.color,
                          color: '#ffffff',
                        }}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Section Navigation Pills */}
                <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  {[
                    { id: 'personal', label: 'Personal', icon: User },
                    { id: 'summary', label: 'Summary', icon: FileText },
                    { id: 'skills', label: 'Skills', icon: Code },
                    { id: 'experience', label: 'Experience', icon: Briefcase },
                    { id: 'education', label: 'Education', icon: GraduationCap },
                    { id: 'projects', label: 'Projects', icon: FolderGit2 },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setEditorSection(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        editorSection === id
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>

                {/* Active Section Form Box */}
                <div
                  className="p-5 rounded-2xl space-y-4"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  {/* 1. Personal Details */}
                  {editorSection === 'personal' && (
                    <div className="space-y-3.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <User size={13} /> Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={builderData.personal.fullName}
                            onChange={(e) => updatePersonal('fullName', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Professional Title</label>
                          <input
                            type="text"
                            value={builderData.personal.jobTitle}
                            onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                            placeholder="Software Engineer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Email</label>
                          <input
                            type="email"
                            value={builderData.personal.email}
                            onChange={(e) => updatePersonal('email', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={builderData.personal.phone}
                            onChange={(e) => updatePersonal('phone', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Location</label>
                          <input
                            type="text"
                            value={builderData.personal.location}
                            onChange={(e) => updatePersonal('location', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">Portfolio / Website</label>
                          <input
                            type="text"
                            value={builderData.personal.website}
                            onChange={(e) => updatePersonal('website', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">GitHub Username / URL</label>
                          <input
                            type="text"
                            value={builderData.personal.github}
                            onChange={(e) => updatePersonal('github', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-400 mb-1">LinkedIn Profile</label>
                          <input
                            type="text"
                            value={builderData.personal.linkedin}
                            onChange={(e) => updatePersonal('linkedin', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Professional Summary */}
                  {editorSection === 'summary' && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <FileText size={13} /> Professional Summary
                      </h3>
                      <textarea
                        rows={6}
                        value={builderData.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none leading-relaxed"
                        placeholder="Write 2-4 sentences highlighting your background, core capabilities, and achievements..."
                      />
                    </div>
                  )}

                  {/* 3. Skills */}
                  {editorSection === 'skills' && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <Code size={13} /> Technical Skills
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Enter skills separated by commas (e.g. React, Node.js, TypeScript, Docker):
                      </p>
                      <textarea
                        rows={4}
                        value={builderData.skills.join(', ')}
                        onChange={(e) => updateSkillsString(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-black/40 border border-slate-700 text-white focus:border-sky-500 outline-none"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {builderData.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Experience */}
                  {editorSection === 'experience' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <Briefcase size={13} /> Work Experience
                        </h3>
                        <button
                          onClick={addExperience}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 text-xs hover:bg-sky-500/30"
                        >
                          <Plus size={12} /> Add Position
                        </button>
                      </div>

                      {builderData.experience.map((exp) => (
                        <div key={exp.id} className="p-3.5 rounded-xl bg-black/30 border border-slate-800 space-y-2.5 relative">
                          <button
                            onClick={() => deleteExperience(exp.id)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400">Role / Title</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400">Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Dates / Period</label>
                              <input
                                type="text"
                                value={exp.period}
                                onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400">Bullet Points (1 per line)</label>
                            <textarea
                              rows={3}
                              value={exp.bullets.join('\n')}
                              onChange={(e) => updateExpBullets(exp.id, e.target.value)}
                              className="w-full px-2 py-1.5 text-xs bg-black/50 border border-slate-700 rounded text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 5. Education */}
                  {editorSection === 'education' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <GraduationCap size={13} /> Education & Credentials
                        </h3>
                        <button
                          onClick={addEducation}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 text-xs hover:bg-sky-500/30"
                        >
                          <Plus size={12} /> Add Degree
                        </button>
                      </div>

                      {builderData.education.map((edu) => (
                        <div key={edu.id} className="p-3.5 rounded-xl bg-black/30 border border-slate-800 space-y-2.5 relative">
                          <button
                            onClick={() => deleteEducation(edu.id)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                          <div>
                            <label className="text-[10px] text-slate-400">Degree / Certification</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400">Institution / University</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Graduation Year</label>
                              <input
                                type="text"
                                value={edu.year}
                                onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400">Honors / Extra Details</label>
                            <input
                              type="text"
                              value={edu.details}
                              onChange={(e) => updateEducation(edu.id, 'details', e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 6. Projects */}
                  {editorSection === 'projects' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                          <FolderGit2 size={13} /> Key Projects
                        </h3>
                        <button
                          onClick={addProject}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 text-xs hover:bg-sky-500/30"
                        >
                          <Plus size={12} /> Add Project
                        </button>
                      </div>

                      {builderData.projects.map((proj) => (
                        <div key={proj.id} className="p-3.5 rounded-xl bg-black/30 border border-slate-800 space-y-2.5 relative">
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 size={13} />
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400">Project Title</label>
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Technologies Used</label>
                              <input
                                type="text"
                                value={proj.tech}
                                onChange={(e) => updateProject(proj.id, 'tech', e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400">Summary / Impact</label>
                            <textarea
                              rows={2}
                              value={proj.summary}
                              onChange={(e) => updateProject(proj.id, 'summary', e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-black/50 border border-slate-700 rounded text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: LIVE REAL-TIME RESUME PREVIEW */}
              <div className="lg:col-span-7 sticky top-24">
                <div className="no-print flex items-center justify-between pb-3 text-xs text-slate-400">
                  <span className="font-medium flex items-center gap-1.5">
                    <Sparkles size={13} className="text-sky-400" /> Live Virtual A4 Sheet Preview
                  </span>
                  <span className="text-[11px] text-slate-500">Auto-saved to your browser</span>
                </div>

                {/* Printable Virtual A4 Document */}
                <div
                  ref={resumePrintRef}
                  id="resume-printable-sheet"
                  className="p-8 sm:p-11 rounded-2xl shadow-2xl transition-all duration-300"
                  style={{
                    background: '#ffffff',
                    color: '#0f172a',
                    fontFamily: 'Inter, sans-serif',
                    minHeight: '800px',
                  }}
                >
                  {/* Document Header */}
                  <div className="border-b pb-5 mb-5" style={{ borderColor: '#e2e8f0' }}>
                    <h2
                      className="text-2xl sm:text-3xl font-black tracking-tight"
                      style={{ color: currentAccent.color }}
                    >
                      {builderData.personal.fullName || 'Your Name'}
                    </h2>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                      {builderData.personal.jobTitle || 'Your Professional Title'}
                    </p>

                    {/* Contact details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[11px] font-medium text-slate-600">
                      {builderData.personal.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={11} style={{ color: currentAccent.color }} /> {builderData.personal.email}
                        </span>
                      )}
                      {builderData.personal.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={11} style={{ color: currentAccent.color }} /> {builderData.personal.phone}
                        </span>
                      )}
                      {builderData.personal.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} style={{ color: currentAccent.color }} /> {builderData.personal.location}
                        </span>
                      )}
                      {builderData.personal.website && (
                        <span className="flex items-center gap-1">
                          <Globe size={11} style={{ color: currentAccent.color }} /> {builderData.personal.website}
                        </span>
                      )}
                      {builderData.personal.github && (
                        <span className="flex items-center gap-1">
                          <GithubIcon size={11} className="text-slate-800" /> {builderData.personal.github}
                        </span>
                      )}
                      {builderData.personal.linkedin && (
                        <span className="flex items-center gap-1">
                          <LinkedinIcon size={11} className="text-slate-800" /> {builderData.personal.linkedin}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {builderData.summary && (
                    <div className="mb-5">
                      <h4
                        className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                        style={{ color: currentAccent.color }}
                      >
                        Summary
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{builderData.summary}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {builderData.skills.length > 0 && (
                    <div className="mb-5">
                      <h4
                        className="text-[11px] font-bold uppercase tracking-wider mb-2"
                        style={{ color: currentAccent.color }}
                      >
                        Skills & Competencies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {builderData.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10.5px] font-medium border"
                            style={{
                              background: currentAccent.lightBg,
                              borderColor: currentAccent.border,
                              color: currentAccent.color,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {builderData.experience.length > 0 && (
                    <div className="mb-5">
                      <h4
                        className="text-[11px] font-bold uppercase tracking-wider mb-2.5"
                        style={{ color: currentAccent.color }}
                      >
                        Experience
                      </h4>
                      <div className="space-y-3.5">
                        {builderData.experience.map((exp) => (
                          <div
                            key={exp.id}
                            className="border-l-2 pl-3"
                            style={{ borderColor: currentAccent.color }}
                          >
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-bold text-slate-900">{exp.role}</span>
                              <span className="text-[11px] text-slate-500 font-medium">{exp.period}</span>
                            </div>
                            <div className="text-[11px] font-semibold text-slate-600 mb-1">
                              {exp.company} {exp.location ? `· ${exp.location}` : ''}
                            </div>
                            {exp.bullets.length > 0 && (
                              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                                {exp.bullets.map((b, bIdx) => (
                                  <li key={bIdx} className="leading-relaxed">
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {builderData.projects.length > 0 && (
                    <div className="mb-5">
                      <h4
                        className="text-[11px] font-bold uppercase tracking-wider mb-2"
                        style={{ color: currentAccent.color }}
                      >
                        Selected Projects
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {builderData.projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="p-2.5 rounded-lg border text-xs"
                            style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}
                          >
                            <div className="font-bold text-slate-900">{proj.title}</div>
                            {proj.tech && (
                              <div className="text-[10px] font-medium text-slate-500 mb-1">{proj.tech}</div>
                            )}
                            <p className="text-[10.5px] text-slate-600 leading-snug">{proj.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {builderData.education.length > 0 && (
                    <div>
                      <h4
                        className="text-[11px] font-bold uppercase tracking-wider mb-2"
                        style={{ color: currentAccent.color }}
                      >
                        Education
                      </h4>
                      <div className="space-y-2">
                        {builderData.education.map((edu) => (
                          <div key={edu.id} className="flex items-baseline justify-between text-xs">
                            <div>
                              <div className="font-bold text-slate-900">{edu.degree}</div>
                              <div className="text-[11px] text-slate-600">
                                {edu.institution} {edu.details ? `— ${edu.details}` : ''}
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
