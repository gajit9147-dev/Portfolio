import { motion } from 'framer-motion'
import { Code2, Server, Cloud, Shield, Database, Layers } from 'lucide-react'

const stats = [
  { label: 'Projects Built', value: '3+',        icon: Layers },
  { label: 'Technologies',   value: '15+',        icon: Code2 },
  { label: 'Current Focus',  value: 'Full-Stack', icon: Server },
]

const focusAreas = [
  { icon: Code2,    label: 'Full-Stack Dev',  desc: 'React, Node.js, Express' },
  { icon: Server,   label: 'Backend & APIs',  desc: 'REST APIs, Middleware' },
  { icon: Shield,   label: 'Auth & Security', desc: 'JWT, bcrypt, Protected Routes' },
  { icon: Database, label: 'Databases',       desc: 'MongoDB, MySQL' },
  { icon: Cloud,    label: 'Cloud & DevOps',  desc: 'Docker, AWS, Nginx' },
]

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function About() {
  return (
    <section id="about" aria-label="About section">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Section header */}
        <motion.div {...fadeIn} className="text-center mb-16">
          <p className="section-label mb-2">About Me</p>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text-soft">Who I Am</h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">

          {/* Left — Bio + stats */}
          <motion.div {...fadeIn} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-[15px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
              <p>
                I'm a full-stack developer focused on building{' '}
                <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>real-world software applications</span>{' '}—
                from clean, responsive frontends to secure, well-structured backends.
              </p>
              <p>
                My primary interests lie in{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 500 }}>backend engineering</span>: designing REST APIs,
                implementing JWT authentication, structuring MongoDB databases, and deploying applications
                using Docker and AWS.
              </p>
              <p>
                I approach every project by thinking about{' '}
                <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>architecture first</span> — how the frontend
                communicates with the API, how the API protects resources, and how the whole system gets
                deployed reliably to the cloud.
              </p>
              <p>
                Currently building{' '}
                <span style={{ color: 'var(--accent-2)', fontWeight: 500 }}>InnerVoice</span>, a full-stack
                secure notes application, while continuing to sharpen my skills in backend development and cloud.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-4 rounded-xl"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-card)' }}
                >
                  <Icon size={18} className="mb-2" style={{ color: 'var(--accent)' }} />
                  <div className="text-xl font-bold gradient-text mb-1">{value}</div>
                  <div className="text-[11px] leading-tight" style={{ color: 'var(--text-5)' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Focus areas */}
          <motion.div {...fadeIn} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-3">
            <h3 className="text-[11px] font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--text-5)' }}>
              Focus Areas
            </h3>
            {focusAreas.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.07 * i }}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-default transition-all duration-200"
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.background = 'var(--bg-subtle-hover)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.background = 'var(--bg-subtle)'
                }}
              >
                <div className="icon-box w-9 h-9 rounded-lg flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-5)' }}>{desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
