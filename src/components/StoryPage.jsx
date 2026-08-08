import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'
import TypewriterLetter from './TypewriterLetter.jsx'

const EASE = [0.16, 1, 0.3, 1]

// Scene reached via the "Continue →" button at the end of Scene 1
// ("Our Story Begins", in BirthdayHomePage.jsx — that wiring is
// untouched). This is the letter itself: one line at a time, typed
// out like it's being written in the moment, each held long enough
// to actually read before the next begins.
const LETTER_LINES = [
  'Birthdays come once every year.',
  'But memories stay forever.',
  'So instead of sending just another birthday message...',
  'I wanted to create something different.',
  'Something you can explore...',
  'Enjoy...',
  'And hopefully remember with a smile.',
  'I hope this little journey makes your special day even more memorable.',
]

// How long after the last line finishes before the button appears.
const BUTTON_DELAY_MS = 2000

export default function StoryPage() {
  const navigate = useNavigate()
  const [lineIndex, setLineIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const handleLineDone = useCallback(() => {
    setLineIndex((i) => {
      if (i + 1 < LETTER_LINES.length) return i + 1
      setFinished(true)
      return i
    })
  }, [])

  useEffect(() => {
    if (!finished) return
    const t = setTimeout(() => setShowButton(true), BUTTON_DELAY_MS)
    return () => clearTimeout(t)
  }, [finished])

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-16 text-center">
      <AmbientGlow />
      <ParticleField density={40} tint="soft" />

      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: EASE }}
        className="glass-panel-neon relative z-10 flex w-full max-w-lg flex-col items-center px-8 py-14 sm:px-14 sm:py-16"
      >
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          className="label-eyebrow"
        >
          Why I Built This
        </motion.span>

        <div className="mt-8 flex min-h-[7.5rem] w-full items-center justify-center sm:min-h-[6.5rem]">
          <AnimatePresence mode="wait">
            {!finished && (
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="max-w-md font-display text-xl font-medium leading-relaxed text-ivory sm:text-2xl"
              >
                <TypewriterLetter
                  text={LETTER_LINES[lineIndex]}
                  active
                  onDone={handleLineDone}
                />
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showButton && (
            <motion.button
              type="button"
              onClick={() => navigate('/wishes')}
              initial={{ opacity: 0, y: 14, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: EASE }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-luxury mt-10 gap-2.5 px-8 py-3.5 text-xs uppercase tracking-[0.2em] sm:text-sm"
            >
              <span>Continue →</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
