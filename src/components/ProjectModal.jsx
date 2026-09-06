import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { GithubIcon } from './Icons'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl rounded-2xl overflow-hidden relative"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-hover)',
            boxShadow: 'var(--shadow-glow), 0 40px 80px rgba(0,0,0,0.5)',
          }}
          role="dialog" aria-modal="true" aria-label={`${project.title} project details`}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{ background: 'var(--bg-btn-ghost)', border: '1px solid var(--border)', color: 'var(--text-5)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-5)'}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="p-6 pb-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex flex-wrap items-start gap-3 mb-4 pr-10">
              <div>
                <h2 className="text-2xl font-bold gradient-text-soft mb-1">{project.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-5)' }}>{project.subtitle}</p>
              </div>
              <span className="badge-completed ml-auto">{project.status}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200"
                  style={{ background: 'var(--bg-btn-ghost)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <GithubIcon size={13} /> GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg"
                  style={{ background: 'var(--bg-tag)', border: '1px solid var(--border-tag)', color: 'var(--accent)' }}
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 flex flex-col gap-8">
            <section>
              <SectionTitle>Overview</SectionTitle>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>
                {project.longDescription || project.description}
              </p>
            </section>

            {project.features?.length > 0 && (
              <section>
                <SectionTitle>Features</SectionTitle>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
                      <ChevronRight size={12} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.techStack && (
              <section>
                <SectionTitle>Tech Stack</SectionTitle>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(project.techStack).map(([category, techs]) => (
                    <div key={category}>
                      <div className="text-xs font-semibold capitalize mb-2" style={{ color: 'var(--text-5)' }}>{category}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {techs.map(t => <span key={t} className="tech-pill">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionTitle>Architecture</SectionTitle>
              <div
                className="p-5 rounded-xl font-mono text-xs flex flex-col gap-2"
                style={{ background: 'var(--bg-code)', border: '1px solid var(--border-subtle)' }}
              >
                {['Frontend (React)', '↓ HTTP / REST API', 'Backend (Node.js / Express)', '↓ Mongoose ODM', 'Database (MongoDB)'].map((line, i) => (
                  <div key={i} style={{
                    color: line.startsWith('↓') ? 'var(--accent)' : 'var(--text-3)',
                    paddingLeft: line.startsWith('↓') ? '1rem' : '0',
                  }}>{line}</div>
                ))}
                {project.techStack?.devops && (
                  <>
                    <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 4, paddingTop: 8, color: 'var(--text-5)' }}>Deployment</div>
                    {['Docker (containerised)', '↓', 'AWS EC2 + Nginx'].map((line, i) => (
                      <div key={i} style={{ color: line === '↓' ? 'var(--accent-2)' : 'var(--text-3)', paddingLeft: line === '↓' ? '1rem' : '0' }}>{line}</div>
                    ))}
                  </>
                )}
              </div>
            </section>

            {project.challenges?.length > 0 && (
              <section>
                <SectionTitle>Challenges & Solutions</SectionTitle>
                <div className="flex flex-col gap-4">
                  {project.challenges.map((c, i) => (
                    <div key={i} className="p-4 rounded-xl"
                      style={{ background: 'var(--bg-code)', border: '1px solid var(--border-subtle)' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-1)' }}>Challenge: {c.challenge}</div>
                      <div className="text-xs leading-relaxed" style={{ color: 'var(--text-4)' }}>Solution: {c.solution}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
      <span className="w-4 h-px" style={{ background: 'var(--accent)' }} />
      {children}
    </h3>
  )
}
