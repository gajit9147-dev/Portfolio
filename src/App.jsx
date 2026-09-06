import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Projects from './components/Projects'
import Skills from './components/Skills'
import GitHub from './components/GitHub'
import Blog from './components/Blog'
import Contact from './components/Contact'
import LifeMoments from './components/LifeMoments'
import Friends from './components/Friends'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const AdminDashboard = lazy(() => import('./components/AdminDashboard'))

export default function App() {
  const [theme, setTheme] = useState(() => {
    // Restore preference from localStorage on first load
    return localStorage.getItem('theme') || 'dark'
  })

  const [isAdminView, setIsAdminView] = useState(() => window.location.pathname === '/admin')

  // Stamp data-theme on <html> and persist preference whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Track popstate location events for route toggles
  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminView(window.location.pathname === '/admin')
    }
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  if (isAdminView) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-1)' }}>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center text-sm font-medium" style={{ color: 'var(--text-4)' }}>
            Loading Dashboard...
          </div>
        }>
          <AdminDashboard
            onBack={() => {
              window.history.pushState({}, '', '/')
              setIsAdminView(false)
            }}
          />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-1)' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Skills />
        <GitHub />
        <Blog />
        <Contact />
        <LifeMoments />
        <Friends />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
