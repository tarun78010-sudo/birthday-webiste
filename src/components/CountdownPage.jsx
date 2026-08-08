import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'
import ApertureRing from './ApertureRing.jsx'
import CountdownUnit from './CountdownUnit.jsx'
import SurprisePopup from './SurprisePopup.jsx'
import { SITE } from '../config.js'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function CountdownPage({ countdown, onOpen }) {
  const { days, hours, minutes, seconds, progress, isComplete } = countdown
  const sceneRef = useRef(null)
  const [showPopup, setShowPopup] = useState(false)

  function handleOpenClick() {
    if (isComplete) {
      onOpen?.()
    } else {
      setShowPopup(true)
    }
  }

  // Subtle pointer-based parallax — background drifts opposite the glass
  // card for a sense of depth, kept gentle so it never distracts.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 40, damping: 20 })
  const springY = useSpring(my, { stiffness: 40, damping: 20 })
  const bgX = useTransform(springX, [-1, 1], [12, -12])
  const bgY = useTransform(springY, [-1, 1], [10, -10])
  const cardX = useTransform(springX, [-1, 1], [-6, 6])
  const cardY = useTransform(springY, [-1, 1], [-4, 4])

  function handlePointerMove(e) {
    const rect = sceneRef.current?.getBoundingClientRect()
    if (!rect) return
    const relX = (e.clientX - rect.left) / rect.width
    const relY = (e.clientY - rect.top) / rect.height
    mx.set(relX * 2 - 1)
    my.set(relY * 2 - 1)
  }

  return (
    <motion.main
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      exit={{ opacity: 0, filter: 'blur(24px)', scale: 1.03 }}
      transition={{ duration: 1.1, ease: [0.6, 0, 0.4, 1] }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-16"
    >
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0">
        <AmbientGlow />
        <ParticleField density={52} tint="mixed" />
      </motion.div>

      <motion.div
        style={{ x: cardX, y: cardY }}
        variants={container}
        initial="hidden"
        animate="show"
        className="glass-panel-neon relative z-10 flex w-full max-w-xl flex-col items-center px-6 py-14 text-center sm:px-14 sm:py-16"
      >
        <motion.span variants={item} className="label-eyebrow">
          {SITE.teaserEyebrow}
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-8 max-w-md font-display text-4xl font-semibold leading-[1.1] text-gradient-aurora sm:mt-9 sm:text-5xl"
        >
          {SITE.teaserHeadline}
        </motion.h1>

        <motion.p variants={item} className="mt-5 font-body text-sm text-mist sm:mt-6 sm:text-base">
          {SITE.teaserSub}
        </motion.p>

        <motion.div
          variants={item}
          className="relative z-10 mt-14 flex items-center justify-center sm:mt-16"
        >
          <div className="pointer-events-none sm:hidden">
            <ApertureRing progress={progress} size={260} />
          </div>
          <div className="pointer-events-none hidden sm:block">
            <ApertureRing progress={progress} size={340} />
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4">
            <CountdownUnit value={days} label="Days" />
            <CountdownUnit value={hours} label="Hours" />
            <CountdownUnit value={minutes} label="Minutes" />
            <CountdownUnit value={seconds} label="Seconds" />
          </div>
        </motion.div>

        <motion.button
          variants={item}
          onClick={handleOpenClick}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="btn-luxury relative z-10 mt-12 gap-2.5 px-8 py-3.5 text-xs uppercase tracking-[0.2em] sm:mt-14 sm:text-sm"
        >
          <span aria-hidden="true">{isComplete ? '🎁' : '🔒'}</span>
          <span>Open Your Surprise</span>
        </motion.button>

        <motion.div variants={item} className="mt-10 flex items-center gap-3 text-mist/70 sm:mt-12">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/25" />
          <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Prepared quietly</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/25" />
        </motion.div>
      </motion.div>

      <SurprisePopup open={showPopup} onClose={() => setShowPopup(false)} />
    </motion.main>
  )
}
