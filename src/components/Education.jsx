import { motion } from 'framer-motion'
import {
  GraduationCap,
  Calendar,
  MapPin,
} from 'lucide-react'

// ============================================
// EDUCATION DATA
// Keep your actual details here
// ============================================

const educationData = [
  {
    id: 1,

    degree:
      '[ Your Degree — e.g., B.Tech Computer Science ]',

    institution:
      '[ Your University / College Name ]',

    period:
      '[ Start Year ] – [ End Year / Expected ]',

    location:
      '[ City, State ]',

    highlights: [
      'Relevant coursework: Data Structures, Algorithms, Operating Systems, Databases',
      'Self-directed learning in full-stack development alongside coursework',
      'Built InnerVoice as a hands-on full-stack project',
    ],

    placeholder: true,
  },
]


// ============================================
// ANIMATION
// ============================================

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
    amount: 0.15,
  },

  transition: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
  },
}


export default function Education() {
  return (
    <section
      id="education"
      aria-label="Education section"
      className="
        relative
        py-16
        sm:py-20
        lg:py-24
      "
    >

      {/* ========================================
          MAIN CONTAINER
      ======================================== */}

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

        {/* ======================================
            SECTION HEADER
        ====================================== */}

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
            Education
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
            Academic Background
          </h2>

        </motion.div>


        {/* ======================================
            EDUCATION CONTENT
        ====================================== */}

        <div
          className="
            max-w-3xl
            mx-auto
          "
        >

          {educationData.map((edu, i) => (
            <motion.div
              key={edu.id}
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                w-full
                px-3.5
                py-4
                sm:px-5
                sm:py-5
                lg:p-6
                rounded-[10px]
                sm:rounded-xl
              "
              style={{
                background:
                  'var(--bg-subtle)',

                border:
                  edu.placeholder
                    ? '1px dashed var(--border-dashed)'
                    : '1px solid var(--border-card)',
              }}
            >

              {/* ==================================
                  PLACEHOLDER NOTICE
              ================================== */}

              {edu.placeholder && (
                <div
                  className="
                    text-[9px]
                    sm:text-[10px]
                    font-medium
                    px-2
                    sm:px-2.5
                    py-1.5
                    rounded-md
                    mb-4
                    sm:mb-5
                    w-fit
                    max-w-full
                  "
                  style={{
                    background:
                      'rgba(251,191,36,0.06)',

                    border:
                      '1px solid rgba(251,191,36,0.18)',

                    color:
                      '#f59e0b',
                  }}
                >
                  ✏️ Placeholder — Edit Education.jsx
                  to add your real details
                </div>
              )}


              {/* ==================================
                  EDUCATION HEADER
              ================================== */}

              <div
                className="
                  flex
                  items-start
                  gap-3
                  sm:gap-4
                "
              >

                {/* Icon */}

                <div
                  className="
                    icon-box
                    w-8
                    h-8
                    sm:w-9
                    sm:h-9
                    lg:w-10
                    lg:h-10
                    rounded-[8px]
                    sm:rounded-lg
                    flex-shrink-0
                    flex
                    items-center
                    justify-center
                  "
                >
                  <GraduationCap
                    size={15}
                    className="sm:hidden"
                  />

                  <GraduationCap
                    size={18}
                    className="hidden sm:block"
                  />
                </div>


                {/* Main information */}

                <div
                  className="
                    flex-1
                    min-w-0
                  "
                >

                  {/* Degree */}

                  <h3
                    className="
                      text-[13px]
                      sm:text-[14px]
                      lg:text-[15px]
                      font-semibold
                      leading-tight
                    "
                    style={{
                      color:
                        'var(--text-1)',
                    }}
                  >
                    {edu.degree}
                  </h3>


                  {/* Institution */}

                  <div
                    className="
                      text-[11px]
                      sm:text-xs
                      lg:text-sm
                      font-medium
                      mt-1
                      sm:mt-1.5
                    "
                    style={{
                      color:
                        'var(--accent)',
                    }}
                  >
                    {edu.institution}
                  </div>


                  {/* =================================
                      META INFORMATION
                  ================================= */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-x-3
                      gap-y-1.5
                      mt-2.5
                      sm:mt-3
                    "
                    style={{
                      color:
                        'var(--text-5)',
                    }}
                  >

                    {/* Period */}

                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[9px]
                        sm:text-[10px]
                        lg:text-xs
                      "
                    >
                      <Calendar
                        size={11}
                        strokeWidth={2}
                      />

                      {edu.period}
                    </span>


                    {/* Location */}

                    {edu.location && (
                      <span
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-[9px]
                          sm:text-[10px]
                          lg:text-xs
                        "
                      >
                        <MapPin
                          size={11}
                          strokeWidth={2}
                        />

                        {edu.location}
                      </span>
                    )}


                    {/* Grade */}

                    {edu.grade && (
                      <span
                        className="
                          text-[9px]
                          sm:text-[10px]
                          lg:text-xs
                          font-medium
                        "
                      >
                        CGPA: {edu.grade}
                      </span>
                    )}

                  </div>


                  {/* =================================
                      HIGHLIGHTS
                  ================================= */}

                  {edu.highlights?.length > 0 && (
                    <ul
                      className="
                        flex
                        flex-col
                        gap-2
                        sm:gap-2.5
                        mt-4
                        sm:mt-5
                      "
                    >

                      {edu.highlights.map(
                        (highlight, j) => (
                          <li
                            key={j}
                            className="
                              flex
                              items-start
                              gap-2
                              text-[10px]
                              sm:text-[11px]
                              lg:text-xs
                            "
                            style={{
                              color:
                                'var(--text-4)',
                            }}
                          >

                            {/* Bullet */}

                            <span
                              className="
                                mt-[5px]
                                w-1
                                h-1
                                rounded-full
                                flex-shrink-0
                              "
                              style={{
                                background:
                                  'var(--accent)',
                              }}
                            />

                            <span
                              className="
                                leading-[1.6]
                              "
                            >
                              {highlight}
                            </span>

                          </li>
                        )
                      )}

                    </ul>
                  )}

                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  )
}