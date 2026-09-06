import { motion } from 'framer-motion'
import {
  Code2,
  Server,
  Cloud,
  Layers,
} from 'lucide-react'
import { journey } from '../data/experience'

const iconMap = {
  Code2,
  Server,
  Cloud,
  Layers,
}

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

export default function Experience() {
  return (
    <section
      id="experience"
      aria-label="Experience section"
      className="
        relative
        py-16
        sm:py-20
        lg:py-24
      "
      style={{
        background:
          'var(--bg-section-alt)',
      }}
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

        {/* =======================================
            HEADER
        ======================================= */}

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
            Journey
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
              mb-2.5
            "
          >
            Developer Journey
          </h2>

          <p
            className="
              text-[12px]
              sm:text-[13px]
              lg:text-[14px]
              leading-relaxed
              max-w-[430px]
              mx-auto
            "
            style={{
              color:
                'var(--text-5)',
            }}
          >
            A chronological look at my path through
            full-stack, backend, cloud, and DevOps
            development.
          </p>
        </motion.div>


        {/* =======================================
            TIMELINE
        ======================================= */}

        <div
          className="
            relative
            max-w-3xl
            mx-auto
          "
        >

          {/* Vertical timeline line */}

          <div
            className="
              absolute
              left-[15px]
              sm:left-[18px]
              lg:left-[20px]
              top-3
              bottom-3
              w-px
            "
            style={{
              background:
                'linear-gradient(to bottom, var(--accent), var(--accent-2), transparent)',

              opacity: 0.22,
            }}
          />


          {/* =====================================
              EXPERIENCE ITEMS
          ===================================== */}

          <div
            className="
              flex
              flex-col
              gap-4
              sm:gap-5
              lg:gap-6
            "
          >

            {journey.map((item, i) => {
              const Icon =
                iconMap[item.icon] || Code2

              return (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    x: -18,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    relative
                    flex
                    items-start
                  "
                >

                  {/* =================================
                      TIMELINE ICON
                  ================================= */}

                  <div
                    className="
                      absolute
                      left-0
                      top-4
                      w-[30px]
                      h-[30px]
                      sm:w-[36px]
                      sm:h-[36px]
                      lg:w-[40px]
                      lg:h-[40px]
                      flex
                      items-center
                      justify-center
                      rounded-full
                      z-10
                    "
                    style={{
                      background:
                        item.highlight
                          ? 'var(--bg-tag)'
                          : 'var(--bg-card)',

                      border:
                        item.highlight
                          ? '1px solid var(--border-tag)'
                          : '1px solid var(--border-card)',

                      boxShadow:
                        item.highlight
                          ? 'var(--shadow-glow)'
                          : 'none',
                    }}
                  >
                    <Icon
                      size={13}
                      className="
                        sm:hidden
                      "
                      style={{
                        color:
                          item.highlight
                            ? 'var(--accent)'
                            : 'var(--text-5)',
                      }}
                    />

                    <Icon
                      size={15}
                      className="
                        hidden
                        sm:block
                      "
                      style={{
                        color:
                          item.highlight
                            ? 'var(--accent)'
                            : 'var(--text-5)',
                      }}
                    />
                  </div>


                  {/* =================================
                      EXPERIENCE CARD
                  ================================= */}

                  <div
                    className="
                      w-full
                      ml-[42px]
                      sm:ml-[52px]
                      lg:ml-[60px]
                      px-3.5
                      py-3.5
                      sm:px-4
                      sm:py-4
                      lg:p-5
                      rounded-[10px]
                      sm:rounded-xl
                      transition-all
                      duration-200
                    "
                    style={{
                      background:
                        item.highlight
                          ? 'var(--bg-tag)'
                          : 'var(--bg-subtle)',

                      border:
                        item.highlight
                          ? '1px solid var(--border-tag)'
                          : '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        item.highlight
                          ? 'var(--border-hover)'
                          : 'var(--border-hover)'

                      e.currentTarget.style.transform =
                        'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        item.highlight
                          ? 'var(--border-tag)'
                          : 'var(--border-subtle)'

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
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                        sm:gap-3
                        mb-2
                      "
                    >

                      {/* Title */}

                      <div
                        className="
                          min-w-0
                        "
                      >
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
                          {item.title}
                        </h3>

                        <p
                          className="
                            text-[10px]
                            sm:text-[11px]
                            lg:text-xs
                            mt-1
                            leading-tight
                          "
                          style={{
                            color:
                              'var(--text-5)',
                          }}
                        >
                          {item.subtitle}
                        </p>
                      </div>


                      {/* Period */}

                      <span
                        className="
                          self-start
                          text-[9px]
                          sm:text-[10px]
                          lg:text-[11px]
                          font-medium
                          px-2
                          sm:px-2.5
                          py-1
                          rounded-md
                          whitespace-nowrap
                          flex-shrink-0
                        "
                        style={{
                          background:
                            'var(--bg-tag)',

                          border:
                            '1px solid var(--border-tag)',

                          color:
                            'var(--accent)',
                        }}
                      >
                        {item.period}
                      </span>

                    </div>


                    {/* =================================
                        DESCRIPTION
                    ================================= */}

                    <p
                      className="
                        text-[11px]
                        sm:text-xs
                        lg:text-sm
                        leading-[1.65]
                        mb-2.5
                        sm:mb-3
                      "
                      style={{
                        color:
                          'var(--text-4)',
                      }}
                    >
                      {item.description}
                    </p>


                    {/* =================================
                        TECHNOLOGY TAGS
                    ================================= */}

                    <div
                      className="
                        flex
                        flex-wrap
                        gap-1
                        sm:gap-1.5
                      "
                    >
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="
                            tech-pill
                            text-[9px]
                            sm:text-[10px]
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                  </div>

                </motion.div>
              )
            })}

          </div>
        </div>

      </div>
    </section>
  )
}