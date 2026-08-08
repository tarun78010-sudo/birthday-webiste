import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'
import { SITE } from '../config.js'
import { layoutSequence } from '../utils/sentenceTiming.js'

const EASE = [0.16, 1, 0.3, 1]
const EASE_SOFT = [0.6, 0, 0.4, 1]

// Timing budget for the whispered-line sequence. Each line fades in
// (0.8s), holds for a duration scaled to how long it is to read, then
// fades out (0.8s) — with a short pause before the next line begins.
const LINES_START = 2.2

const { lines: LINES, cursor: LINES_END } = layoutSequence(
  SITE.cinematicLines.map((text) => ({ text })),
  LINES_START,
)

const FINAL_DELAY = LINES_END + 0.3

// One whispered line — fades in, pauses, fades out, in place.
function SequenceLine({ text, delay, duration, times }) {
  return (
    <motion.p
      className="absolute inset-0 flex items-center justify-center px-6 text-center font-display text-2xl font-medium tracking-wide text-ivory sm:text-3xl"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{
        opacity: [0, 1, 1, 0],
        filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'],
      }}
      transition={{
        duration,
        delay,
        times,
        ease: EASE,
      }}
    >
      {text}
    </motion.p>
  )
}

// Phase 2 — the cinematic bridge between the countdown and the next
// experience. Fades in from black, breathes with aurora light and
// drifting particles under a very slow camera zoom, whispers three
// lines one at a time, then settles on the name and a way forward.
export default function CinematicIntro() {
  const navigate = useNavigate()

  return (
    <motion.main
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-midnight-deep px-6 text-center"
    >
      {/* Step 1 — the previous scene finishes fading to black, then
          lifts slowly to let the aurora underneath show through */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.8, delay: 0.2, ease: EASE_SOFT }}
        className="pointer-events-none fixed inset-0 z-40 bg-midnight-deep"
        aria-hidden="true"
      />

      {/* Steps 2–5 — purple aurora, floating particles, soft ambient
          light, all under a very slow, continuous cinematic push-in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1.06 }}
        transition={{
          opacity: { duration: 3, delay: 1, ease: EASE },
          scale: { duration: 22, delay: 1, ease: 'linear' },
        }}
      >
        <AmbientGlow />
        <ParticleField density={56} tint="violet" />
      </motion.div>

      {/* Steps 6–8 — the three whispered lines, one at a time */}
      <div className="relative z-10 h-screen w-full max-w-2xl">
        {LINES.map((line) => (
          <SequenceLine
            key={line.text}
            text={line.text}
            delay={line.delay}
            duration={line.duration}
            times={line.times}
          />
        ))}
      </div>

      {/* Step 9 — the reveal: name, subtitle, and the way forward */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(18px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.8, delay: FINAL_DELAY, ease: EASE }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
      >
        <h1
          className="max-w-xl font-display text-[11vw] font-bold leading-[1.15] text-gradient-aurora sm:text-5xl lg:text-6xl"
          style={{
            textShadow:
              '0 0 40px rgba(168,85,247,0.55), 0 0 90px rgba(139,92,246,0.35)',
          }}
        >
          ✨ {SITE.celebrationHeadline} {SITE.name} ✨
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: FINAL_DELAY + 0.7, ease: EASE }}
          className="mt-5 font-body text-sm text-mist sm:text-base"
        >
          {SITE.celebrationSubtitle}
        </motion.p>

        <motion.button
          type="button"
          onClick={() => navigate('/birthday-home')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: FINAL_DELAY + 1.1, ease: EASE }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="btn-luxury mt-10 gap-2.5 px-8 py-3.5 text-xs uppercase tracking-[0.2em] sm:text-sm"
        >
          <span>{SITE.journeyButtonLabel}</span>
        </motion.button>
      </motion.div>
    </motion.main>
  )
}
