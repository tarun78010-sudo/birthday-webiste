import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'

const EASE = [0.16, 1, 0.3, 1]

// timings for the untie → lid-open → light → message → continue sequence
const RIBBON_UNTIE_MS = 900
const BOW_FALL_MS = 700
const LID_OPEN_DELAY_MS = RIBBON_UNTIE_MS + 250
const LID_OPEN_MS = 1100
const LIGHT_DELAY_MS = LID_OPEN_DELAY_MS + 500
const MESSAGE_DELAY_MS = LIGHT_DELAY_MS + 1400

// the reveal message, split so each paragraph rises from inside the box
// one at a time, each holding for ~600ms before the next begins
const MESSAGE_LINES = [
  "✨ The best gifts aren't always inside a box.",
  'Your real birthday gift is waiting...',
  "I'll give it to you soon. 🎁",
]

// per-paragraph reveal duration + the pause that follows it before the
// next paragraph begins rising, used to build a cumulative delay schedule
const LINE_RISE_MS = 950
const LINE_PAUSE_MS = 600
const LINE_DELAYS_MS = MESSAGE_LINES.map(
  (_, i) => i * (LINE_RISE_MS + LINE_PAUSE_MS)
)
const MESSAGE_SEQUENCE_MS =
  LINE_DELAYS_MS[LINE_DELAYS_MS.length - 1] + LINE_RISE_MS
const CONTINUE_DELAY_MS = MESSAGE_DELAY_MS + MESSAGE_SEQUENCE_MS + 900

// how far the message travels upward, out of the box, before settling
// (kept well clear of the lid so it never overlaps the opened box)
const MESSAGE_RISE_PX = 200

// /gift — Scene 7, "One Last Surprise". A closed luxury gift box that,
// once untied, opens to a warm glow and rising sparkles — but reveals
// no actual gift. The real gift is given in person; this scene exists
// purely to build anticipation before handing off to /finale.
export default function GiftPage() {
  const navigate = useNavigate()
  const [isOpening, setIsOpening] = useState(false)
  const [ribbonUntied, setRibbonUntied] = useState(false)
  const [bowFallen, setBowFallen] = useState(false)
  const [lidOpen, setLidOpen] = useState(false)
  const [showLight, setShowLight] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const timeoutsRef = useRef([])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id))
    }
  }, [])

  const handleUntieRibbon = () => {
    if (isOpening) return
    setIsOpening(true)

    const t1 = setTimeout(() => setRibbonUntied(true), 10)
    const t2 = setTimeout(() => setBowFallen(true), 150)
    const t3 = setTimeout(() => setLidOpen(true), LID_OPEN_DELAY_MS)
    const t4 = setTimeout(() => setShowLight(true), LIGHT_DELAY_MS)
    const t5 = setTimeout(() => setShowMessage(true), MESSAGE_DELAY_MS)
    const t6 = setTimeout(() => setShowContinue(true), CONTINUE_DELAY_MS)

    timeoutsRef.current.push(t1, t2, t3, t4, t5, t6)
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <AmbientGlow />
      <ParticleField density={44} tint="soft" />

      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative z-10 flex w-full max-w-xl flex-col items-center"
      >
        <span className="label-eyebrow">Scene Seven</span>

        <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.15] text-gradient-aurora sm:text-5xl">
          🎁 One Last Surprise
        </h1>

        <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-mist sm:text-base">
          There's still one more surprise waiting...
        </p>

        <div className="relative mt-14 w-full max-w-xs sm:max-w-sm">
          <GiftBoxIllustration
            isOpening={isOpening}
            ribbonUntied={ribbonUntied}
            bowFallen={bowFallen}
            lidOpen={lidOpen}
            showLight={showLight}
          />

          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: -MESSAGE_RISE_PX, filter: 'blur(0px)' }}
              transition={{ duration: 1.7, ease: EASE }}
              className="pointer-events-none absolute inset-x-0 z-20 flex flex-col items-center gap-9 px-6"
              style={{ top: '34%' }}
            >
              {/* golden rays radiating behind the emerging message, sourced
                  from the glowing box below */}
              <GoldenRays />

              {MESSAGE_LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 46, filter: 'blur(16px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: LINE_RISE_MS / 1000,
                    ease: EASE,
                    delay: LINE_DELAYS_MS[i] / 1000,
                  }}
                  className="relative z-10 max-w-[19rem] font-body text-sm font-medium leading-relaxed text-amber-50 sm:max-w-sm sm:text-base"
                  style={{
                    textShadow:
                      '0 0 14px rgba(244,216,136,0.75), 0 0 32px rgba(244,216,136,0.45), 0 0 48px rgba(192,132,252,0.25)',
                  }}
                >
                  {line}
                  {/* tiny golden particles that follow this paragraph as it rises */}
                  <EmberParticles delaySeconds={LINE_DELAYS_MS[i] / 1000} />
                </motion.p>
              ))}

              {/* small sparkles gently orbiting the settled message */}
              <OrbitingSparkles />
            </motion.div>
          )}
        </div>

        {!isOpening && (
          <motion.button
            type="button"
            onClick={handleUntieRibbon}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="btn-luxury mt-14 shadow-glow-purple"
          >
            ✨ Untie The Ribbon
          </motion.button>
        )}

        {showContinue && (
          <motion.button
            type="button"
            onClick={() => navigate('/finale')}
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                '0 0 24px rgba(244, 216, 136, 0.35), 0 0 46px rgba(192, 132, 252, 0.28)',
                '0 0 34px rgba(244, 216, 136, 0.55), 0 0 64px rgba(192, 132, 252, 0.42)',
                '0 0 24px rgba(244, 216, 136, 0.35), 0 0 46px rgba(192, 132, 252, 0.28)',
              ],
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              opacity: { duration: 1, ease: EASE },
              y: { duration: 1, ease: EASE },
              boxShadow: {
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              },
            }}
            className="btn-luxury mt-10 shadow-glow-purple"
          >
            ✨ Continue
          </motion.button>
        )}
      </motion.div>
    </main>
  )
}

function GiftBoxIllustration({ isOpening, ribbonUntied, bowFallen, lidOpen, showLight }) {
  return (
    <svg
      viewBox="0 0 360 340"
      className="w-full h-auto drop-shadow-[0_30px_60px_rgba(139,92,246,0.35)]"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A deep royal purple luxury gift box with a gold ribbon and bow"
    >
      <defs>
        <radialGradient id="giftGlow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="boxPurple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5B3AA6" />
          <stop offset="55%" stopColor="#3E2478" />
          <stop offset="100%" stopColor="#271552" />
        </linearGradient>

        <linearGradient id="lidPurple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6D46C2" />
          <stop offset="60%" stopColor="#4A2B8F" />
          <stop offset="100%" stopColor="#2E1860" />
        </linearGradient>

        <linearGradient id="giftGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8892B" />
          <stop offset="20%" stopColor="#F4D888" />
          <stop offset="50%" stopColor="#FFF3C4" />
          <stop offset="80%" stopColor="#F4D888" />
          <stop offset="100%" stopColor="#B8892B" />
        </linearGradient>

        <linearGradient id="giftGoldV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="50%" stopColor="#F4D888" />
          <stop offset="100%" stopColor="#B8892B" />
        </linearGradient>

        <radialGradient id="innerLight" cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFF3C4" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#F4D888" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F4D888" stopOpacity="0" />
        </radialGradient>

        <filter id="giftSoftShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#180B34" floodOpacity="0.5" />
        </filter>

        <filter id="giftSparkleBlur" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* floor glow beneath the box */}
      <ellipse cx="180" cy="292" rx="140" ry="26" fill="url(#giftGlow)" />

      {/* slow float wrapper for the entire box */}
      <motion.g
        animate={
          isOpening
            ? { y: 0 }
            : { y: [0, -10, 0] }
        }
        transition={
          isOpening
            ? { duration: 0.6, ease: EASE }
            : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* warm golden light glowing up from inside once the lid opens */}
        {showLight && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <ellipse cx="180" cy="150" rx="120" ry="90" fill="url(#innerLight)" />
          </motion.g>
        )}

        {/* ---------- box base ---------- */}
        <g filter="url(#giftSoftShadow)">
          <rect x="70" y="160" width="220" height="130" rx="10" fill="url(#boxPurple)" />
          {/* vertical gold ribbon strap on the base, front face */}
          <rect x="163" y="160" width="34" height="130" fill="url(#giftGold)" opacity="0.95" />
        </g>

        {/* horizontal ribbon strap wrapping around the base, in front of the box */}
        <motion.rect
          x="70"
          y="212"
          width="220"
          height="30"
          fill="url(#giftGold)"
          style={{ transformOrigin: '180px 227px' }}
          animate={
            ribbonUntied
              ? { scaleX: 0, opacity: 0 }
              : { scaleX: 1, opacity: 1 }
          }
          transition={{ duration: RIBBON_UNTIE_MS / 1000, ease: EASE }}
        />

        {/* ---------- lid ---------- */}
        <motion.g
          style={{ transformOrigin: '180px 160px' }}
          animate={
            lidOpen
              ? { rotate: -18, y: -26, x: -10 }
              : { rotate: 0, y: 0, x: 0 }
          }
          transition={{ duration: LID_OPEN_MS / 1000, ease: EASE }}
        >
          <g filter="url(#giftSoftShadow)">
            <rect x="58" y="132" width="244" height="34" rx="9" fill="url(#lidPurple)" />
            <rect x="58" y="132" width="244" height="10" rx="5" fill="#7C56D6" opacity="0.55" />
          </g>
          {/* gold strap across the lid, front */}
          <rect x="163" y="132" width="34" height="34" fill="url(#giftGold)" opacity="0.95" />

          {/* ---------- bow, sits on the lid, falls away once untied ---------- */}
          {!bowFallen ? (
            <BowIllustration x={180} y={128} opacity={1} />
          ) : (
            <motion.g
              initial={{ opacity: 1, y: 0, rotate: 0 }}
              animate={{ opacity: 0, y: 60, rotate: 55 }}
              transition={{ duration: BOW_FALL_MS / 1000, ease: 'easeIn' }}
            >
              <BowIllustration x={180} y={128} opacity={1} />
            </motion.g>
          )}
        </motion.g>

        {/* soft glowing edge line along the box rim for a premium finish */}
        <rect x="70" y="160" width="220" height="130" rx="10" fill="none" stroke="#C084FC" strokeOpacity="0.28" strokeWidth="1.5" />

        {/* rising sparkles once the lid is open */}
        {showLight &&
          SPARKLE_POSITIONS.map((s, i) => (
            <motion.circle
              key={i}
              cx={180 + s.dx}
              cy={150}
              r={s.r}
              fill="#FCEAA0"
              filter="url(#giftSparkleBlur)"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: -90 - s.dx * 0.3 }}
              transition={{
                duration: 3.2 + s.delay,
                repeat: Infinity,
                ease: 'easeOut',
                delay: s.delay,
              }}
            />
          ))}
      </motion.g>
    </svg>
  )
}

// small, evenly-spaced offsets so the rising sparkles feel organic but
// stay deterministic across renders
const SPARKLE_POSITIONS = [
  { dx: -46, r: 1.6, delay: 0 },
  { dx: -18, r: 1.2, delay: 0.5 },
  { dx: 6, r: 1.8, delay: 1 },
  { dx: 30, r: 1.3, delay: 0.3 },
  { dx: 50, r: 1.5, delay: 0.8 },
  { dx: -32, r: 1.1, delay: 1.4 },
  { dx: 16, r: 1.4, delay: 1.7 },
]

function BowIllustration({ x, y, opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <ellipse cx="-16" cy="-2" rx="17" ry="11" fill="url(#giftGoldV)" transform="rotate(-18 -16 -2)" />
      <ellipse cx="16" cy="-2" rx="17" ry="11" fill="url(#giftGoldV)" transform="rotate(18 16 -2)" />
      <ellipse cx="-16" cy="-2" rx="10" ry="6.5" fill="#FFF3C4" opacity="0.5" transform="rotate(-18 -16 -2)" />
      <ellipse cx="16" cy="-2" rx="10" ry="6.5" fill="#FFF3C4" opacity="0.5" transform="rotate(18 16 -2)" />
      <path d="M-4 4 L-14 22 L-4 18 Z" fill="url(#giftGoldV)" />
      <path d="M4 4 L14 22 L4 18 Z" fill="url(#giftGoldV)" />
      <circle r="8" fill="url(#giftGold)" stroke="#8A6420" strokeWidth="0.6" />
    </g>
  )
}

// slow-rotating golden rays glowing behind the emerging message, echoing
// the warm light spilling from inside the open box
function GoldenRays() {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -z-10 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 sm:h-[26rem] sm:w-[26rem]"
      style={{
        background:
          'conic-gradient(from 0deg, rgba(244,216,136,0.32) 0deg, rgba(244,216,136,0) 22deg, rgba(244,216,136,0) 44deg, rgba(244,216,136,0.28) 66deg, rgba(244,216,136,0) 88deg, rgba(244,216,136,0) 110deg, rgba(192,132,252,0.22) 132deg, rgba(244,216,136,0) 154deg, rgba(244,216,136,0) 176deg, rgba(244,216,136,0.3) 198deg, rgba(244,216,136,0) 220deg, rgba(244,216,136,0) 242deg, rgba(192,132,252,0.22) 264deg, rgba(244,216,136,0) 286deg, rgba(244,216,136,0) 308deg, rgba(244,216,136,0.3) 330deg, rgba(244,216,136,0) 360deg)',
        maskImage: 'radial-gradient(circle, black 0%, black 40%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(circle, black 0%, black 40%, transparent 72%)',
      }}
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      transition={{
        opacity: { duration: 1.4, ease: EASE },
        rotate: { duration: 26, repeat: Infinity, ease: 'linear' },
      }}
    />
  )
}

// tiny sparkles gently orbiting the settled message, each on its own
// radius and speed for an organic, unsynchronized drift
const ORBIT_SPARKLES = [
  { radius: 118, size: 5, duration: 9, delay: 0, reverse: false },
  { radius: 96, size: 4, duration: 12, delay: 0.6, reverse: true },
  { radius: 138, size: 3, duration: 15, delay: 1.1, reverse: false },
  { radius: 104, size: 4, duration: 11, delay: 1.8, reverse: true },
  { radius: 130, size: 3, duration: 13.5, delay: 0.3, reverse: true },
]

// a few tiny golden embers that drift up alongside a single paragraph
// while it rises, then fade — as if the words are condensing out of light
const EMBER_OFFSETS = [
  { x: -34, delay: 0 },
  { x: 10, delay: 0.12 },
  { x: 30, delay: 0.24 },
]

function EmberParticles({ delaySeconds }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {EMBER_OFFSETS.map((e, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 3,
            left: `calc(50% + ${e.x}px)`,
            bottom: 0,
            background: 'radial-gradient(circle, #FFF3C4 0%, #F4D888 55%, transparent 100%)',
            boxShadow: '0 0 6px rgba(244,216,136,0.9), 0 0 12px rgba(244,216,136,0.4)',
          }}
          initial={{ opacity: 0, y: 40, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], y: -18, scale: [0.6, 1, 0.7] }}
          transition={{
            duration: LINE_RISE_MS / 1000 + 0.3,
            ease: EASE,
            delay: delaySeconds + e.delay,
          }}
        />
      ))}
    </span>
  )
}

function OrbitingSparkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {ORBIT_SPARKLES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{ width: 0, height: 0 }}
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: s.reverse ? -360 : 360, opacity: 1 }}
          transition={{
            rotate: { duration: s.duration, repeat: Infinity, ease: 'linear', delay: s.delay },
            opacity: { duration: 1, ease: EASE, delay: 0.6 + s.delay * 0.2 },
          }}
        >
          <motion.span
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              left: s.radius,
              top: 0,
              background: 'radial-gradient(circle, #FFF3C4 0%, #F4D888 55%, transparent 100%)',
              boxShadow: '0 0 8px rgba(244,216,136,0.85), 0 0 16px rgba(192,132,252,0.35)',
            }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
          />
        </motion.div>
      ))}
    </div>
  )
}
