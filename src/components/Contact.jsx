import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, WhatsappIcon } from './Icons'

const socials = [
  { icon: WhatsappIcon,  label: 'WhatsApp',  value: '+91 87870 95611',                                                    href: 'https://wa.me/918787095611?text=Hi%20Ajeet,%20I%20came%20across%20your%20portfolio!' },
  { icon: Mail,          label: 'Email',     value: 'ajeetgupta80045@gmail.com',                                           href: 'mailto:ajeetgupta80045@gmail.com' },
  { icon: GithubIcon,    label: 'GitHub',    value: 'github.com/gajit9147-dev',                                            href: 'https://github.com/gajit9147-dev' },
  { icon: LinkedinIcon,  label: 'LinkedIn',  value: 'linkedin.com/in/ajeet-gupta-970478273',                               href: 'https://www.linkedin.com/in/ajeet-gupta-970478273/' },
  { icon: InstagramIcon, label: 'Instagram', value: '@_ajeetgupta_07',                                                     href: 'https://www.instagram.com/_ajeetgupta_07?stkn=eTUxOXExeHh6dXMz&utm_source=qr' },
]

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

const inputBase = {
  background: 'var(--bg-code)',
  borderRadius: '8px',
  color: 'var(--text-1)',
  padding: '10px 14px',
  fontSize: '13px',
  width: '100%',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s ease',
}

export default function Contact() {
  const [form, setForm]         = useState({ name: '', email: '', message: '' })
  const [errors, setErrors]     = useState({})
  const [status, setStatus]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setStatus(null)

    const name = form.name.trim()
    const email = form.email.trim()
    const message = form.message.trim()

    // Format WhatsApp message with user details
    const text = `👋 *New Message from Portfolio Visitor*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n💬 *Message:*\n${message}\n\n🌐 Sent via Portfolio Website`
    const waLink = `https://wa.me/918787095611?text=${encodeURIComponent(text)}`
    setWhatsappUrl(waLink)

    try {
      // 1. Save to portfolio database
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      }).catch(() => {})

      // 2. Open WhatsApp with all user details ready to send
      window.open(waLink, '_blank')

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      window.open(waLink, '_blank')
      setStatus('success')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const getInputStyle = (field) => ({
    ...inputBase,
    border: `1px solid ${errors[field] ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
  })

  return (
    <section id="contact" style={{ background: 'var(--bg-section-alt)' }} aria-label="Contact section">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div {...fadeIn} className="text-center mb-16">
          <p className="section-label mb-2">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text-soft mb-4">Let's Build Something</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-5)' }}>
            Have a project, opportunity, or idea? Let's connect.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-4)' }}>
              I'm open to new opportunities, collaborations, and interesting projects.
              If you want to discuss something or just say hi, feel free to reach out.
            </p>
            {socials.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl group transition-all duration-200"
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-subtle-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-subtle)' }}
              >
                <div className="icon-box w-10 h-10">
                  <Icon size={17} />
                </div>
                <div>
                  <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-5)' }}>{label}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{value}</div>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.2 }}>
            <form
              onSubmit={handleSubmit} noValidate
              className="p-6 rounded-xl flex flex-col gap-4"
              style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-card)' }}
            >
              <div>
                <label htmlFor="name" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-5)' }}>Name</label>
                <input
                  id="name" name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="Your name" style={getInputStyle('name')}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.5)' : 'var(--border)'}
                />
                {errors.name && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-5)' }}>Email</label>
                <input
                  id="email" name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="your@email.com" style={getInputStyle('email')}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'var(--border)'}
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-5)' }}>Message</label>
                <textarea
                  id="message" name="message" rows={5} value={form.message} onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  style={{ ...getInputStyle('message'), resize: 'vertical', minHeight: '100px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
                  onBlur={e => e.target.style.borderColor = errors.message ? 'rgba(239,68,68,0.5)' : 'var(--border)'}
                />
                {errors.message && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.message}</p>}
              </div>

              <button
                type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(37,211,102,0.25)',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.92' }}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} />Forwarding...</>
                ) : (
                  <><WhatsappIcon size={15} color="#ffffff" /> Send Message (Opens WhatsApp)</>
                )}
              </button>

              {status === 'success' && (
                <div className="p-4 rounded-xl space-y-2 text-xs" style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)' }}>
                  <div className="flex items-center gap-2 font-semibold text-emerald-400 text-sm">
                    <CheckCircle size={16} /> Details Forwarded to WhatsApp!
                  </div>
                  <p style={{ color: 'var(--text-3)' }}>
                    Your message has been saved and opened directly in WhatsApp (<strong>+91 87870 95611</strong>). If WhatsApp did not open automatically, click below:
                  </p>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs text-white transition-all shadow-sm mt-1"
                      style={{ background: '#25D366' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <WhatsappIcon size={14} color="#ffffff" /> Open in WhatsApp (+91 87870 95611)
                    </a>
                  )}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
