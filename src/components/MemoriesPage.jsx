import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'

const EASE = [0.16, 1, 0.3, 1]

// "A Few Beautiful Memories" — Scene 4, reached via the "📸 View
// Memories" button at the end of "Three Wishes" (WishesPage.jsx,
// which already navigates here — that wiring is untouched).
//
// A cinematic, one-photo-at-a-time reveal — NOT a grid, NOT a
// carousel. Each photo fades in with a slow Ken Burns zoom, glows
// softly, pairs with a glass caption underneath, then fades out
// before the next appears. After the final photo, a closing line
// appears, pauses, then a glowing "Continue →" button leads to the
// (placeholder) /birthday-letter route.

const MEMORIES = [
  {
    src: '/memories/memory-1.jpg',
    title: 'Where It All Began',
    caption: 'Every beautiful story begins somewhere.',
  },
  {
    src: '/memories/memory-2.jpg',
    title: 'Growing Up',
    caption: 'Watching dreams slowly take shape.',
  },
  {
    src: '/memories/memory-3.jpg',
    title: 'A Beautiful Smile',
    caption: 'Some smiles never need a reason.',
  },
  {
    src: '/memories/memory-4.jpg',
    title: 'Joy',
    caption: 'The happiest moments are often the simplest.',
  },
  {
    src: '/memories/memory-5.jpg',
    title: 'Today',
    caption: 'And this is just the beginning...',
  },
]

const HOLD_MS = 4000 // each photo stays visible for about this long
const FADE_MS = 900 // fade in/out duration between photos
const CLOSING_DELAY_MS = 2000 // pause before the Continue button appears

// Soft neon glow around the photo frame, matching .glass-panel-neon's
// language (see tailwind.config.js 'neon-border' shadow) but tuned a
// touch dimmer so the photo itself stays the focal point.
const FRAME_GLOW =
  '0 0 0 1px rgba(168,85,247,0.16), 0 0 40px -6px rgba(139,92,246,0.38), 0 0 90px -25px rgba(168,85,247,0.32)'

export default function MemoriesPage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const isLast = index === MEMORIES.length - 1

  // Advance through the photos, one at a time, on a fixed cadence.
  useEffect(() => {
    if (finished) return

    if (!isLast) {
      const t = setTimeout(() => setIndex((i) => i + 1), HOLD_MS)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => setFinished(true), HOLD_MS)
    return () => clearTimeout(t)
  }, [index, isLast, finished])

  // Once the closing line appears, reveal the button after a beat.
  useEffect(() => {
    if (!finished) return
    const t = setTimeout(() => setShowButton(true), CLOSING_DELAY_MS)
    return () => clearTimeout(t)
  }, [finished])

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <AmbientGlow />
      <ParticleField density={40} tint="soft" />

      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative z-10 flex w-full max-w-xl flex-col items-center"
      >
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="label-eyebrow"
        >
          One more chapter
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
          className="mt-6 font-display text-3xl font-semibold leading-[1.15] text-gradient-aurora sm:text-4xl"
        >
          ✨ A Few Beautiful Memories ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          className="mt-5 font-body text-sm text-mist sm:text-base"
        >
          Every picture holds a little story.
        </motion.p>

        <div className="mt-10 flex min-h-[440px] w-full flex-col items-center justify-center sm:mt-12 sm:min-h-[480px]">
          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={`photo-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: FADE_MS / 1000, ease: EASE }}
                className="flex w-full flex-col items-center"
              >
                <div
                  className="relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-[28px] border border-white/10 sm:max-w-[340px]"
                  style={{ boxShadow: FRAME_GLOW }}
                >
                  <motion.img
                    src={MEMORIES[index].src}
                    alt={MEMORIES[index].title}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.12 }}
                    transition={{
                      duration: (HOLD_MS + FADE_MS) / 1000,
                      ease: 'linear',
                    }}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(3,5,13,0) 55%, rgba(3,5,13,0.55) 100%)',
                    }}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
                  className="glass-panel relative -mt-8 w-full max-w-[280px] px-6 py-5 sm:max-w-[320px]"
                >
                  <h3 className="font-display text-lg font-semibold text-ivory sm:text-xl">
                    {MEMORIES[index].title}
                  </h3>
                  <p className="mt-2 font-body text-xs text-mist sm:text-sm">
                    {MEMORIES[index].caption}
                  </p>
                </motion.div>

                <div className="mt-8 flex items-center justify-center gap-2">
                  {MEMORIES.map((m, i) => (
                    <span
                      key={m.title}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: i === index ? '22px' : '6px',
                        backgroundColor:
                          i === index
                            ? 'rgba(196,132,252,0.9)'
                            : 'rgba(148,163,184,0.35)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="closing"
                initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: EASE }}
                className="flex w-full flex-col items-center px-2"
              >
                <p className="font-display text-lg font-medium leading-relaxed text-ivory sm:text-xl">
                  Every memory tells a story...
                  <br />
                  but the best chapters are still waiting to be written.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showButton && (
            <motion.button
              key="continue-button"
              type="button"
              onClick={() => navigate('/birthday-letter')}
              initial={{ opacity: 0, y: 14, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
              transition={{ duration: 0.9, ease: EASE }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-luxury shadow-glow-purple mt-4 cursor-pointer gap-2.5 px-9 py-3.5 text-xs uppercase tracking-[0.25em] sm:text-sm"
            >
              <span>Continue →</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
