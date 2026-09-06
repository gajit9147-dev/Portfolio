import { motion } from 'framer-motion'
import { ExternalLink, Info } from 'lucide-react'
import { GithubIcon } from './Icons'

function ProjectImage({ project }) {
  const colorMap = {
    innervoice:          { from: '#0b1329', to: '#1c2541',  accent: 'var(--accent)' },
    'rest-api-backend':  { from: '#0c0b29', to: '#201c41',  accent: 'var(--accent-2)' },
    'cloud-deployment':  { from: '#071529', to: '#152b41',  accent: '#38bdf8' },
  }
  const c = colorMap[project.id] || { from: '#080c14', to: '#0d1727', accent: 'var(--accent)' }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${c.accent}33 1px, transparent 1px), linear-gradient(90deg, ${c.accent}33 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative z-10 text-center px-4">
        <div
          className="text-2xl font-bold tracking-tight mb-1 font-mono uppercase"
          style={{ color: c.accent, textShadow: `0 0 20px ${c.accent}44` }}
        >
          {project.title}
        </div>
        <div className="text-[10px] font-medium opacity-50 uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          {project.subtitle || project.tags.slice(0, 3).join(' · ')}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`, opacity: 0.4 }} />
    </div>
  )
}

export default function ProjectCard({ project, onViewDetails }) {
  const isCompleted = project.status === 'Completed'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full overflow-hidden rounded-xl transition-all duration-300 group"
      style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-glow), var(--shadow-card)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Image Area */}
      <div className="relative h-44 overflow-hidden flex-shrink-0 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            loading="lazy"
          />
        ) : (
          <ProjectImage project={project} />
        )}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider"
            style={{
              color: isCompleted ? 'var(--text-success)' : 'var(--text-5)',
              background: isCompleted ? 'var(--bg-success)' : 'var(--bg-btn-ghost)',
              border: `1px solid ${isCompleted ? 'var(--border-success)' : 'var(--border)'}`,
            }}
          >
            {project.status || 'Project'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
              {project.title}
            </h3>
            {project.category && (
              <span className="text-[9px] uppercase tracking-wider font-semibold opacity-60" style={{ color: 'var(--text-5)' }}>
                {Array.isArray(project.category) ? project.category[0] : project.category}
              </span>
            )}
          </div>
          {project.subtitle && (
            <p className="text-[10px] font-medium mb-2.5" style={{ color: 'var(--accent)' }}>
              {project.subtitle}
            </p>
          )}
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-4)' }}>
            {project.description}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tech-pill text-[9px] font-medium">
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="tech-pill text-[9px] font-medium opacity-60">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Actions Row */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <button
            onClick={() => onViewDetails(project)}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
            style={{ color: 'var(--text-5)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-5)'}
            aria-label={`View details for ${project.title}`}
          >
            View Details <Info size={13} />
          </button>
          
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub Repository for ${project.title}`}
                style={{ color: 'var(--text-5)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-5)'}
              >
                <GithubIcon size={14} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live Demo for ${project.title}`}
                style={{ color: 'var(--text-5)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-5)'}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
