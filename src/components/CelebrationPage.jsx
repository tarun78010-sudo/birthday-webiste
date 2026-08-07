import { motion } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'
import { SITE } from '../config.js'

// NOTE: this is intentionally minimal for now. Per the current brief,
// the countdown's completion should only fade to black and reveal the
// name — the full birthday experience (letter, timeline, closing) is
// built out in a later pass, using the SITE.letter / SITE.moments /
// SITE.closing fields already reserved in config.js.
export default function CelebrationPage() {
  return (
    <motion.main
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 text-center"
    >
      <AmbientGlow />
      <ParticleField density={40} tint="soft" />

      {/* Cinematic fade-to-black transition, then lifts to reveal the name */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: [0.6, 0, 0.4, 1] }}
        className="pointer-events-none fixed inset-0 z-30 bg-midnight-deep"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(18px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
          className="label-eyebrow"
        >
          {SITE.celebrationEyebrow}
        </motion.span>

        <h1 className="mt-6 font-display text-[13vw] font-bold leading-[1.05] text-gradient-aurora sm:text-[6vw] lg:text-6xl">
          {SITE.celebrationHeadline}
        </h1>
        <h2 className="-mt-1 font-display text-[13vw] font-bold leading-[1.05] text-white sm:text-[6vw] lg:text-6xl">
          {SITE.name}
        </h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-purple-soft to-transparent"
        />
      </motion.div>
    </motion.main>
  )
}
