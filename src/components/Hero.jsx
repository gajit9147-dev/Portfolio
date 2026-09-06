import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  Mail,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './Icons'

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Hero() {
  const scrollTo = (id) => {
    const element = document.getElementById(id)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <section
      id="home"
      aria-label="Home section"
      className="
        relative
        min-h-[100svh]
        w-full
        flex
        flex-col
        justify-center
        items-center
        overflow-hidden
        pt-[84px]
        pb-12
        sm:pt-[92px]
        sm:pb-16
        lg:pt-[100px]
        lg:pb-20
      "
    >

      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[22%]
          -translate-x-1/2
          w-[280px]
          h-[280px]
          sm:w-[420px]
          sm:h-[420px]
          lg:w-[560px]
          lg:h-[560px]
          rounded-full
          blur-[100px]
          lg:blur-[130px]
        "
        style={{
          background:
            'radial-gradient(circle, var(--glow-cyan), transparent 68%)',
          opacity: 0.14,
        }}
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-100px]
          bottom-[5%]
          w-[260px]
          h-[260px]
          sm:w-[360px]
          sm:h-[360px]
          rounded-full
          blur-[100px]
        "
        style={{
          background:
            'radial-gradient(circle, var(--glow-purple), transparent 70%)',
          opacity: 0.08,
        }}
      />


      {/* =========================================
          CONTENT
      ========================================= */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-6xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
          flex
          flex-col
          items-center
        "
      >

        <div
          className="
            w-full
            max-w-4xl
            mx-auto
            text-center
            flex
            flex-col
            items-center
          "
        >

          {/* =====================================
              STATUS
          ===================================== */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="
              flex
              justify-center
              mb-5
              sm:mb-6
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                text-[10px]
                sm:text-[11px]
                font-medium
              "
              style={{
                color: 'var(--text-4)',
                background: 'var(--bg-tag)',
                border:
                  '1px solid var(--border-tag)',
              }}
            >
              <span
                className="
                  relative
                  flex
                  w-1.5
                  h-1.5
                "
              >
                <span
                  className="
                    absolute
                    inline-flex
                    w-full
                    h-full
                    rounded-full
                    opacity-60
                    animate-ping
                  "
                  style={{
                    background:
                      'var(--accent)',
                  }}
                />

                <span
                  className="
                    relative
                    inline-flex
                    w-1.5
                    h-1.5
                    rounded-full
                  "
                  style={{
                    background:
                      'var(--accent)',
                  }}
                />
              </span>

              Available for opportunities
            </div>
          </motion.div>


          {/* =====================================
              MAIN HEADING
          ===================================== */}

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.08,
            }}
            className="
              font-bold
              tracking-[-0.04em]
              leading-[1.02]
              text-[36px]
              sm:text-[50px]
              md:text-[60px]
              lg:text-[72px]
              xl:text-[80px]
            "
            style={{
              color:
                'var(--text-1)',
            }}
          >
            Building
            <br />

            <span className="gradient-text">
              Digital Experiences
            </span>
          </motion.h1>


          {/* =====================================
              DESCRIPTION
          ===================================== */}

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.16,
            }}
            className="
              max-w-[620px]
              mx-auto
              mt-6
              sm:mt-7
              text-[13px]
              sm:text-[14px]
              lg:text-[15px]
              leading-[1.75]
            "
            style={{
              color:
                'var(--text-4)',
            }}
          >
            I'm Ajeet Gupta, a full-stack developer focused
            on building reliable, secure and scalable web
            applications with modern technologies.
          </motion.p>


          {/* =====================================
              TECHNOLOGY LINE
          ===================================== */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.22,
            }}
            className="
              flex
              flex-wrap
              justify-center
              items-center
              gap-2
              mt-5
              sm:mt-6
            "
          >
            {[
              'React',
              'Node.js',
              'Express',
              'MongoDB',
              'Docker',
              'AWS',
            ].map((technology) => (
              <span
                key={technology}
                className="
                  px-2.5
                  py-1
                  rounded-md
                  text-[9.5px]
                  sm:text-[10px]
                  font-medium
                "
                style={{
                  color:
                    'var(--text-5)',

                  background:
                    'var(--bg-subtle)',

                  border:
                    '1px solid var(--border-subtle)',
                }}
              >
                {technology}
              </span>
            ))}
          </motion.div>


          {/* =====================================
              CTA BUTTONS
          ===================================== */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.28,
            }}
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-2.5
              mt-8
              sm:mt-9
            "
          >

            {/* View Projects */}

            <button
              onClick={() =>
                scrollTo('projects')
              }
              className="
                w-full
                sm:w-auto
                min-w-[132px]
                h-10
                px-4
                rounded-[10px]
                inline-flex
                items-center
                justify-center
                gap-2
                text-[11.5px]
                font-semibold
                transition-all
                duration-200
              "
              style={{
                color:
                  '#080c14',

                background:
                  'linear-gradient(135deg, var(--accent), var(--accent-2))',

                boxShadow:
                  '0 8px 24px var(--glow-cyan)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'translateY(-2px)'

                e.currentTarget.style.boxShadow =
                  '0 12px 30px var(--glow-cyan)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  'translateY(0)'

                e.currentTarget.style.boxShadow =
                  '0 8px 24px var(--glow-cyan)'
              }}
            >
              View Projects

              <ArrowUpRight
                size={14}
                strokeWidth={2.2}
              />
            </button>


            {/* Contact */}

            <button
              onClick={() =>
                scrollTo('contact')
              }
              className="
                w-full
                sm:w-auto
                min-w-[132px]
                h-10
                px-4
                rounded-[10px]
                inline-flex
                items-center
                justify-center
                gap-2
                text-[11.5px]
                font-semibold
                transition-all
                duration-200
              "
              style={{
                color:
                  'var(--text-3)',

                background:
                  'var(--bg-btn-ghost)',

                border:
                  '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  'var(--text-1)'

                e.currentTarget.style.borderColor =
                  'var(--border-hover)'

                e.currentTarget.style.transform =
                  'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  'var(--text-3)'

                e.currentTarget.style.borderColor =
                  'var(--border)'

                e.currentTarget.style.transform =
                  'translateY(0)'
              }}
            >
              Get In Touch

              <Mail
                size={13}
                strokeWidth={2}
              />
            </button>
          </motion.div>


          {/* =====================================
              SOCIAL LINKS
          ===================================== */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.34,
            }}
            className="
              flex
              items-center
              justify-center
              gap-2
              mt-7
            "
          >

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="
                w-8
                h-8
                rounded-[9px]
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
                  'var(--bg-subtle)',

                border:
                  '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  'var(--text-1)'

                e.currentTarget.style.borderColor =
                  'var(--border-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  'var(--text-5)'

                e.currentTarget.style.borderColor =
                  'var(--border-subtle)'
              }}
            >
              <GithubIcon size={14} />
            </a>


            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="
                w-8
                h-8
                rounded-[9px]
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
                  'var(--bg-subtle)',

                border:
                  '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  'var(--text-1)'

                e.currentTarget.style.borderColor =
                  'var(--border-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  'var(--text-5)'

                e.currentTarget.style.borderColor =
                  'var(--border-subtle)'
              }}
            >
              <LinkedinIcon size={14} />
            </a>
          </motion.div>


          {/* =====================================
              SCROLL INDICATOR
          ===================================== */}

          <motion.button
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1,
              duration: 0.6,
            }}
            onClick={() =>
              scrollTo('about')
            }
            aria-label="Scroll to About"
            className="
              mt-8
              sm:mt-10
              lg:mt-12
              flex
              flex-col
              items-center
              justify-center
              gap-2
              mx-auto
              cursor-pointer
              select-none
            "
            style={{
              color:
                'var(--text-5)',
            }}
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.2em]
                font-medium
              "
            >
              Scroll
            </span>

            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowDown
                size={14}
                strokeWidth={1.8}
              />
            </motion.div>
          </motion.button>

        </div>
      </div>
    </section>
  )
}