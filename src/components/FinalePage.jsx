import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'
import { SITE } from '../config.js'

const EASE = [0.16, 1, 0.3, 1]

const GOLD = '#D4AF37'
const GOLD_BRIGHT = '#F5E1A4'
const GOLD_DEEP = '#C9A227'
const PURPLE = '#A855F7'
const PURPLE_SOFT = '#C084FC'

const FIREWORKS_START_DELAY_MS = 1000
const FOOTER_DELAY_MS = 2000
const FIREWORKS_DURATION_MS = 8000

// /finale — Scene 8, the Grand Finale. Premium purple-aurora backdrop with
// gold + purple fireworks along the edges, slow falling confetti, a warm
// closing message, and a replay button back to the very start.
export default function FinalePage() {
  const navigate = useNavigate()
  const [celebrationActive, setCelebrationActive] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    const startFireworks = setTimeout(() => setCelebrationActive(true), FIREWORKS_START_DELAY_MS)
    const revealFooter = setTimeout(() => setShowFooter(true), FOOTER_DELAY_MS)
    const stopFireworks = setTimeout(() => setCelebrationActive(false), FIREWORKS_DURATION_MS)

    return () => {
      clearTimeout(startFireworks)
      clearTimeout(revealFooter)
      clearTimeout(stopFireworks)
    }
  }, [])

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      {/* Premium purple aurora backdrop — stars, light rays, slow drift */}
      <AmbientGlow />
      <ParticleField density={52} tint="soft" />
      <GoldenSparkles />
      <FinaleCelebration active={celebrationActive} />

      <motion.div
        initial={{ opacity: 0, y: 18, filter: 'blur(16px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, ease: EASE }}
        className="relative z-10 flex w-full max-w-xl flex-col items-center"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
          className="label-eyebrow"
        >
          The Journey Ends Here
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: EASE }}
          className="mt-5 font-display text-2xl font-semibold uppercase leading-[1.25] tracking-wide text-gradient-aurora sm:text-4xl md:text-5xl"
          style={{ textShadow: '0 0 46px rgba(212,175,55,0.32)' }}
        >
          ✨ Happy Birthday {SITE.name} ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease: EASE }}
          className="mt-7 max-w-md font-body text-sm leading-relaxed text-mist sm:text-base"
        >
          Thank you for taking this journey. I hope today brings you happiness,
          beautiful memories, and countless reasons to smile.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: EASE }}
          className="mt-4 max-w-md font-body text-sm leading-relaxed text-mist sm:text-base"
        >
          May this year bring you success, good health, peace, and endless
          happiness.
        </motion.p>

        <motion.button
          type="button"
          onClick={() => navigate('/')}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            boxShadow: [
              '0 0 24px rgba(212,175,55,0.35), 0 0 46px rgba(168,85,247,0.28)',
              '0 0 36px rgba(212,175,55,0.55), 0 0 64px rgba(168,85,247,0.42)',
              '0 0 24px rgba(212,175,55,0.35), 0 0 46px rgba(168,85,247,0.28)',
            ],
          }}
          transition={{
            opacity: { duration: 0.9, delay: 1.5, ease: EASE },
            y: { duration: 0.9, delay: 1.5, ease: EASE },
            scale: { duration: 0.9, delay: 1.5, ease: EASE },
            boxShadow: { duration: 3.2, delay: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="btn-luxury mt-10 cursor-pointer gap-2.5 px-9 py-3.5 text-xs uppercase tracking-[0.25em] sm:mt-12 sm:text-sm"
        >
          <span>🔄 Replay the Journey</span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showFooter && (
          <motion.footer
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.3, ease: EASE }}
            className="relative z-10 mt-14 font-display text-sm italic leading-relaxed text-mist sm:text-base"
            style={{ textShadow: '0 0 18px rgba(212,175,55,0.4)' }}
          >
            Created especially for {SITE.name}
            <br />
            <span style={{ color: GOLD_BRIGHT }}>— Tarun</span>
          </motion.footer>
        )}
      </AnimatePresence>
    </main>
  )
}

// A soft field of warm gold sparkles layered on top of the aurora's white
// stars — deterministic positions so nothing shifts between renders.
function GoldenSparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {GOLD_SPARKLE_POSITIONS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: GOLD_BRIGHT,
            boxShadow: `0 0 ${s.size * 3}px ${GOLD}, 0 0 ${s.size * 6}px rgba(212,175,55,0.35)`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

const GOLD_SPARKLE_POSITIONS = [
  { x: 5, y: 20, size: 3, delay: 0.1, duration: 3.6 },
  { x: 11, y: 62, size: 2.4, delay: 1.2, duration: 4.1 },
  { x: 16, y: 38, size: 2, delay: 0.6, duration: 3.2 },
  { x: 22, y: 84, size: 2.6, delay: 1.8, duration: 3.8 },
  { x: 9, y: 8, size: 2, delay: 0.9, duration: 2.9 },
  { x: 90, y: 18, size: 3, delay: 0.3, duration: 3.7 },
  { x: 85, y: 58, size: 2.4, delay: 1.4, duration: 4.3 },
  { x: 93, y: 40, size: 2, delay: 0.7, duration: 3.1 },
  { x: 80, y: 82, size: 2.6, delay: 1.9, duration: 3.5 },
  { x: 95, y: 74, size: 1.8, delay: 0.4, duration: 2.7 },
  { x: 34, y: 12, size: 1.8, delay: 1.1, duration: 3.4 },
  { x: 62, y: 10, size: 1.8, delay: 0.5, duration: 3.9 },
  { x: 45, y: 90, size: 2.2, delay: 1.6, duration: 3.3 },
  { x: 68, y: 92, size: 2, delay: 0.8, duration: 2.8 },
  { x: 28, y: 70, size: 1.6, delay: 1.3, duration: 3.6 },
  { x: 72, y: 66, size: 1.6, delay: 0.2, duration: 3.1 },
]

// Canvas layer that renders the entrance gold + purple fireworks around
// the screen edges (center kept clear) and slow falling confetti. Spawning
// stops when `active` turns false; existing particles fade out on their own
// so the celebration winds down gradually into the calm aurora ending.
function FinaleCelebration({ active }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let rafId
    let lastFireworkAt = 0
    let lastConfettiAt = 0
    let bursts = []
    let confetti = []

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const FIREWORK_COLORS = [GOLD, GOLD_BRIGHT, GOLD_DEEP, PURPLE, PURPLE_SOFT]
    const CONFETTI_COLORS = [GOLD, GOLD_BRIGHT, PURPLE, PURPLE_SOFT, '#F8FAFC']

    function resize() {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    function hexToRgba(hex, alpha) {
      const h = hex.replace('#', '')
      const bigint = parseInt(h, 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255
      return `rgba(${r},${g},${b},${Math.max(alpha, 0)})`
    }

    function spawnBurst() {
      // Origin sits near an edge, well clear of the center stage.
      const side = Math.floor(Math.random() * 4)
      const edgeMargin = 0.15
      let ox
      let oy
      if (side === 0) {
        ox = Math.random() * width * edgeMargin
        oy = height * (0.14 + Math.random() * 0.5)
      } else if (side === 1) {
        ox = width - Math.random() * width * edgeMargin
        oy = height * (0.14 + Math.random() * 0.5)
      } else if (side === 2) {
        ox = Math.random() * width
        oy = height * (0.04 + Math.random() * 0.14)
      } else {
        ox = Math.random() * width
        oy = height * (0.82 + Math.random() * 0.12)
      }

      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
      const count = 24 + Math.floor(Math.random() * 12)
      const sparks = []
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25
        const speed = Math.random() * 1.5 + 0.7
        sparks.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.01 + 0.011,
          color,
          size: Math.random() * 1.5 + 1,
        })
      }
      return sparks
    }

    function spawnConfettiPiece() {
      return {
        x: Math.random() * width,
        y: -10,
        w: Math.random() * 4.5 + 3,
        h: Math.random() * 8 + 5,
        speed: Math.random() * 0.45 + 0.28,
        drift: (Math.random() - 0.5) * 0.35,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.035,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        alpha: Math.random() * 0.35 + 0.45,
      }
    }

    function drawStatic() {
      // Reduced-motion: a single, calm frame with no moving parts.
      ctx.clearRect(0, 0, width, height)
    }

    function tick(ts) {
      ctx.clearRect(0, 0, width, height)
      const isActive = activeRef.current

      if (isActive && ts - lastFireworkAt > 650) {
        lastFireworkAt = ts
        bursts.push(...spawnBurst())
      }
      if (isActive && ts - lastConfettiAt > 90) {
        lastConfettiAt = ts
        confetti.push(spawnConfettiPiece())
      }

      bursts = bursts.filter((p) => p.life > 0)
      for (const p of bursts) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.012
        p.vx *= 0.985
        p.vy *= 0.985
        p.life -= p.decay
        ctx.beginPath()
        ctx.fillStyle = hexToRgba(p.color, p.life)
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      confetti = confetti.filter((c) => c.y < height + 20 && c.alpha > 0.02)
      for (const c of confetti) {
        c.y += c.speed
        c.x += c.drift
        c.rot += c.rotSpeed
        if (!isActive) c.alpha -= 0.004
        ctx.save()
        ctx.translate(c.x, c.y)
        ctx.rotate(c.rot)
        ctx.fillStyle = hexToRgba(c.color, c.alpha)
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h)
        ctx.restore()
      }

      rafId = requestAnimationFrame(tick)
    }

    resize()
    if (prefersReduced) {
      drawStatic()
    } else {
      rafId = requestAnimationFrame(tick)
    }

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
