import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Play,
  MapPin,
  Calendar,
  X,
  Compass,
  Sparkles,
  Maximize2,
  Edit2,
  Trash2,
  Plus,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { momentsData as staticMoments } from '../data/moments'

const categories = ['All', 'Travel', 'Tech & Hackathons', 'Activities', 'Videos']

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
}

const inputStyle = {
  background: 'var(--bg-code)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-1)',
  padding: '8px 12px',
  fontSize: '12.5px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s ease',
}

const emptyForm = {
  id: '',
  title: '',
  category: 'Travel',
  type: 'photo',
  date: new Date().getFullYear().toString(),
  location: '',
  description: '',
  image: '',
  videoUrl: '',
  thumbnail: '',
  tags: '',
}

export default function LifeMoments() {
  const [moments, setMoments] = useState(staticMoments)
  const [_loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedMoment, setSelectedMoment] = useState(null)

  // Edit / Add Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMoment, setEditingMoment] = useState(emptyForm)
  const [isNew, setIsNew] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })

  const fileInputRef = useRef(null)

  // Fetch moments from API on mount
  useEffect(() => {
    fetch('/api/moments')
      .then((res) => {
        if (!res.ok) throw new Error('API fetch failed')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMoments(data)
        } else {
          setMoments(staticMoments)
        }
      })
      .catch((err) => {
        console.warn('Using static moments fallback:', err)
        setMoments(staticMoments)
      })
      .finally(() => setLoading(false))
  }, [])

  // Lightbox keyboard listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedMoment(null)
        setIsEditModalOpen(false)
      }
    }
    if (selectedMoment || isEditModalOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKey)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [selectedMoment, isEditModalOpen])

  const triggerAlert = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000)
  }

  // Open Edit Form for an existing moment
  const handleOpenEdit = (moment, e) => {
    if (e) e.stopPropagation()
    setIsNew(false)
    setEditingMoment({
      id: moment.id,
      title: moment.title || '',
      category: moment.category || 'Travel',
      type: moment.type || 'photo',
      date: moment.date || '',
      location: moment.location || '',
      description: moment.description || '',
      image: moment.image || '',
      videoUrl: moment.videoUrl || '',
      thumbnail: moment.thumbnail || '',
      tags: Array.isArray(moment.tags) ? moment.tags.join(', ') : moment.tags || '',
    })
    setIsEditModalOpen(true)
  }

  // Open Form to create a new moment
  const handleOpenCreate = () => {
    setIsNew(true)
    setEditingMoment({
      ...emptyForm,
      id: `moment-${Date.now()}`,
    })
    setIsEditModalOpen(true)
  }

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('media', file)

    try {
      const res = await fetch('/api/uploads/media', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()

      if (data.type === 'video') {
        setEditingMoment(prev => ({
          ...prev,
          type: 'video',
          videoUrl: data.url,
          category: prev.category === 'Travel' ? 'Videos' : prev.category,
        }))
      } else {
        setEditingMoment(prev => ({
          ...prev,
          image: data.url,
          type: 'photo',
        }))
      }
      triggerAlert(`File "${file.name}" uploaded successfully!`)
    } catch (err) {
      console.error(err)
      triggerAlert('Failed to upload file. Check server.', 'error')
    } finally {
      setUploading(false)
    }
  }

  // Save changes (POST or PUT)
  const handleSaveMoment = async (e) => {
    e.preventDefault()
    if (!editingMoment.title.trim()) {
      triggerAlert('Title is required!', 'error')
      return
    }

    const payload = {
      ...editingMoment,
      tags: editingMoment.tags
        ? editingMoment.tags.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    }

    try {
      const url = isNew ? '/api/moments' : `/api/moments/${editingMoment.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      let savedData = payload
      if (res.ok) {
        savedData = await res.json()
      }

      setMoments(prev => {
        if (isNew) return [savedData, ...prev]
        return prev.map(m => m.id === savedData.id ? savedData : m)
      })

      // Update selectedMoment if open in viewer
      if (selectedMoment && selectedMoment.id === savedData.id) {
        setSelectedMoment(savedData)
      }

      setIsEditModalOpen(false)
      triggerAlert(isNew ? 'New moment added successfully!' : 'Moment updated successfully!')
    } catch (err) {
      console.error(err)
      // Optimistic update locally anyway
      setMoments(prev => {
        if (isNew) return [payload, ...prev]
        return prev.map(m => m.id === payload.id ? payload : m)
      })
      setIsEditModalOpen(false)
      triggerAlert('Saved locally (Server sync pending)', 'info')
    }
  }

  // Delete moment
  const handleDeleteMoment = async (id, e) => {
    if (e) e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this moment?')) return

    try {
      await fetch(`/api/moments/${id}`, { method: 'DELETE' })
      setMoments(prev => prev.filter(m => m.id !== id))
      if (selectedMoment && selectedMoment.id === id) {
        setSelectedMoment(null)
      }
      triggerAlert('Moment deleted.')
    } catch (err) {
      console.error(err)
      setMoments(prev => prev.filter(m => m.id !== id))
      if (selectedMoment && selectedMoment.id === id) {
        setSelectedMoment(null)
      }
      triggerAlert('Deleted locally.')
    }
  }

  const filteredMoments = moments.filter((item) => {
    if (activeCategory === 'All') return true
    if (activeCategory === 'Videos') return item.type === 'video'
    return item.category === activeCategory
  })

  return (
    <>
      <section
        id="moments"
        aria-label="Moments and life activities section"
        className="relative py-16 sm:py-20 lg:py-24"
        style={{ background: 'var(--bg-page)' }}
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Section Header */}
          <motion.div {...fadeIn} className="text-center mb-8 sm:mb-10">
            <p className="section-label mb-2 flex items-center justify-center gap-1.5">
              <Compass size={13} />
              <span>Life & Activities</span>
            </p>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-bold tracking-[-0.035em] leading-tight gradient-text-soft">
              Moments Beyond Code
            </h2>
            <p
              className="max-w-[560px] mx-auto mt-2.5 text-[12px] sm:text-[13px] lg:text-[14px] leading-relaxed"
              style={{ color: 'var(--text-5)' }}
            >
              A glimpse into life outside the IDE — travels, mountain hikes, hackathon nights, developer meetups, and recorded demos.
            </p>

            {/* Action Bar: Add Moment Button */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  color: '#080c14',
                  boxShadow: '0 4px 14px var(--glow-cyan)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px var(--glow-cyan)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 14px var(--glow-cyan)'
                }}
              >
                <Plus size={14} />
                <span>Add Moment / Video</span>
              </button>
            </div>
          </motion.div>

          {/* Notification Toast */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto mb-8 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium"
                style={{
                  background: notification.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-success)',
                  color: notification.type === 'error' ? '#ef4444' : 'var(--text-success)',
                  border: `1px solid ${notification.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-success)'}`,
                }}
              >
                {notification.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                <span>{notification.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter Tabs */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: active
                      ? 'linear-gradient(135deg, var(--accent), var(--accent-2))'
                      : 'var(--bg-subtle)',
                    color: active ? '#080c14' : 'var(--text-4)',
                    border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                    boxShadow: active ? '0 4px 14px var(--glow-cyan)' : 'none',
                    fontWeight: active ? '600' : '500',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMoments.map((item, idx) => {
                const isVideo = item.type === 'video'
                const displayMedia = item.image || item.thumbnail || (isVideo ? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="card group cursor-pointer overflow-hidden flex flex-col h-full relative"
                    onClick={() => setSelectedMoment(item)}
                  >
                    {/* Media Thumbnail Container */}
                    <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-900 flex-shrink-0">
                      <img
                        src={displayMedia}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
                        }}
                      />

                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Top Badges & Action Buttons */}
                      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                        {/* Type Badge */}
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                          style={{
                            background: isVideo ? 'rgba(239, 68, 68, 0.85)' : 'rgba(8, 12, 20, 0.75)',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          {isVideo ? (
                            <>
                              <Play size={10} fill="currentColor" /> Video
                            </>
                          ) : (
                            <>
                              <Camera size={10} /> Photo
                            </>
                          )}
                        </span>

                        {/* Edit & Delete Quick Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleOpenEdit(item, e)}
                            title="Edit this moment"
                            className="w-7 h-7 rounded-lg bg-black/60 hover:bg-sky-500 text-white flex items-center justify-center transition-colors duration-200 backdrop-blur-md cursor-pointer"
                            aria-label={`Edit ${item.title}`}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteMoment(item.id, e)}
                            title="Delete this moment"
                            className="w-7 h-7 rounded-lg bg-black/60 hover:bg-rose-500 text-white flex items-center justify-center transition-colors duration-200 backdrop-blur-md cursor-pointer"
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Play Button Overlay for Videos */}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                            style={{
                              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                              color: '#080c14',
                              boxShadow: '0 0 24px var(--glow-cyan)',
                            }}
                          >
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Location & Date Pin */}
                      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-white/90">
                        <div className="flex items-center gap-1">
                          <MapPin size={11} className="text-sky-400 flex-shrink-0" />
                          <span className="truncate">{item.location || 'Explore'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <Calendar size={11} />
                          <span>{item.date || '2025'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Maximize2 size={10} /> Expand
                          </span>
                        </div>
                        <h3
                          className="text-sm sm:text-base font-bold tracking-tight mb-2 group-hover:text-sky-400 transition-colors duration-200"
                          style={{ color: 'var(--text-1)' }}
                        >
                          {item.title}
                        </h3>
                        <p
                          className="text-xs leading-relaxed line-clamp-2"
                          style={{ color: 'var(--text-4)' }}
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* Tags & Edit trigger link */}
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tech-pill text-[9px]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => handleOpenEdit(item, e)}
                          className="text-[11px] font-medium text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 size={10} /> Edit
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Bottom Note */}
          <motion.div
            {...fadeIn}
            className="mt-12 text-center text-xs"
            style={{ color: 'var(--text-5)' }}
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border"
              style={{
                background: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <Sparkles size={13} className="text-sky-400" />
              You can edit any card's photos, text description, or videos directly using the Edit button!
            </span>
          </motion.div>

        </div>
      </section>

      {/* =========================================
          MEDIA LIGHTBOX MODAL
      ========================================= */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedMoment(null)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl rounded-2xl overflow-hidden relative flex flex-col"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-hover)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6), var(--shadow-glow)',
              }}
            >
              {/* Modal Top Actions */}
              <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
                <button
                  onClick={() => {
                    const m = selectedMoment
                    setSelectedMoment(null)
                    handleOpenEdit(m)
                  }}
                  className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 cursor-pointer backdrop-blur-md"
                  aria-label="Edit moment"
                >
                  <Edit2 size={13} />
                  <span>Edit Moment</span>
                </button>

                <button
                  onClick={() => setSelectedMoment(null)}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors duration-200 cursor-pointer backdrop-blur-md"
                  aria-label="Close viewer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Media Container */}
              <div className="relative bg-black flex items-center justify-center max-h-[62vh] overflow-hidden">
                {selectedMoment.type === 'video' ? (
                  <video
                    src={selectedMoment.videoUrl}
                    poster={selectedMoment.thumbnail || selectedMoment.image}
                    controls
                    autoPlay
                    className="w-full max-h-[62vh] object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={selectedMoment.image || selectedMoment.thumbnail}
                    alt={selectedMoment.title}
                    className="w-full max-h-[62vh] object-contain"
                  />
                )}
              </div>

              {/* Media Details */}
              <div className="p-5 sm:p-6" style={{ background: 'var(--bg-card)' }}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'var(--bg-tag)',
                      color: 'var(--accent)',
                      border: '1px solid var(--border-tag)',
                    }}
                  >
                    {selectedMoment.category}
                  </span>

                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-4)' }}>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-sky-400" />
                      {selectedMoment.location || 'Location'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {selectedMoment.date || '2025'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
                  {selectedMoment.title}
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-3)' }}>
                  {selectedMoment.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(selectedMoment.tags) && selectedMoment.tags.map((tag) => (
                    <span key={tag} className="tech-pill text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          EDIT / CREATE MOMENT MODAL
      ========================================= */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEditModalOpen(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl rounded-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-hover)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), var(--shadow-glow)',
              }}
            >
              {/* Modal Header */}
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sky-400"
                    style={{ background: 'var(--bg-tag)' }}
                  >
                    {isNew ? <Plus size={16} /> : <Edit2 size={15} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
                      {isNew ? 'Add New Moment / Activity' : 'Edit Moment'}
                    </h3>
                    <p className="text-[11px]" style={{ color: 'var(--text-5)' }}>
                      Edit photos, descriptions, videos, and tags
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  style={{ background: 'var(--bg-btn-ghost)' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveMoment} className="p-5 overflow-y-auto flex flex-col gap-3.5">
                {/* Media Type Selector */}
                <div>
                  <label className="block text-[11px] font-medium mb-1.5" style={{ color: 'var(--text-3)' }}>
                    Media Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingMoment(prev => ({ ...prev, type: 'photo' }))}
                      className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      style={{
                        background: editingMoment.type === 'photo' ? 'var(--bg-tag)' : 'var(--bg-code)',
                        border: `1px solid ${editingMoment.type === 'photo' ? 'var(--border-hover)' : 'var(--border)'}`,
                        color: editingMoment.type === 'photo' ? 'var(--accent)' : 'var(--text-4)',
                      }}
                    >
                      <Camera size={13} /> Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMoment(prev => ({ ...prev, type: 'video' }))}
                      className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      style={{
                        background: editingMoment.type === 'video' ? 'var(--bg-tag)' : 'var(--bg-code)',
                        border: `1px solid ${editingMoment.type === 'video' ? 'var(--border-hover)' : 'var(--border)'}`,
                        color: editingMoment.type === 'video' ? 'var(--accent)' : 'var(--text-4)',
                      }}
                    >
                      <Play size={13} /> Video Clip
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Himalayan Trek or Hackathon Sprint"
                    value={editingMoment.title}
                    onChange={(e) => setEditingMoment({ ...editingMoment, title: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Category & Date */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                      Category
                    </label>
                    <select
                      value={editingMoment.category}
                      onChange={(e) => setEditingMoment({ ...editingMoment, category: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="Travel">Travel</option>
                      <option value="Tech & Hackathons">Tech & Hackathons</option>
                      <option value="Activities">Activities</option>
                      <option value="Videos">Videos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                      Date / Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2025 or Sept 2025"
                      value={editingMoment.date}
                      onChange={(e) => setEditingMoment({ ...editingMoment, date: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Himachal Pradesh, India"
                    value={editingMoment.location}
                    onChange={(e) => setEditingMoment({ ...editingMoment, location: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Description ("Write something") */}
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    Description / Story ("Write something") *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Write a brief story or note about this trip, hackathon, or clip..."
                    value={editingMoment.description}
                    onChange={(e) => setEditingMoment({ ...editingMoment, description: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Media Upload & URL Area */}
                <div className="p-3.5 rounded-xl border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--text-2)' }}>
                      {editingMoment.type === 'video' ? 'Video Source & Poster' : 'Photo Source'}
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 cursor-pointer"
                    >
                      <Upload size={11} />
                      <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={editingMoment.type === 'video' ? 'video/*,image/*' : 'image/*'}
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  {editingMoment.type === 'video' ? (
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="block text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-5)' }}>
                          Video URL (MP4, WebM, Cloudinary, etc.)
                        </label>
                        <input
                          type="text"
                          placeholder="https://... or /uploads/video.mp4"
                          value={editingMoment.videoUrl}
                          onChange={(e) => setEditingMoment({ ...editingMoment, videoUrl: e.target.value })}
                          style={{ ...inputStyle, fontSize: '11.5px' }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-5)' }}>
                          Video Thumbnail / Poster Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://... (image to show before video plays)"
                          value={editingMoment.thumbnail}
                          onChange={(e) => setEditingMoment({ ...editingMoment, thumbnail: e.target.value })}
                          style={{ ...inputStyle, fontSize: '11.5px' }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-5)' }}>
                        Photo URL (Direct image link or /uploads/...)
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/... or /uploads/myphoto.jpg"
                        value={editingMoment.image}
                        onChange={(e) => setEditingMoment({ ...editingMoment, image: e.target.value })}
                        style={{ ...inputStyle, fontSize: '11.5px' }}
                      />
                    </div>
                  )}

                  {/* Preview Thumbnail if available */}
                  {(editingMoment.image || editingMoment.thumbnail) && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <img
                        src={editingMoment.image || editingMoment.thumbnail}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-md border"
                        style={{ borderColor: 'var(--border)' }}
                      />
                      <span className="text-[10px]" style={{ color: 'var(--text-5)' }}>
                        Media preview loaded
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Mountains, Trekking, Travel"
                    value={editingMoment.tags}
                    onChange={(e) => setEditingMoment({ ...editingMoment, tags: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  {!isNew ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        setIsEditModalOpen(false)
                        handleDeleteMoment(editingMoment.id, e)
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                      style={{ background: 'var(--bg-btn-ghost)', color: 'var(--text-4)' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        color: '#080c14',
                        boxShadow: '0 4px 14px var(--glow-cyan)',
                      }}
                    >
                      {isNew ? 'Create Moment' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
