import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Filter,
  FolderGit2,
} from 'lucide-react'
import { featuredProjects } from '../data/projects'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'

const filters = ['All', 'Full Stack', 'Backend', 'Frontend', 'Cloud']

const fadeIn = {
  initial: {
    opacity: 0,
    y: 24,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  viewport: {
    once: true,
    amount: 0.12,
  },
  transition: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
  },
}

export default function Projects() {
  const [projectsList, setProjectsList] = useState(featuredProjects)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch projects')
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data)
        } else {
          setProjectsList(featuredProjects)
        }
      })
      .catch((err) => {
        console.error('Fetch projects error, using static fallback:', err)
        setProjectsList(featuredProjects)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredProjects = projectsList.filter((p) => {
    if (activeFilter === 'All') return true
    
    // Support category search in array or string
    if (Array.isArray(p.category)) {
      return p.category.some(cat => cat.toLowerCase() === activeFilter.toLowerCase())
    }
    if (typeof p.category === 'string') {
      return p.category.toLowerCase().includes(activeFilter.toLowerCase())
    }
    return false
  })

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3)

  return (
    <>
      <section
        id="projects"
        aria-label="Projects section"
        className="relative py-16 sm:py-20 lg:py-24"
        style={{
          background: 'var(--bg-section-alt)',
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          
          {/* Header */}
          <motion.div
            {...fadeIn}
            className="text-center mb-10 sm:mb-12 lg:mb-14"
          >
            <p className="section-label mb-2 text-[10px] sm:text-[11px]">
              Work
            </p>
            <h2 className="text-[30px] sm:text-[36px] lg:text-[40px] font-bold tracking-[-0.035em] leading-tight gradient-text-soft">
              Featured Projects
            </h2>
            <p
              className="max-w-[470px] mx-auto mt-2.5 text-[12px] sm:text-[13px] lg:text-[14px] leading-relaxed"
              style={{
                color: 'var(--text-5)',
              }}
            >
              A selection of applications I've built while exploring full-stack development, backend engineering, and cloud deployment.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
                style={{
                  background: activeFilter === f ? 'var(--bg-tag)' : 'var(--bg-btn-ghost)',
                  border: activeFilter === f ? '1px solid var(--border-tag)' : '1px solid var(--border)',
                  color: activeFilter === f ? 'var(--accent)' : 'var(--text-5)',
                  cursor: 'pointer'
                }}
              >
                {f === 'All' && <Filter size={11} />}
                {f}
              </button>
            ))}
          </motion.div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[310px] sm:h-[330px] rounded-xl animate-pulse"
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <motion.div
              {...fadeIn}
              className="max-w-xl mx-auto text-center px-5 py-12 sm:py-14 rounded-xl"
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <FolderGit2
                size={28}
                className="mx-auto mb-3"
                style={{
                  color: 'var(--accent)',
                }}
              />
              <h3 className="text-sm sm:text-base font-semibold" style={{ color: 'var(--text-1)' }}>
                No projects found
              </h3>
              <p className="mt-1.5 text-[11px] sm:text-xs" style={{ color: 'var(--text-5)' }}>
                No projects match the selected category filter.
              </p>
            </motion.div>
          )}

          {/* Project Grid */}
          {!loading && filteredProjects.length > 0 && (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
                {displayedProjects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                  >
                    <ProjectCard project={project} onViewDetails={setSelectedProject} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {/* See All Projects Button */}
          {!loading && filteredProjects.length > 3 && (
            <motion.div
              {...fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mt-12"
            >
              <button
                onClick={() => setShowAll(prev => !prev)}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold rounded-lg transition-all duration-200 group"
                style={{
                  background: 'var(--bg-btn-ghost)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-3)',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.color = 'var(--text-1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-3)'
                }}
              >
                {showAll ? 'Show Less' : 'See All Projects'}
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  )
}