import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, FileText, Camera, Upload, Trash2, CheckCircle } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
  { label: 'Moments', href: '#moments' },
  { label: 'Friends', href: '#friends' },
]

export default function Navbar({ theme, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [avatarPhoto, setAvatarPhoto] = useState(() => localStorage.getItem('user_avatar') || '')
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [tempAvatarUrl, setTempAvatarUrl] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarAlert, setAvatarAlert] = useState('')
  const avatarFileInputRef = useRef(null)
  const isClickScrollingRef = useRef(false)
  const clickScrollTimerRef = useRef(null)

  /* ============================================
     FETCH DYNAMIC AVATAR
  ============================================ */

  useEffect(() => {
    fetch('/api/uploads/avatar')
      .then((res) => res.json())
      .then((data) => {
        if (data?.avatar) {
          setAvatarPhoto(data.avatar)
          localStorage.setItem('user_avatar', data.avatar)
        }
      })
      .catch(() => { })
  }, [])

  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarUploading(true)
    setAvatarAlert('')
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const res = await fetch('/api/uploads/avatar-upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || 'Upload failed')
      }
      setAvatarPhoto(data.avatar)
      setTempAvatarUrl(data.avatar)
      localStorage.setItem('user_avatar', data.avatar)
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: data.avatar }))
      setAvatarAlert('Photo uploaded and updated successfully!')
      setTimeout(() => {
        setAvatarAlert('')
        setIsAvatarModalOpen(false)
      }, 1500)
    } catch (err) {
      console.error(err)
      setAvatarAlert(err.message || 'Upload error. Please try again.')
    } finally {
      setAvatarUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSaveAvatarUrl = async (urlToSave) => {
    const finalUrl = urlToSave !== undefined ? urlToSave : tempAvatarUrl.trim()
    try {
      await fetch('/api/uploads/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: finalUrl }),
      })
    } catch (err) {
      console.warn('Backend avatar save error, saving locally:', err)
    }

    setAvatarPhoto(finalUrl)
    localStorage.setItem('user_avatar', finalUrl)
    window.dispatchEvent(new CustomEvent('avatar-updated', { detail: finalUrl }))
    setAvatarAlert(finalUrl ? 'Logo photo updated!' : 'Photo removed (Reset to initials)')
    setTimeout(() => {
      setAvatarAlert('')
      setIsAvatarModalOpen(false)
    }, 1500)
  }

  /* ============================================
     ACTIVE SECTION + SCROLL
  ============================================ */

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // When smooth-scrolling due to a direct click, don't overwrite the activeSection
      if (isClickScrollingRef.current) return

      // Map sections in real DOM top-to-bottom order
      const sectionElements = navLinks
        .map((link) => {
          const id = link.href.slice(1)
          const el = document.getElementById(id)
          return { id, top: el ? el.offsetTop : 0 }
        })
        .filter((item) => item.id === 'home' || item.top > 0)
        .sort((a, b) => a.top - b.top)

      let currentSection = 'home'

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        if (window.scrollY >= sectionElements[i].top - 140) {
          currentSection = sectionElements[i].id
          break
        }
      }

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (clickScrollTimerRef.current) clearTimeout(clickScrollTimerRef.current)
    }
  }, [])

  /* ============================================
     CLOSE MENU OUTSIDE CLICK
  ============================================ */

  useEffect(() => {
    const onOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMobileOpen(false)
      }
    }

    if (mobileOpen) {
      document.addEventListener('mousedown', onOutside)
    }

    return () => {
      document.removeEventListener('mousedown', onOutside)
    }
  }, [mobileOpen])

  /* ============================================
     SMOOTH SCROLL WITH NAVBAR OFFSET
  ============================================ */

  const scrollTo = (href) => {
    setMobileOpen(false)
    const id = href.slice(1)
    setActiveSection(id)

    isClickScrollingRef.current = true
    if (clickScrollTimerRef.current) clearTimeout(clickScrollTimerRef.current)
    clickScrollTimerRef.current = setTimeout(() => {
      isClickScrollingRef.current = false
    }, 850)

    const element = document.getElementById(id)
    if (element) {
      const navOffset = 76
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <motion.header
      initial={{
        y: -60,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        px-2
        sm:px-3
        lg:px-4
      "
    >
      {/* ==========================================
          NAVBAR CONTAINER
      ========================================== */}

      <div
        className="
          relative
          mx-auto
          mt-2
          w-full
          max-w-6xl
          overflow-visible
          rounded-[14px]
          sm:rounded-[15px]
        "
        style={{
          background: isScrolled
            ? 'var(--nav-bg)'
            : 'rgba(8,12,20,0.82)',

          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',

          border:
            '1px solid var(--border)',

          boxShadow: isScrolled
            ? '0 10px 30px rgba(0,0,0,0.25)'
            : '0 5px 20px rgba(0,0,0,0.12)',

          transition:
            'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >

        {/* ========================================
            BOTTOM ACCENT LINE
        ======================================== */}

        <div
          className="
            absolute
            bottom-0
            left-5
            right-5
            h-px
            pointer-events-none
          "
          style={{
            borderRadius: '999px',

            background:
              'linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent)',

            opacity: isScrolled
              ? 0.65
              : 0.3,
          }}
        />


        {/* ========================================
            DESKTOP NAV
            >= 1280px
        ======================================== */}

        <div
          className="
            hidden
            xl:grid
            h-[58px]
            grid-cols-[1fr_auto_1fr]
            items-center
            px-3
          "
        >

          {/* ======================================
              BRAND
          ====================================== */}

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#home')
            }}
            className="
              justify-self-start
              flex
              items-center
              gap-2.5
              flex-shrink-0
              group
              select-none
            "
            aria-label="Ajeet Gupta — Home"
          >

            {/* Avatar with Photo & Edit Trigger */}

            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setTempAvatarUrl(avatarPhoto)
                setIsAvatarModalOpen(true)
              }}
              className="
                relative
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                flex-shrink-0
                cursor-pointer
                group/avatar
              "
              title="Click to change or edit logo photo"
            >
              <div
                className="
                  w-full
                  h-full
                  rounded-full
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  text-[11px]
                  font-bold
                  transition-transform
                  duration-200
                  group-hover/avatar:scale-105
                  border
                "
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--accent-2))',

                  color: '#080c14',

                  boxShadow:
                    '0 0 13px var(--glow-cyan)',

                  borderColor: 'var(--border-hover)',

                  letterSpacing:
                    '0.02em',
                }}
              >
                {avatarPhoto ? (
                  <img
                    src={avatarPhoto}
                    alt="Ajeet Gupta"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  'AG'
                )}
              </div>

              {/* Hover Edit Overlay */}
              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-black/60
                  opacity-0
                  group-hover/avatar:opacity-100
                  transition-opacity
                  duration-200
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <Camera size={12} />
              </div>
            </div>


            {/* Name */}

            <div
              className="
                flex
                flex-col
                justify-center
              "
              style={{
                gap: '3px',
              }}
            >
              <span
                className="
                  text-[13px]
                  font-semibold
                  leading-none
                  whitespace-nowrap
                "
                style={{
                  color:
                    'var(--text-1)',
                }}
              >
                Ajeet Gupta
              </span>

              <span
                className="
                  text-[9.5px]
                  font-medium
                  leading-none
                  whitespace-nowrap
                "
                style={{
                  color:
                    'var(--accent)',
                }}
              >
                Full-Stack Developer
              </span>
            </div>
          </a>


          {/* ======================================
              DESKTOP NAVIGATION
          ====================================== */}

          <nav
            aria-label="Main navigation"
            className="
              justify-self-center
              flex
              items-center
            "
            style={{
              padding:
                '3px 4px',

              gap:
                '1px',

              borderRadius:
                '10px',

              background:
                'var(--bg-btn-ghost)',

              border:
                '1px solid var(--border)',

              whiteSpace:
                'nowrap',
            }}
          >

            {navLinks.map((link) => {
              const id =
                link.href.slice(1)

              const active =
                activeSection === id

              return (
                <a
                  key={id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(link.href)
                  }}
                  aria-current={
                    active
                      ? 'page'
                      : undefined
                  }
                  className="
                    relative
                    flex
                    items-center
                    justify-center
                    whitespace-nowrap
                    select-none
                    transition-all
                    duration-200
                  "
                  style={{
                    padding:
                      '6px 7px',

                    minHeight:
                      '28px',

                    borderRadius:
                      '7px',

                    fontSize:
                      '11px',

                    lineHeight:
                      '1',

                    fontWeight:
                      active ? 500 : 450,

                    color: active
                      ? 'var(--accent)'
                      : 'var(--text-5)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color =
                        'var(--text-2)'

                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.035)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color =
                        'var(--text-5)'

                      e.currentTarget.style.background =
                        'transparent'
                    }
                  }}
                >

                  {active && (
                    <motion.span
                      layoutId="navbar-active"
                      className="
                        absolute
                        inset-0
                        pointer-events-none
                      "
                      style={{
                        borderRadius:
                          '7px',

                        background:
                          'var(--bg-tag)',

                        border:
                          '1px solid var(--border-tag)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <span
                    className="
                      relative
                      z-10
                    "
                  >
                    {link.label}
                  </span>
                </a>
              )
            })}
          </nav>


          {/* ======================================
              DESKTOP ACTIONS
          ====================================== */}

          <div
            className="
              justify-self-end
              flex
              items-center
              gap-2
            "
          >

            {/* Theme */}

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="
                w-9
                h-9
                rounded-[10px]
                flex
                items-center
                justify-center
                transition-all
                duration-200
              "
              style={{
                color:
                  'var(--text-5)',

                background:
                  'var(--bg-btn-ghost)',

                border:
                  '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  'var(--accent)'

                e.currentTarget.style.borderColor =
                  'var(--border-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  'var(--text-5)'

                e.currentTarget.style.borderColor =
                  'var(--border)'
              }}
            >
              {theme === 'dark' ? (
                <Sun
                  size={14}
                  strokeWidth={2}
                />
              ) : (
                <Moon
                  size={14}
                  strokeWidth={2}
                />
              )}
            </button>


            {/* Resume */}

            <a
              href="/resume"
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState({}, '', '/resume')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
              className="
                flex
                items-center
                justify-center
                gap-1.5
                h-9
                px-3
                rounded-[10px]
                text-[11.5px]
                font-semibold
                transition-all
                duration-200
                select-none
              "
              style={{
                color:
                  'var(--accent)',

                background:
                  'var(--bg-tag)',

                border:
                  '1px solid var(--border-tag)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'var(--bg-tag-hover)'

                e.currentTarget.style.borderColor =
                  'var(--border-hover)'

                e.currentTarget.style.boxShadow =
                  'var(--shadow-glow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'var(--bg-tag)'

                e.currentTarget.style.borderColor =
                  'var(--border-tag)'

                e.currentTarget.style.boxShadow =
                  'none'
              }}
            >
              <FileText
                size={13}
                strokeWidth={2}
              />

              Resume
            </a>
          </div>
        </div>


        {/* ========================================
            TABLET + MOBILE NAV
            < 1280px
        ======================================== */}

        <div
          className="
            xl:hidden
            h-[56px]
            sm:h-[56px]
            flex
            items-center
            justify-between
            px-2.5
            sm:px-3
          "
        >

          {/* ======================================
              MOBILE/TABLET BRAND
          ====================================== */}

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#home')
            }}
            className="
              flex
              items-center
              gap-2
              sm:gap-2.5
              min-w-0
              select-none
            "
          >

            {/* Mobile Avatar with Photo & Edit Trigger */}

            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setTempAvatarUrl(avatarPhoto)
                setIsAvatarModalOpen(true)
              }}
              className="
                relative
                w-8
                h-8
                sm:w-8
                sm:h-8
                rounded-full
                flex
                items-center
                justify-center
                flex-shrink-0
                cursor-pointer
                group/mavatar
              "
              title="Click to edit logo photo"
            >
              <div
                className="
                  w-full
                  h-full
                  rounded-full
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  text-[10px]
                  sm:text-[11px]
                  font-bold
                  border
                "
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent), var(--accent-2))',

                  color:
                    '#080c14',

                  boxShadow:
                    '0 0 12px var(--glow-cyan)',

                  borderColor: 'var(--border-hover)',
                }}
              >
                {avatarPhoto ? (
                  <img
                    src={avatarPhoto}
                    alt="Ajeet Gupta"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  'AG'
                )}
              </div>

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-black/60
                  opacity-0
                  group-hover/mavatar:opacity-100
                  transition-opacity
                  duration-200
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <Camera size={11} />
              </div>
            </div>


            {/* Brand text */}

            <div
              className="
                flex
                flex-col
                justify-center
                min-w-0
              "
              style={{
                gap: '3px',
              }}
            >
              <span
                className="
                  text-[12px]
                  sm:text-[13px]
                  font-semibold
                  leading-none
                  whitespace-nowrap
                "
                style={{
                  color:
                    'var(--text-1)',
                }}
              >
                Ajeet Gupta
              </span>

              <span
                className="
                  text-[9px]
                  sm:text-[9.5px]
                  leading-none
                  whitespace-nowrap
                "
                style={{
                  color:
                    'var(--accent)',
                }}
              >
                Full-Stack Developer
              </span>
            </div>
          </a>


          {/* ======================================
              MOBILE/TABLET ACTIONS
          ====================================== */}

          <div
            className="
              flex
              items-center
              gap-1.5
              sm:gap-2
              flex-shrink-0
            "
          >

            {/* Theme */}

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="
                w-[34px]
                h-[34px]
                sm:w-9
                sm:h-9
                rounded-[9px]
                sm:rounded-[10px]
                flex
                items-center
                justify-center
                transition-all
                duration-200
              "
              style={{
                color:
                  'var(--text-5)',

                background:
                  'var(--bg-btn-ghost)',

                border:
                  '1px solid var(--border)',
              }}
            >
              {theme === 'dark' ? (
                <Sun
                  size={14}
                  strokeWidth={2}
                />
              ) : (
                <Moon
                  size={14}
                  strokeWidth={2}
                />
              )}
            </button>


            {/* Hamburger */}

            <button
              onClick={() =>
                setMobileOpen(
                  (value) => !value
                )
              }
              aria-label={
                mobileOpen
                  ? 'Close menu'
                  : 'Open menu'
              }
              aria-expanded={
                mobileOpen
              }
              className="
                w-[34px]
                h-[34px]
                sm:w-9
                sm:h-9
                rounded-[9px]
                sm:rounded-[10px]
                flex
                items-center
                justify-center
                transition-all
                duration-200
              "
              style={{
                color: mobileOpen
                  ? 'var(--accent)'
                  : 'var(--text-5)',

                background:
                  'var(--bg-btn-ghost)',

                border:
                  `1px solid ${mobileOpen
                    ? 'var(--border-tag)'
                    : 'var(--border)'
                  }`,
              }}
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.span
                  key={
                    mobileOpen
                      ? 'close'
                      : 'menu'
                  }
                  initial={{
                    opacity: 0,
                    rotate: -45,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 45,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                >
                  {mobileOpen ? (
                    <X
                      size={16}
                      strokeWidth={2.2}
                    />
                  ) : (
                    <Menu
                      size={16}
                      strokeWidth={2.2}
                    />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>


        {/* ========================================
            TABLET / MOBILE MENU
        ======================================== */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              ref={menuRef}
              key="mobile-menu"
              initial={{
                opacity: 0,
                height: 0,
                y: -6,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
                y: -6,
              }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
              className="
                absolute
                left-0
                right-0
                top-[60px]
                sm:top-[60px]
                overflow-hidden
                rounded-[13px]
              "
              style={{
                background:
                  'var(--nav-bg)',

                backdropFilter:
                  'blur(22px)',

                WebkitBackdropFilter:
                  'blur(22px)',

                border:
                  '1px solid var(--border)',

                boxShadow:
                  '0 18px 40px rgba(0,0,0,0.32)',
              }}
            >

              <div
                className="
                  p-2
                  sm:p-3
                "
              >

                {navLinks.map((link) => {
                  const id =
                    link.href.slice(1)

                  const active =
                    activeSection === id

                  return (
                    <a
                      key={id}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollTo(link.href)
                      }}
                      className="
                        flex
                        items-center
                        w-full
                        text-[12px]
                        sm:text-[13px]
                        font-medium
                        transition-all
                        duration-150
                      "
                      style={{
                        minHeight:
                          '38px',

                        padding:
                          '8px 11px',

                        marginBottom:
                          '2px',

                        borderRadius:
                          '8px',

                        color: active
                          ? 'var(--accent)'
                          : 'var(--text-5)',

                        background: active
                          ? 'var(--bg-tag)'
                          : 'transparent',

                        border: active
                          ? '1px solid var(--border-tag)'
                          : '1px solid transparent',
                      }}
                    >
                      {link.label}
                    </a>
                  )
                })}


                {/* Divider */}

                <div
                  className="
                    h-px
                    my-2
                  "
                  style={{
                    background:
                      'var(--border-subtle)',
                  }}
                />


                {/* Resume */}

                <a
                  href="/resume"
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileOpen(false)
                    window.history.pushState({}, '', '/resume')
                    window.dispatchEvent(new PopStateEvent('popstate'))
                  }}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    text-[12px]
                    sm:text-[13px]
                    font-semibold
                    rounded-[9px]
                  "
                  style={{
                    minHeight:
                      '38px',

                    padding:
                      '8px 14px',

                    color:
                      'var(--accent)',

                    background:
                      'var(--bg-tag)',

                    border:
                      '1px solid var(--border-tag)',
                  }}
                >
                  <FileText
                    size={13}
                    strokeWidth={2}
                  />

                  Resume & Builder Studio
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* =========================================
          EDIT LOGO / PROFILE PHOTO MODAL
      ========================================= */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsAvatarModalOpen(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 18 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-2xl overflow-hidden relative flex flex-col"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-hover)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6), var(--shadow-glow)',
              }}
            >
              {/* Header */}
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sky-400"
                    style={{ background: 'var(--bg-tag)' }}
                  >
                    <Camera size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
                      Edit Logo / Profile Photo
                    </h3>
                    <p className="text-[11px]" style={{ color: 'var(--text-5)' }}>
                      Personalize your logo photo across your portfolio
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  style={{ background: 'var(--bg-btn-ghost)' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Feedback Alert */}
              {avatarAlert && (
                <div className="mx-5 mt-4 p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium"
                  style={{
                    background: 'var(--bg-success)',
                    color: 'var(--text-success)',
                    border: '1px solid var(--border-success)',
                  }}
                >
                  <CheckCircle size={14} />
                  <span>{avatarAlert}</span>
                </div>
              )}

              {/* Body */}
              <div className="p-5 flex flex-col gap-4">
                {/* Live Avatar Preview */}
                <div className="flex flex-col items-center justify-center py-3">
                  <div
                    className="relative w-24 h-24 rounded-full p-1 border-2"
                    style={{
                      borderColor: 'var(--accent)',
                      boxShadow: '0 0 25px var(--glow-cyan)',
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center font-bold text-2xl text-slate-950"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
                    >
                      {tempAvatarUrl ? (
                        <img
                          src={tempAvatarUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        'AG'
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] mt-2 font-medium" style={{ color: 'var(--text-4)' }}>
                    Logo Preview
                  </span>
                </div>

                {/* Upload File Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                      color: '#080c14',
                      boxShadow: '0 4px 14px var(--glow-cyan)',
                    }}
                  >
                    <Upload size={14} />
                    <span>{avatarUploading ? 'Uploading Photo...' : 'Upload Photo from Device'}</span>
                  </button>
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileUpload}
                  />
                  <p className="text-[10px] text-center mt-1.5" style={{ color: 'var(--text-5)' }}>
                    Supports JPG, PNG, WEBP, or SVG
                  </p>
                </div>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                  <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-6)' }}>
                    OR PASTE IMAGE URL
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-3)' }}>
                    Image Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://... (e.g. GitHub avatar, Google drive, Unsplash)"
                    value={tempAvatarUrl}
                    onChange={(e) => setTempAvatarUrl(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                    style={{
                      background: 'var(--bg-code)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-1)',
                    }}
                  />
                </div>

                {/* Quick actions: Reset to AG or Apply URL */}
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTempAvatarUrl('')
                      handleSaveAvatarUrl('')
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Reset to "AG" Initials</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                      style={{ background: 'var(--bg-btn-ghost)', color: 'var(--text-4)' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveAvatarUrl()}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      style={{
                        background: 'var(--accent)',
                        color: '#080c14',
                      }}
                    >
                      Apply Photo
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}