import { motion } from 'framer-motion'
import {
  Code2,
  Server,
  Database,
  Cloud,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

const skillGroups = [
  {
    title: 'Frontend',
    icon: Code2,
    skills: [
      'React',
      'JavaScript',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'Framer Motion',
    ],
  },

  {
    title: 'Backend',
    icon: Server,
    skills: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'Middleware',
      'JWT',
      'bcrypt',
    ],
  },

  {
    title: 'Databases',
    icon: Database,
    skills: [
      'MongoDB',
      'MySQL',
      'Mongoose',
      'Database Design',
    ],
  },

  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    skills: [
      'Docker',
      'AWS EC2',
      'Nginx',
      'Linux',
      'Git',
      'GitHub',
    ],
  },

  {
    title: 'Security',
    icon: ShieldCheck,
    skills: [
      'JWT Authentication',
      'Protected Routes',
      'Password Hashing',
      'Role-Based Access',
      'API Security',
    ],
  },

  {
    title: 'Tools',
    icon: Wrench,
    skills: [
      'VS Code',
      'Postman',
      'Git',
      'GitHub',
      'npm',
      'REST Client',
    ],
  },
]

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

export default function Skills() {
  return (
    <section
      id="skills"
      aria-label="Skills section"
      className="
        relative
        py-16
        sm:py-20
        lg:py-24
      "
    >

      {/* =========================================
          CONTAINER
      ========================================= */}

      <div
        className="
          w-full
          max-w-6xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
        "
      >

        {/* =========================================
            HEADER
        ========================================= */}

        <motion.div
          {...fadeIn}
          className="
            text-center
            mb-10
            sm:mb-12
            lg:mb-14
          "
        >

          <p
            className="
              section-label
              mb-2
              text-[10px]
              sm:text-[11px]
            "
          >
            Expertise
          </p>

          <h2
            className="
              text-[30px]
              sm:text-[36px]
              lg:text-[40px]
              font-bold
              tracking-[-0.035em]
              leading-tight
              gradient-text-soft
            "
          >
            Skills & Technologies
          </h2>

          <p
            className="
              max-w-[470px]
              mx-auto
              mt-2.5
              text-[12px]
              sm:text-[13px]
              lg:text-[14px]
              leading-relaxed
            "
            style={{
              color: 'var(--text-5)',
            }}
          >
            Technologies and tools I use to build,
            secure, and deploy modern web applications.
          </p>

        </motion.div>


        {/* =========================================
            SKILL GRID
        ========================================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-3
            sm:gap-4
            lg:gap-5
            max-w-5xl
            mx-auto
          "
        >

          {skillGroups.map(
            (
              {
                title,
                icon: Icon,
                skills,
              },
              index
            ) => (

              <motion.div
                key={title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  group
                  p-3.5
                  sm:p-4
                  lg:p-5
                  rounded-[10px]
                  sm:rounded-xl
                  transition-all
                  duration-200
                "
                style={{
                  background:
                    'var(--bg-subtle)',

                  border:
                    '1px solid var(--border-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--border-hover)'

                  e.currentTarget.style.transform =
                    'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    'var(--border-subtle)'

                  e.currentTarget.style.transform =
                    'translateY(0)'
                }}
              >

                {/* =================================
                    CARD HEADER
                ================================= */}

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                    sm:gap-3
                    mb-3
                    sm:mb-3.5
                  "
                >

                  <div
                    className="
                      icon-box
                      w-8
                      h-8
                      sm:w-9
                      sm:h-9
                      rounded-[8px]
                      sm:rounded-lg
                      flex-shrink-0
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon
                      size={15}
                      strokeWidth={2}
                    />
                  </div>

                  <h3
                    className="
                      text-[12px]
                      sm:text-[13px]
                      lg:text-[14px]
                      font-semibold
                    "
                    style={{
                      color:
                        'var(--text-1)',
                    }}
                  >
                    {title}
                  </h3>

                </div>


                {/* =================================
                    SKILL TAGS
                ================================= */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-1.5
                    sm:gap-2
                  "
                >

                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="
                        inline-flex
                        items-center
                        px-2
                        sm:px-2.5
                        py-1
                        rounded-md
                        text-[9px]
                        sm:text-[10px]
                        leading-none
                        font-medium
                        transition-colors
                        duration-200
                      "
                      style={{
                        color:
                          'var(--text-4)',

                        background:
                          'var(--bg-tag)',

                        border:
                          '1px solid var(--border-tag)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </motion.div>
            )
          )}

        </div>


        {/* =========================================
            BOTTOM SUMMARY
        ========================================= */}

        <motion.div
          {...fadeIn}
          transition={{
            duration: 0.55,
            delay: 0.2,
          }}
          className="
            max-w-5xl
            mx-auto
            mt-4
            sm:mt-5
            lg:mt-6
            px-3.5
            py-3
            sm:px-4
            sm:py-3.5
            rounded-[10px]
            sm:rounded-xl
            text-center
          "
          style={{
            background:
              'var(--bg-tag)',

            border:
              '1px solid var(--border-tag)',
          }}
        >

          <p
            className="
              text-[10px]
              sm:text-[11px]
              lg:text-xs
              leading-relaxed
            "
            style={{
              color:
                'var(--text-4)',
            }}
          >
            Focused on building reliable systems
            from frontend interface to backend API
            and cloud deployment.
          </p>

        </motion.div>

      </div>
    </section>
  )
}