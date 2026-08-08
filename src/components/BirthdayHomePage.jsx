import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'
import { layoutSequence, FADE_SECONDS } from '../utils/sentenceTiming.js'

const EASE = [0.16, 1, 0.3, 1]
const EASE_SOFT = [0.6, 0, 0.4, 1]

// "Our Story Begins" — the opening chapter, reached via the
// "✨ Begin the Journey" button at the end of CinematicIntro.jsx
// (that button already navigates here, to /birthday-home — nothing
// about that wiring changes). One sentence at a time, fades in,
// holds, fades out. The date gets its own held, glowing moment.
// Timing budget: each line gets a delay computed from the ones
// before it, so nothing overlaps and nothing is rushed — and how
// long a line holds on screen now scales with how long it is.
const START = 1.6

const STORY_LINES = [
  { text: 'Every story has a beginning...' },
  { text: 'Ours began on...' },
  { text: 'September 23, 2024', isDate: true },
  { text: 'A simple conversation.' },
  { text: 'A day that quietly became the beginning of a wonderful friendship.' },
  { text: 'And today...' },
]

const FINAL_LINE = "I'm celebrating that friendship with this little surprise."

const { lines: LINES, cursor: LINES_END } = layoutSequence(STORY_LINES, START)

const FINAL_DELAY = LINES_END
// This composition only fades in and then stays put, so it just gets
// the standard 0.8s fade — followed by enough of a comfortable
// reading pause before the button appears that the sentence has
// actually been read.
const FINAL_LINE_DURATION = FADE_SECONDS
const BUTTON_DELAY = FINAL_DELAY + FADE_SECONDS + 2

// One story line — fades in, holds, fades out, always centered in
// the same spot so the whole sequence reads like a single breath.
function StoryLine({ text, delay, duration, times, isDate }) {
  return (
    <motion.p
      className={
        isDate
          ? 'absolute inset-0 flex items-center justify-center px-6 text-center font-display text-5xl font-bold text-gradient-aurora sm:text-6xl lg:text-7xl'
          : 'absolute inset-0 flex items-center justify-center px-6 text-center font-display text-xl font-medium leading-relaxed text-ivory sm:text-2xl lg:text-3xl'
      }
      style={
        isDate
          ? {
              textShadow:
                '0 0 40px rgba(168,85,247,0.6), 0 0 90px rgba(139,92,246,0.4)',
            }
          : undefined
      }
      initial={{ opacity: 0, filter: 'blur(10px)', scale: isDate ? 0.94 : 1 }}
      animate={{
        opacity: [0, 1, 1, 0],
        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'],
        scale: isDate ? [0.94, 1, 1, 1.03] : [1, 1, 1, 1],
      }}
      transition={{ duration, delay, times, ease: EASE }}
    >
      {text}
    </motion.p>
  )
}

export default function BirthdayHomePage() {
  const navigate = useNavigate()

  return (
    <motion.main
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-midnight-deep px-6 text-center"
    >
      {/* Scene opens from black — same cinematic language as the
          bridge that led here */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.15, ease: EASE_SOFT }}
        className="pointer-events-none fixed inset-0 z-40 bg-midnight-deep"
        aria-hidden="true"
      />

      {/* Aurora + particles under a very slow, continuous camera push-in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{
          opacity: { duration: 2.6, delay: 0.6, ease: EASE },
          scale: { duration: 26, delay: 0.6, ease: 'linear' },
        }}
      >
        <AmbientGlow />
        <ParticleField density={44} tint="soft" />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
        className="label-eyebrow absolute left-1/2 top-10 -translate-x-1/2 sm:top-14"
      >
        Our Story Begins
      </motion.span>

      <div className="relative z-10 h-screen w-full max-w-2xl">
        {LINES.map((line) => (
          <StoryLine key={line.text} {...line} />
        ))}

        {/* Final composition — the closing line settles in and stays,
            then the way forward glows in beneath it */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: FINAL_LINE_DURATION, delay: FINAL_DELAY, ease: EASE }}
        >
          <p className="max-w-xl text-center font-display text-xl font-medium leading-relaxed text-ivory sm:text-2xl lg:text-3xl">
            {FINAL_LINE}
          </p>

          <motion.button
            type="button"
            onClick={() => navigate('/story')}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: BUTTON_DELAY, ease: EASE }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-luxury gap-2.5 px-9 py-3.5 text-xs uppercase tracking-[0.25em] sm:text-sm"
          >
            <span>Continue →</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.main>
  )
}
