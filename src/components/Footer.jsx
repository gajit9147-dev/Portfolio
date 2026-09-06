import { useState, useEffect } from 'react'
import { Mail, Code2 } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

const navLinks = [
  { label: 'Home',       href: '#home' },
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Contact',    href: '#contact' },
  { label: 'Moments',    href: '#moments' },
  { label: 'Friends',    href: '#friends' },
]

const socials = [
  { icon: GithubIcon,   href: 'https://github.com/',         label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/',     label: 'LinkedIn' },
  { icon: Mail,         href: 'mailto:ajeetgupta@example.com',          label: 'Email' },
]

export default function Footer() {
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

  const scrollTo = (href) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer style={{ background: 'var(--bg-page)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden border"
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
              <span className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Ajeet Gupta</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-5)' }}>
              Full-Stack Developer building secure, scalable web applications with modern technologies.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div className="section-label mb-4">Navigation</div>
            <ul className="flex flex-col gap-2">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                    className="text-xs transition-colors duration-200"
                    style={{ color: 'var(--text-5)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-3)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-5)'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <div className="section-label mb-4">Connect</div>
            <div className="flex flex-col gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 text-xs transition-colors duration-200 w-fit"
                  style={{ color: 'var(--text-5)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-3)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-5)'}
                >
                  <Icon size={13} /> {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-6)' }}>
            © 2026 Ajeet Gupta. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-6)' }}>
            <Code2 size={11} />
            <span>Built with React, Vite & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}