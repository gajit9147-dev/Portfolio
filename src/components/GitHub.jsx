import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitCommit, Star, GitFork, ExternalLink } from 'lucide-react'
import { GithubIcon } from './Icons'

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const repos = [
  {
    name: 'innervoice',
    description: 'Full-stack secure personal notes with JWT auth, Docker & AWS deployment.',
    language: 'JavaScript', langColor: '#f1e05a',
    stars: null, forks: null,
    url: 'https://github.com/gajit9147-dev',
  },
  {
    name: 'rest-api-backend',
    description: 'Modular Node.js REST API with JWT auth and role-based access control.',
    language: 'JavaScript', langColor: '#f1e05a',
    stars: null, forks: null,
    url: 'https://github.com/gajit9147-dev',
  },
  {
    name: 'cloud-deployment-setup',
    description: 'Docker + AWS EC2 + Nginx deployment config for Node.js applications.',
    language: 'Shell', langColor: '#89e051',
    stars: null, forks: null,
    url: 'https://github.com/gajit9147-dev',
  },
]

export default function GitHub() {
  const [avatar, setAvatar] = useState(() => localStorage.getItem('user_avatar') || '')

  useEffect(() => {
    fetch('/api/uploads/avatar')
      .then(res => res.json())
      .then(data => {
        if (data?.avatar) {
          setAvatar(data.avatar)
        }
      })
      .catch(() => {})

    const handleAvatarUpdate = (e) => {
      setAvatar(e.detail || '')
    }
    window.addEventListener('avatar-updated', handleAvatarUpdate)
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdate)
  }, [])
  return (
    <section id="github" style={{ background: 'var(--bg-section-alt)' }} aria-label="GitHub section">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div {...fadeIn} className="text-center mb-16">
          <p className="section-label mb-2">Open Source</p>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text-soft mb-3">Building in Public</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-5)' }}>
            My development work is tracked on GitHub. Find my repositories, contributions, and active projects below.
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          {...fadeIn} transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto p-5 rounded-xl mb-8 flex flex-wrap items-center gap-4"
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-card)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold overflow-hidden border"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              color: '#080c14',
              borderColor: 'var(--border-hover)',
            }}
          >
            {avatar ? (
              <img src={avatar} alt="Ajeet Gupta" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            ) : (
              'AG'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>Ajeet Gupta</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-5)' }}>Full-Stack Developer · Node.js · React · Docker · AWS</div>
          </div>
          <a
            href="https://github.com/gajit9147-dev" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200"
            style={{ background: 'var(--bg-btn-ghost)', border: '1px solid var(--border)', color: 'var(--text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <GithubIcon size={13} /> View GitHub →
          </a>
        </motion.div>

        {/* Contribution placeholder */}
        <motion.div
          {...fadeIn} transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-3xl mx-auto p-4 rounded-xl mb-8 text-center"
          style={{ background: 'var(--bg-tag)', border: '1px dashed var(--border-dashed)' }}
        >
          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-5)' }}>
            <GitCommit size={13} style={{ color: 'var(--accent)' }} />
            <span>
              GitHub contribution graph connects here once API integration is added.{' '}
              <a href="https://github.com/gajit9147-dev" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >View live activity →</a>
            </span>
          </div>
        </motion.div>

        {/* Repos */}
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {repos.map((repo, i) => (
            <motion.a
              key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="block p-4 rounded-xl group transition-all duration-200 h-full flex flex-col justify-between"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-card)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-card)'}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-mono text-xs font-semibold" style={{ color: 'var(--accent)' }}>{repo.name}</div>
                  <ExternalLink size={11} style={{ color: 'var(--text-5)', flexShrink: 0 }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-4)' }}>{repo.description}</p>
              </div>
              <div className="flex items-center gap-4 text-xs mt-auto" style={{ color: 'var(--text-5)' }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: repo.langColor }} />
                  {repo.language}
                </span>
                {repo.stars !== null && <span className="flex items-center gap-1"><Star size={11} />{repo.stars}</span>}
                {repo.forks !== null && <span className="flex items-center gap-1"><GitFork size={11} />{repo.forks}</span>}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
