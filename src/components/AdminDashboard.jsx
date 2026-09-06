import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, User, LogOut, MessageSquare, Briefcase, BookOpen,
  Upload, Trash2, Plus, Edit, X, CheckCircle, AlertCircle, Save, FileText, ArrowLeft, Eye, EyeOff
} from 'lucide-react'

// Tabs enum
const TABS = {
  INQUIRIES: 'inquiries',
  PROJECTS: 'projects',
  BLOGS: 'blogs',
  RESUME: 'resume'
}

export default function AdminDashboard({ onBack }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState(TABS.INQUIRIES)
  const [messages, setMessages] = useState([])
  const [projects, setProjects] = useState([])
  const [blogs, setBlogs] = useState([])
  const [resumePath, setResumePath] = useState('/resume.pdf')
  
  // Alert/Notification State
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

  // Modal / Form state
  const [editingProject, setEditingProject] = useState(null) // null, 'new', or project object
  const [editingBlog, setEditingBlog] = useState(null) // null, 'new', or blog object
  const [uploadingResume, setUploadingResume] = useState(false)

  const triggerAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000)
  }

  // Handle Admin Authentication Check
  useEffect(() => {
    if (token) {
      verifyToken()
    }
  }, [token])

  // Fetch data on login/tab switch
  useEffect(() => {
    if (token) {
      if (activeTab === TABS.INQUIRIES) fetchMessages()
      if (activeTab === TABS.PROJECTS) fetchProjects()
      if (activeTab === TABS.BLOGS) fetchBlogs()
      fetchResumePath()
    }
  }, [token, activeTab])

  const verifyToken = async () => {
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Token invalid')
    } catch {
      handleLogout()
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
      triggerAlert('Welcome back, Admin!')
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setToken('')
    setUsername('')
    setPassword('')
    triggerAlert('Logged out successfully', 'info')
  }

  // API Call Helpers
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch messages')
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    try {
      const res = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete message')
      setMessages(prev => prev.filter(m => m.id !== id))
      triggerAlert('Message deleted successfully')
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (!res.ok) throw new Error('Failed to fetch blogs')
      const data = await res.json()
      setBlogs(data)
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  const fetchResumePath = async () => {
    try {
      const res = await fetch('/api/uploads/resume-path')
      const data = await res.json()
      setResumePath(data.path)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete project')
      setProjects(prev => prev.filter(p => p.id !== id))
      triggerAlert('Project deleted successfully')
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete blog post')
      setBlogs(prev => prev.filter(b => b.id !== id))
      triggerAlert('Blog post deleted successfully')
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  // Handle file uploads inside form
  const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('/api/uploads/image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Image upload failed')
      return data.url
    } catch (err) {
      triggerAlert(err.message, 'error')
      return null
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      triggerAlert('Only PDF files are allowed', 'error')
      return
    }

    setUploadingResume(true)
    const formData = new FormData()
    formData.append('resume', file)

    try {
      const res = await fetch('/api/uploads/resume', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Resume upload failed')
      setResumePath(data.url)
      triggerAlert('Resume PDF updated successfully!')
    } catch (err) {
      triggerAlert(err.message, 'error')
    } finally {
      setUploadingResume(false)
    }
  }

  // Project Editor Form Submission
  const saveProject = async (e, form) => {
    e.preventDefault()
    const method = editingProject === 'new' ? 'POST' : 'PUT'
    const url = editingProject === 'new' ? '/api/projects' : `/api/projects/${editingProject.id}`

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save project')

      if (editingProject === 'new') {
        setProjects(prev => [...prev, data])
      } else {
        setProjects(prev => prev.map(p => p.id === data.id ? data : p))
      }

      setEditingProject(null)
      triggerAlert('Project saved successfully!')
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  // Blog Editor Form Submission
  const saveBlog = async (e, form) => {
    e.preventDefault()
    const method = editingBlog === 'new' ? 'POST' : 'PUT'
    const url = editingBlog === 'new' ? '/api/blogs' : `/api/blogs/${editingBlog.id}`

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save blog')

      if (editingBlog === 'new') {
        setBlogs(prev => [data, ...prev])
      } else {
        setBlogs(prev => prev.map(b => b.id === data.id ? data : b))
      }

      setEditingBlog(null)
      triggerAlert('Blog post saved successfully!')
    } catch (err) {
      triggerAlert(err.message, 'error')
    }
  }

  // RENDER: Login screen if not authenticated
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
        {/* Navigation back button */}
        <button
          onClick={onBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg border transition-all duration-200"
          style={{ background: 'var(--bg-btn-ghost)', borderColor: 'var(--border)', color: 'var(--text-3)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          <ArrowLeft size={13} /> Back to Portfolio
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--bg-tag)', border: '1px solid var(--border-tag)' }}>
              <Lock size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>Admin Login</h2>
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-5)' }}>Authenticate to manage portfolio data</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label htmlFor="username" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-5)' }}>Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500"><User size={14} /></span>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border outline-none transition-colors duration-200"
                  style={{ background: 'var(--bg-code)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-5)' }}>Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500"><Lock size={14} /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-lg border outline-none transition-colors duration-200"
                  style={{ background: 'var(--bg-code)', borderColor: 'var(--border)', color: 'var(--text-1)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs p-3 rounded-lg border bg-red-950/20 border-red-900/50" style={{ color: '#f87171' }}>
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-xs transition-opacity duration-200 mt-2 flex justify-center items-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#080c14', boxShadow: 'var(--shadow-glow)' }}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // RENDER: Main Dashboard Portal
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-page)', color: 'var(--text-1)' }}>
      {/* Alert Banner */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl border shadow-xl"
            style={{
              background: 'var(--bg-card)',
              borderColor: alert.type === 'error' ? 'rgba(239,68,68,0.3)' : 'var(--border-hover)',
              color: alert.type === 'error' ? '#f87171' : 'var(--accent)'
            }}
          >
            {alert.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
            <span className="text-xs font-semibold">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <header className="border-b h-[62px] sticky top-0 z-40" style={{ background: 'var(--nav-bg)', borderColor: 'var(--border-subtle)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200"
              style={{ background: 'var(--bg-btn-ghost)', borderColor: 'var(--border)', color: 'var(--text-3)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <ArrowLeft size={12} /> Live Site
            </button>
            <div className="h-4 w-px" style={{ background: 'var(--border-subtle)' }} />
            <div className="flex items-center gap-2 select-none">
              <div className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#080c14' }}>
                AD
              </div>
              <span className="text-xs font-bold tracking-wide">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-4)' }}>Logged in as admin</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 border"
              style={{ background: 'transparent', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 py-8 flex flex-col md:grid md:grid-cols-[200px_1fr] gap-8 flex-1">
        {/* Sidebar Nav */}
        <aside className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0" style={{ borderBottom: '1px solid var(--border-subtle)', mdBorderBottom: 'none' }}>
          {[
            { id: TABS.INQUIRIES, label: 'Inquiries', icon: MessageSquare, badge: messages.length },
            { id: TABS.PROJECTS, label: 'Projects', icon: Briefcase, badge: projects.length },
            { id: TABS.BLOGS, label: 'Blogs', icon: BookOpen, badge: blogs.length },
            { id: TABS.RESUME, label: 'Resume', icon: FileText, badge: null }
          ].map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap md:w-full"
                style={{
                  background: active ? 'var(--bg-tag)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-tag)' : 'transparent'}`,
                  color: active ? 'var(--accent)' : 'var(--text-5)'
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-3)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-5)' }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge > 0 && (
                  <span className="ml-auto text-[9.5px] px-1.5 py-0.5 rounded-md font-bold" style={{ background: active ? 'rgba(56,189,248,0.15)' : 'var(--bg-btn-ghost)', color: active ? 'var(--accent)' : 'var(--text-4)' }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </aside>

        {/* Tab Panel */}
        <main className="min-w-0">
          {/* TAB 1: INQUIRIES */}
          {activeTab === TABS.INQUIRIES && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold">Contact Inquiries</h3>
                <p className="text-xs" style={{ color: 'var(--text-5)' }}>Review inquiries submitted from the contact form</p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center p-12 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-dashed)', background: 'var(--bg-subtle)' }}>
                  <MessageSquare className="mx-auto mb-3 text-slate-600" size={24} />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-4)' }}>No inquiries found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map(msg => (
                    <div key={msg.id} className="p-5 rounded-xl border flex flex-col gap-3 relative group" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold" style={{ color: 'var(--text-1)' }}>{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-[11px] hover:underline" style={{ color: 'var(--accent)' }}>{msg.email}</a>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px]" style={{ color: 'var(--text-5)' }}>
                            {new Date(msg.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                          </span>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                            title="Delete inquiry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed whitespace-pre-wrap p-3 rounded-lg" style={{ background: 'var(--bg-code)', color: 'var(--text-3)' }}>
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === TABS.PROJECTS && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Manage Projects</h3>
                  <p className="text-xs" style={{ color: 'var(--text-5)' }}>Add or update projects on your portfolio website</p>
                </div>
                <button
                  onClick={() => setEditingProject('new')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#080c14' }}
                >
                  <Plus size={13} /> Add Project
                </button>
              </div>

              {/* Project Editor Modal */}
              <AnimatePresence>
                {editingProject && (
                  <ProjectEditorModal
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSave={saveProject}
                    onImageUpload={handleImageUpload}
                  />
                )}
              </AnimatePresence>

              {projects.length === 0 ? (
                <div className="text-center p-12 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-dashed)', background: 'var(--bg-subtle)' }}>
                  <Briefcase className="mx-auto mb-3 text-slate-600" size={24} />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-4)' }}>No projects found</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {projects.map(proj => (
                    <div key={proj.id} className="p-4 rounded-xl border flex flex-col justify-between gap-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: 'var(--bg-code)', color: 'var(--accent)' }}>{proj.id}</span>
                          <span className="text-[10.5px] font-bold text-emerald-400">{proj.status}</span>
                        </div>
                        <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>{proj.title}</h4>
                        <p className="text-xs line-clamp-2" style={{ color: 'var(--text-4)' }}>{proj.description}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border transition-colors"
                          style={{ background: 'var(--bg-btn-ghost)', borderColor: 'var(--border)', color: 'var(--text-3)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                        >
                          <Edit size={11} /> Edit
                        </button>
                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border transition-colors border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BLOGS */}
          {activeTab === TABS.BLOGS && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Manage Blogs</h3>
                  <p className="text-xs" style={{ color: 'var(--text-5)' }}>Write and publish developer insights</p>
                </div>
                <button
                  onClick={() => setEditingBlog('new')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#080c14' }}
                >
                  <Plus size={13} /> Add Blog Post
                </button>
              </div>

              {/* Blog Editor Modal */}
              <AnimatePresence>
                {editingBlog && (
                  <BlogEditorModal
                    blog={editingBlog}
                    onClose={() => setEditingBlog(null)}
                    onSave={saveBlog}
                    onImageUpload={handleImageUpload}
                  />
                )}
              </AnimatePresence>

              {blogs.length === 0 ? (
                <div className="text-center p-12 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-dashed)', background: 'var(--bg-subtle)' }}>
                  <BookOpen className="mx-auto mb-3 text-slate-600" size={24} />
                  <p className="text-xs font-medium" style={{ color: 'var(--text-4)' }}>No blog posts found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {blogs.map(b => (
                    <div key={b.id} className="p-4 rounded-xl border flex items-center justify-between gap-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 text-[10.5px]" style={{ color: 'var(--text-5)' }}>
                          <span>{b.date}</span>
                          <span>•</span>
                          <span>{b.readTime}</span>
                          <span>•</span>
                          <span className="font-mono text-cyan-400">{b.id}</span>
                        </div>
                        <h4 className="text-xs font-bold" style={{ color: 'var(--text-1)' }}>{b.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingBlog(b)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border transition-colors"
                          style={{ background: 'var(--bg-btn-ghost)', borderColor: 'var(--border)', color: 'var(--text-3)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                        >
                          <Edit size={11} /> Edit
                        </button>
                        <button
                          onClick={() => deleteBlog(b.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border transition-colors border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RESUME */}
          {activeTab === TABS.RESUME && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold">Resume Management</h3>
                <p className="text-xs" style={{ color: 'var(--text-5)' }}>Upload and manage your Resume PDF file</p>
              </div>

              <div className="p-6 rounded-xl border flex flex-col md:flex-row items-center gap-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-tag)', border: '1px solid var(--border-tag)' }}>
                  <FileText size={24} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <h4 className="text-xs font-bold">Current Resume Path</h4>
                  <p className="text-xs font-mono select-all mt-1 truncate" style={{ color: 'var(--text-4)' }}>{resumePath}</p>
                  <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-5)' }}>The resume button on the navigation bar downloads this file.</p>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="resume-upload"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    disabled={uploadingResume}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 border cursor-pointer select-none"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#080c14' }}
                  >
                    {uploadingResume ? (
                      'Uploading...'
                    ) : (
                      <><Upload size={13} /> Upload New PDF</>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   SUB-COMPONENT: PROJECT EDITOR MODAL
   ──────────────────────────────────────────────────────── */
function ProjectEditorModal({ project, onClose, onSave, onImageUpload }) {
  const isNew = project === 'new'
  const [form, setForm] = useState({
    id: isNew ? '' : project.id,
    title: isNew ? '' : project.title,
    subtitle: isNew ? '' : project.subtitle || '',
    status: isNew ? 'Completed' : project.status || 'Completed',
    description: isNew ? '' : project.description,
    longDescription: isNew ? '' : project.longDescription || '',
    image: isNew ? '' : project.image || '',
    tags: isNew ? '' : project.tags?.join(', ') || '',
    category: isNew ? '' : project.category?.join(', ') || '',
    github: isNew ? '' : project.github || '',
    demo: isNew ? '' : project.demo || '',
    features: isNew ? '' : project.features?.join('\n') || '',
    techStackFront: isNew ? '' : project.techStack?.frontend?.join(', ') || '',
    techStackBack: isNew ? '' : project.techStack?.backend?.join(', ') || '',
    techStackDb: isNew ? '' : project.techStack?.database?.join(', ') || '',
    techStackDevops: isNew ? '' : project.techStack?.devops?.join(', ') || '',
    challengesText: isNew ? '' : JSON.stringify(project.challenges || [], null, 2)
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const url = await onImageUpload(file)
    if (url) {
      setForm(prev => ({ ...prev, image: url }))
    }
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Parse arrays and objects
    const cleanForm = {
      id: form.id.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      status: form.status,
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      image: form.image.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      category: form.category.split(',').map(c => c.trim()).filter(Boolean),
      github: form.github.trim(),
      demo: form.demo.trim(),
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      techStack: {
        frontend: form.techStackFront.split(',').map(t => t.trim()).filter(Boolean),
        backend: form.techStackBack.split(',').map(t => t.trim()).filter(Boolean),
        database: form.techStackDb.split(',').map(t => t.trim()).filter(Boolean),
        devops: form.techStackDevops.split(',').map(t => t.trim()).filter(Boolean),
      }
    }

    try {
      cleanForm.challenges = form.challengesText.trim() 
        ? JSON.parse(form.challengesText) 
        : []
    } catch {
      alert('Challenges must be valid JSON array: [{"challenge": "text", "solution": "text"}]')
      return
    }

    onSave(e, cleanForm)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl border flex flex-col"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', boxShadow: 'var(--shadow-card)' }}
      >
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-base font-bold">{isNew ? 'Create Project' : `Edit: ${project.title}`}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-500/10">
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs flex-1">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-slate-400">Project ID (e.g. ecommerce)</label>
              <input
                type="text" required name="id" disabled={!isNew}
                value={form.id} onChange={handleChange}
                placeholder="ecommerce"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Title</label>
              <input
                type="text" required name="title"
                value={form.title} onChange={handleChange}
                placeholder="E-commerce Platform"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-slate-400">Subtitle</label>
              <input
                type="text" name="subtitle"
                value={form.subtitle} onChange={handleChange}
                placeholder="Scalable Online Retail"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Status</label>
              <select
                name="status"
                value={form.status} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-400">Short Description</label>
            <textarea
              required name="description" rows={2}
              value={form.description} onChange={handleChange}
              placeholder="Short card description..."
              className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50 resize-y"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-400">Long Description (Detailed modal summary)</label>
            <textarea
              name="longDescription" rows={3}
              value={form.longDescription} onChange={handleChange}
              placeholder="Provide a comprehensive write-up of features, goals, and workflow..."
              className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50 resize-y"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-slate-400">Tags (comma separated)</label>
              <input
                type="text" name="tags"
                value={form.tags} onChange={handleChange}
                placeholder="React, Express, JWT"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Categories (comma separated)</label>
              <input
                type="text" name="category"
                value={form.category} onChange={handleChange}
                placeholder="Full Stack, Backend"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-slate-400">GitHub URL</label>
              <input
                type="text" name="github"
                value={form.github} onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Demo URL</label>
              <input
                type="text" name="demo"
                value={form.demo} onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg border flex items-center justify-between gap-4" style={{ background: 'var(--bg-code)', borderColor: 'var(--border)' }}>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Project Screenshot / Image URL</label>
              <input
                type="text" name="image"
                value={form.image} onChange={handleChange}
                placeholder="/uploads/file.png"
                className="w-full px-3 py-1.5 rounded-lg border outline-none bg-slate-950/70 border-slate-800/80 w-64"
              />
            </div>
            <div className="relative">
              <input
                type="file" accept="image/*"
                id="proj-img-file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={loading}
              />
              <label htmlFor="proj-img-file" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-700 font-semibold cursor-pointer select-none text-[10.5px]">
                {loading ? 'Uploading...' : <><Upload size={12} /> Upload Image</>}
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-400">Key Features (One feature per line)</label>
            <textarea
              name="features" rows={2}
              value={form.features} onChange={handleChange}
              placeholder="Product Catalog with sorting&#10;Stripe secure checkout"
              className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50 resize-y font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block mb-1.5 font-semibold text-slate-300">Detailed Tech Stack</label>
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/20">
              <div>
                <label className="block mb-0.5 text-slate-400 text-[10px]">Frontend</label>
                <input
                  type="text" name="techStackFront"
                  value={form.techStackFront} onChange={handleChange}
                  placeholder="React, Next"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block mb-0.5 text-slate-400 text-[10px]">Backend</label>
                <input
                  type="text" name="techStackBack"
                  value={form.techStackBack} onChange={handleChange}
                  placeholder="Node.js, Express"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block mb-0.5 text-slate-400 text-[10px]">Database</label>
                <input
                  type="text" name="techStackDb"
                  value={form.techStackDb} onChange={handleChange}
                  placeholder="SQLite, Mongo"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block mb-0.5 text-slate-400 text-[10px]">DevOps / Tools</label>
                <input
                  type="text" name="techStackDevops"
                  value={form.techStackDevops} onChange={handleChange}
                  placeholder="Docker, Git"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium text-slate-400">Challenges & Solutions (JSON Array)</label>
            </div>
            <textarea
              name="challengesText" rows={2}
              value={form.challengesText} onChange={handleChange}
              placeholder='[&#10;  { "challenge": "text", "solution": "text" }&#10;]'
              className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50 resize-y font-mono text-[11px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button" onClick={onClose}
              className="px-4 py-2.5 rounded-lg border font-semibold border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#080c14' }}
            >
              <Save size={13} /> Save Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   SUB-COMPONENT: BLOG EDITOR MODAL
   ──────────────────────────────────────────────────────── */
function BlogEditorModal({ blog, onClose, onSave, onImageUpload }) {
  const isNew = blog === 'new'
  const [form, setForm] = useState({
    id: isNew ? '' : blog.id,
    title: isNew ? '' : blog.title,
    content: isNew ? '' : blog.content,
    image: isNew ? '' : blog.image || '',
    readTime: isNew ? '3 min read' : blog.readTime || '3 min read',
    tags: isNew ? '' : blog.tags?.join(', ') || ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const url = await onImageUpload(file)
    if (url) {
      setForm(prev => ({ ...prev, image: url }))
    }
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const cleanForm = {
      id: form.id.trim(),
      title: form.title.trim(),
      content: form.content.trim(),
      image: form.image.trim(),
      readTime: form.readTime.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    onSave(e, cleanForm)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl border flex flex-col"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', boxShadow: 'var(--shadow-card)' }}
      >
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-base font-bold">{isNew ? 'Create Blog Post' : `Edit: ${blog.title}`}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-500/10">
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs flex-1">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-slate-400">Post ID (URL slug, e.g. express-guide)</label>
              <input
                type="text" required name="id" disabled={!isNew}
                value={form.id} onChange={handleChange}
                placeholder="express-guide"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50 font-mono"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Post Title</label>
              <input
                type="text" required name="title"
                value={form.title} onChange={handleChange}
                placeholder="Building APIs with Express"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-slate-400">Read Time</label>
              <input
                type="text" name="readTime"
                value={form.readTime} onChange={handleChange}
                placeholder="4 min read"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Tags (comma separated)</label>
              <input
                type="text" name="tags"
                value={form.tags} onChange={handleChange}
                placeholder="Node.js, Backend, API"
                className="w-full px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg border flex items-center justify-between gap-4" style={{ background: 'var(--bg-code)', borderColor: 'var(--border)' }}>
            <div>
              <label className="block mb-1 font-medium text-slate-400">Header Image URL (Optional)</label>
              <input
                type="text" name="image"
                value={form.image} onChange={handleChange}
                placeholder="/uploads/file.png"
                className="w-full px-3 py-1.5 rounded-lg border outline-none bg-slate-950/70 border-slate-800/80 w-64"
              />
            </div>
            <div className="relative">
              <input
                type="file" accept="image/*"
                id="blog-img-file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={loading}
              />
              <label htmlFor="blog-img-file" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-700 font-semibold cursor-pointer select-none text-[10.5px]">
                {loading ? 'Uploading...' : <><Upload size={12} /> Upload Image</>}
              </label>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[250px]">
            <label className="block mb-1 font-medium text-slate-400">Markdown Content</label>
            <textarea
              required name="content"
              value={form.content} onChange={handleChange}
              placeholder="# My Awesome Blog Post..."
              className="w-full flex-1 px-3 py-2 rounded-lg border outline-none bg-slate-900/50 border-slate-700/50 font-mono resize-y min-h-[200px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="button" onClick={onClose}
              className="px-4 py-2.5 rounded-lg border font-semibold border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#080c14' }}
            >
              <Save size={13} /> Save Post
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
