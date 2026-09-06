import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  Mail,
  MapPin,
  ExternalLink,
  X,
  CheckCircle,
  Sparkles,
  Award
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'
import { initialFriendsData } from '../data/friends'

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
  padding: '9px 12px',
  fontSize: '12.5px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s ease',
}

export default function Friends() {
  const [friends, setFriends] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_friends')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return initialFriendsData
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    relationship: 'Developer Friend',
    avatar: '',
    bio: '',
    skills: '',
    location: '',
    github: '',
    linkedin: '',
    email: '',
  })
  const [notification, setNotification] = useState('')

  // Persist friends in localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_friends', JSON.stringify(friends))
    } catch {
      // ignore
    }
  }, [friends])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddFriend = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const skillsArray = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Developer']

    const newFriend = {
      id: `friend-${Date.now()}`,
      name: formData.name.trim(),
      role: formData.role.trim() || 'Software Engineer',
      relationship: formData.relationship.trim() || 'Collaborator',
      avatar: formData.avatar.trim() || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name)}`,
      bio: formData.bio.trim() || 'Collaborator and friend in tech.',
      skills: skillsArray,
      location: formData.location.trim() || 'Remote',
      socials: {
        github: formData.github.trim() || '',
        linkedin: formData.linkedin.trim() || '',
        email: formData.email.trim() || '',
      },
    }

    setFriends(prev => [newFriend, ...prev])
    setIsModalOpen(false)
    setFormData({
      name: '',
      role: '',
      relationship: 'Developer Friend',
      avatar: '',
      bio: '',
      skills: '',
      location: '',
      github: '',
      linkedin: '',
      email: '',
    })

    setNotification(`Successfully added ${newFriend.name} to the network!`)
    setTimeout(() => setNotification(''), 4000)
  }

  return (
    <>
      <section
        id="friends"
        aria-label="Friends and collaborators section"
        className="relative py-16 sm:py-20 lg:py-24"
        style={{ background: 'var(--bg-section-alt)' }}
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Section Header */}
          <motion.div {...fadeIn} className="text-center mb-10 sm:mb-12">
            <p className="section-label mb-2 flex items-center justify-center gap-1.5">
              <Users size={13} />
              <span>Peer Community</span>
            </p>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-bold tracking-[-0.035em] leading-tight gradient-text-soft">
              Friends & Collaborators
            </h2>
            <p
              className="max-w-[540px] mx-auto mt-2.5 text-[12px] sm:text-[13px] lg:text-[14px] leading-relaxed"
              style={{ color: 'var(--text-5)' }}
            >
              Great software is rarely built alone. Here are teammates, fellow hackers, and friends I’ve had the privilege to code and collaborate with.
            </p>

            {/* Action Buttons Header */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
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
                <UserPlus size={14} />
                <span>Add Your Profile</span>
              </button>
            </div>
          </motion.div>

          {/* Notification Toast */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto mb-8 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium"
                style={{
                  background: 'var(--bg-success)',
                  color: 'var(--text-success)',
                  border: '1px solid var(--border-success)',
                }}
              >
                <CheckCircle size={14} />
                <span>{notification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Friends Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend, idx) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="card flex flex-col justify-between p-6 h-full group"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-3.5 mb-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-13 h-13 rounded-xl object-cover border"
                        style={{ borderColor: 'var(--border-hover)' }}
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(friend.name)}`
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2" style={{ borderColor: 'var(--bg-card)' }} />
                    </div>

                    {/* Name & Title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="text-sm font-bold truncate group-hover:text-sky-400 transition-colors duration-200" style={{ color: 'var(--text-1)' }}>
                          {friend.name}
                        </h3>
                      </div>
                      <p className="text-[11px] font-medium leading-tight mb-1" style={{ color: 'var(--accent)' }}>
                        {friend.role}
                      </p>
                      <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-5)' }}>
                        <MapPin size={10} className="flex-shrink-0" />
                        <span className="truncate">{friend.location || 'India'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Relationship Tag */}
                  <div className="mb-3.5">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-semibold uppercase tracking-wider"
                      style={{
                        background: 'var(--bg-tag)',
                        color: 'var(--text-tag)',
                        border: '1px solid var(--border-tag)',
                      }}
                    >
                      <Award size={10} />
                      {friend.relationship}
                    </span>
                  </div>

                  {/* Bio / Collaboration note */}
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-4)' }}>
                    "{friend.bio}"
                  </p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {friend.skills.map((skill) => (
                      <span key={skill} className="tech-pill text-[9.5px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Social / Contact Buttons */}
                <div
                  className="pt-4 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--border-subtle)' }}
                >
                  <span className="text-[10px] font-medium" style={{ color: 'var(--text-5)' }}>
                    Connect
                  </span>

                  <div className="flex items-center gap-2">
                    {friend.socials?.github && (
                      <a
                        href={friend.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: 'var(--bg-btn-ghost)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-4)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = 'var(--text-1)'
                          e.currentTarget.style.borderColor = 'var(--border-hover)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'var(--text-4)'
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                        aria-label={`${friend.name}'s GitHub`}
                      >
                        <GithubIcon size={12} />
                      </a>
                    )}

                    {friend.socials?.linkedin && (
                      <a
                        href={friend.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: 'var(--bg-btn-ghost)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-4)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = 'var(--text-1)'
                          e.currentTarget.style.borderColor = 'var(--border-hover)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'var(--text-4)'
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                        aria-label={`${friend.name}'s LinkedIn`}
                      >
                        <LinkedinIcon size={12} />
                      </a>
                    )}

                    {friend.socials?.email && (
                      <a
                        href={`mailto:${friend.socials.email}`}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: 'var(--bg-btn-ghost)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-4)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = 'var(--text-1)'
                          e.currentTarget.style.borderColor = 'var(--border-hover)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'var(--text-4)'
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                        aria-label={`Email ${friend.name}`}
                      >
                        <Mail size={12} />
                      </a>
                    )}

                    {friend.socials?.website && (
                      <a
                        href={friend.socials.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: 'var(--bg-btn-ghost)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-4)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = 'var(--accent)'
                          e.currentTarget.style.borderColor = 'var(--border-hover)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'var(--text-4)'
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                        aria-label={`${friend.name}'s Website`}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Peer Invitation Card */}
          <motion.div
            {...fadeIn}
            className="mt-12 max-w-2xl mx-auto p-6 rounded-2xl text-center border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-dashed)',
            }}
          >
            <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-sky-400"
              style={{ background: 'var(--bg-tag)' }}
            >
              <Sparkles size={18} />
            </div>
            <h4 className="text-sm sm:text-base font-bold mb-1" style={{ color: 'var(--text-1)' }}>
              Are We Friends or Collaborators?
            </h4>
            <p className="text-xs leading-relaxed max-w-md mx-auto mb-4" style={{ color: 'var(--text-4)' }}>
              If we’ve built projects, discussed code, or teamed up for hackathons together, add your profile card here to connect!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: 'var(--bg-btn-ghost)',
                border: '1px solid var(--border-hover)',
                color: 'var(--text-1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-subtle-hover)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-btn-ghost)'
              }}
            >
              <UserPlus size={13} />
              Add Your Profile Card
            </button>
          </motion.div>

        </div>
      </section>

      {/* =========================================
          ADD FRIEND MODAL
      ========================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
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
                    <UserPlus size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
                      Add Friend / Collaborator Card
                    </h3>
                    <p className="text-[11px]" style={{ color: 'var(--text-5)' }}>
                      Join Ajeet's developer network
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  style={{ background: 'var(--bg-btn-ghost)' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleAddFriend} className="p-5 overflow-y-auto flex flex-col gap-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      name="role"
                      placeholder="e.g. Full-Stack Developer"
                      value={formData.role}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                      Relationship / Connection
                    </label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      style={inputStyle}
                    >
                      <option value="Developer Friend">Developer Friend</option>
                      <option value="Hackathon Teammate">Hackathon Teammate</option>
                      <option value="College Peer">College Peer</option>
                      <option value="Open Source Contributor">Open Source Contributor</option>
                      <option value="Collaborator">Collaborator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Bengaluru, India"
                      value={formData.location}
                      onChange={handleInputChange}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    placeholder="https://... (leaves empty for custom avatar)"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    Skills / Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="React, Node.js, Python, AWS, Docker"
                    value={formData.skills}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    About / Collaboration Note *
                  </label>
                  <textarea
                    rows={2}
                    name="bio"
                    required
                    placeholder="A brief note on what we built together or shared tech interests..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
                    Social & Contact Links
                  </p>
                  <div className="grid sm:grid-cols-3 gap-2">
                    <input
                      type="url"
                      name="github"
                      placeholder="GitHub URL"
                      value={formData.github}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, fontSize: '11.5px' }}
                    />
                    <input
                      type="url"
                      name="linkedin"
                      placeholder="LinkedIn URL"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, fontSize: '11.5px' }}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, fontSize: '11.5px' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                    Save & Add Card
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
