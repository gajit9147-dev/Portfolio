import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, PenLine, X, Calendar, Clock, ArrowRight } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

// Simple Markdown to HTML formatter
function renderMarkdown(text) {
  if (!text) return ''
  
  // Basic parsing for headers, code blocks, bullet points, inline code
  let html = text
    // Escape HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Restore markdown syntax
    .replace(/^# (.*$)/gim, '<h1 class="text-xl sm:text-2xl font-bold mt-6 mb-3" style="color:var(--text-1); border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-base sm:text-lg font-semibold mt-5 mb-2.5" style="color:var(--text-2)">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-sm sm:text-base font-semibold mt-4 mb-2" style="color:var(--text-2)">$1</h3>')
    // Code blocks
    .replace(/```javascript([\s\S]*?)```/gim, '<pre class="bg-black/50 border border-slate-800/80 p-4 rounded-xl my-4 overflow-x-auto font-mono text-xs leading-relaxed" style="color:#38bdf8">$1</pre>')
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-black/50 border border-slate-800/80 p-4 rounded-xl my-4 overflow-x-auto font-mono text-xs leading-relaxed" style="color:var(--text-3)">$1</pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-800/40 px-1.5 py-0.5 rounded font-mono text-xs" style="color:var(--accent)">$1</code>')
    // Bullet lists
    .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc mb-1.5">$1</li>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Double newlines to paragraphs
    .replace(/\n\n/g, '<p class="mb-4"></p>')

  return <div dangerouslySetInnerHTML={{ __html: html }} className="leading-relaxed text-xs sm:text-sm text-slate-300 font-sans" />
}

export default function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBlog, setSelectedBlog] = useState(null)

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fetch blogs error:', err)
        setLoading(false)
      })
  }, [])

  return (
    <section id="blog" aria-label="Blog section">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <motion.div {...fadeIn} className="text-center mb-12">
          <p className="section-label mb-2">Writing</p>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text-soft mb-3">Blog</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-5)' }}>
            Writing about development, backend engineering, APIs, cloud deployment, and things I'm learning.
          </p>
        </motion.div>

        {loading ? (
          // Skeletons
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="p-6 rounded-xl border animate-pulse flex flex-col justify-between h-48" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-4 bg-slate-800/40 rounded w-16" />
                    <div className="h-4 bg-slate-800/40 rounded w-12" />
                  </div>
                  <div className="h-5 bg-slate-800/60 rounded w-5/6 mb-2" />
                  <div className="h-5 bg-slate-800/60 rounded w-2/3" />
                </div>
                <div className="h-4 bg-slate-800/40 rounded w-24 mt-4" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <motion.div
            {...fadeIn} transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-lg mx-auto text-center p-10 rounded-2xl"
            style={{ background: 'var(--bg-subtle)', border: '1px dashed var(--border-dashed)' }}
          >
            <div className="icon-box w-14 h-14 rounded-2xl mx-auto mb-5">
              <PenLine size={24} />
            </div>
            <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text-1)' }}>Coming Soon</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-5)' }}>
              I'll be sharing articles and notes on full-stack development, backend architecture,
              Docker, AWS, and the things I'm learning as I build real projects.
            </p>
          </motion.div>
        ) : (
          // Grid
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            {blogs.map((blog, i) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="p-6 rounded-xl border flex flex-col justify-between gap-6 group transition-all duration-200 cursor-pointer"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow), var(--shadow-card)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-card)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => setSelectedBlog(blog)}
              >
                <div>
                  <div className="flex items-center gap-3 text-[10.5px] font-medium mb-3" style={{ color: 'var(--text-5)' }}>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {blog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {blog.readTime}</span>
                  </div>

                  <h3 className="text-[15px] font-bold group-hover:text-[var(--accent)] transition-colors duration-200 leading-snug mb-2" style={{ color: 'var(--text-1)' }}>
                    {blog.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {blog.tags.map(tag => (
                      <span key={tag} className="tech-pill text-[9.5px]">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: 'var(--text-3)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  Read Article
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* READING MODAL */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-2xl max-h-[85vh] rounded-2xl border flex flex-col overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)', boxShadow: 'var(--shadow-card)' }}
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-5 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-subtle)' }}>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} style={{ color: 'var(--accent)' }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Article Reader</span>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-500/10 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Article Content */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                <div className="flex items-center gap-3 text-[11px] font-medium mb-4" style={{ color: 'var(--text-5)' }}>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {selectedBlog.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {selectedBlog.readTime}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black mb-6 leading-tight" style={{ color: 'var(--text-1)' }}>
                  {selectedBlog.title}
                </h1>

                {selectedBlog.image && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border" style={{ borderColor: 'var(--border-subtle)' }}>
                    <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Article Body */}
                <div className="article-body">
                  {renderMarkdown(selectedBlog.content)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
