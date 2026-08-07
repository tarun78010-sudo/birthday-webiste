import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'

const EASE = [0.16, 1, 0.3, 1]

const CANDLE_X_POSITIONS = [168, 186, 204, 222, 240]
const EXTINGUISH_DELAY_MS = 300
// last candle's extinguish fires at EXTINGUISH_DELAY_MS * count; give its
// own snuff-out animation (0.3s) a moment to finish before the afterglow
// (sparkle wave + background dim) begins.
const AFTERGLOW_DELAY_MS = EXTINGUISH_DELAY_MS * CANDLE_X_POSITIONS.length + 300
// the celebration text appears once the afterglow's own animation
// (background dim + sparkle wave, ~2s) has finished playing out.
const CELEBRATION_DELAY_MS = AFTERGLOW_DELAY_MS + 2000
// the final surprise button appears ~3s after the celebration content
// (title, badge, message) has finished revealing itself.
const FINAL_BUTTON_DELAY_MS = CELEBRATION_DELAY_MS + 3000

// /cake — the Birthday Cake scene.
// Static, premium-illustrated cake built entirely in SVG so it inherits
// the site's exact aurora/glass/gold-on-purple language with zero new
// assets. Candle-blowing interaction: clicking the button fades the
// button out, speeds up the flame flicker, then extinguishes each
// flame one by one (300ms apart). Once every candle is out, each wick
// releases a soft rising wisp of smoke that fades over a couple of
// seconds, a gentle sparkle wave blooms outward from the cake's
// center, and the scene dims briefly before settling back. No
// confetti, celebration text, gift button, or mic — just the candles
// and their afterglow.
export default function CakePage() {
  const navigate = useNavigate()
  const [isBlowingOut, setIsBlowingOut] = useState(false)
  const [extinguished, setExtinguished] = useState(() =>
    CANDLE_X_POSITIONS.map(() => false)
  )
  const [showAfterglow, setShowAfterglow] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showFinalButton, setShowFinalButton] = useState(false)
  const timeoutsRef = useRef([])

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id))
    }
  }, [])

  const handleBlowOutCandles = () => {
    if (isBlowingOut) return
    setIsBlowingOut(true)

    CANDLE_X_POSITIONS.forEach((_, i) => {
      const id = setTimeout(() => {
        setExtinguished((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, EXTINGUISH_DELAY_MS * (i + 1))
      timeoutsRef.current.push(id)
    })

    const afterglowId = setTimeout(() => {
      setShowAfterglow(true)
    }, AFTERGLOW_DELAY_MS)
    timeoutsRef.current.push(afterglowId)

    const celebrationId = setTimeout(() => {
      setShowCelebration(true)
    }, CELEBRATION_DELAY_MS)
    timeoutsRef.current.push(celebrationId)

    const finalButtonId = setTimeout(() => {
      setShowFinalButton(true)
    }, FINAL_BUTTON_DELAY_MS)
    timeoutsRef.current.push(finalButtonId)
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <AmbientGlow />
      <ParticleField density={44} tint="soft" />

      {/* brief, soft dimming of the scene right as the afterglow begins */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-[#0A0416]"
        initial={{ opacity: 0 }}
        animate={showAfterglow ? { opacity: [0, 0.32, 0] } : { opacity: 0 }}
        transition={{ duration: 1, ease: EASE, times: [0, 0.35, 1] }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative z-10 flex w-full max-w-xl flex-col items-center"
      >
        <span className="label-eyebrow">A Moment To Wish</span>

        <h1 className="mt-5 font-display text-3xl font-semibold leading-[1.15] text-gradient-aurora sm:text-5xl">
          ✨ Make A Birthday Wish ✨
        </h1>

        <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-mist sm:text-base">
          Close your eyes...
          <br />
          Make a birthday wish...
          <br />
          When you're ready...
        </p>

        <div className="relative mt-10 w-full max-w-sm sm:max-w-md">
          <CakeIllustration
            isBlowingOut={isBlowingOut}
            extinguished={extinguished}
            showAfterglow={showAfterglow}
          />
        </div>

        <motion.button
          type="button"
          onClick={handleBlowOutCandles}
          disabled={isBlowingOut}
          whileHover={isBlowingOut ? undefined : { scale: 1.03 }}
          whileTap={isBlowingOut ? undefined : { scale: 0.98 }}
          animate={{ opacity: isBlowingOut ? 0 : 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ pointerEvents: isBlowingOut ? 'none' : 'auto' }}
          className="btn-luxury mt-12 shadow-glow-purple"
        >
          🕯️ Blow Out The Candles
        </motion.button>

        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: EASE }}
            className="mt-12 flex w-full flex-col items-center"
          >
            <h2 className="font-display text-2xl font-semibold leading-[1.2] text-gradient-aurora sm:text-4xl">
              ✨ HAPPY BIRTHDAY KOMALI! ✨
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              className="mt-8 mb-8"
            >
              <span
                className="font-display text-xl font-semibold tracking-wide sm:text-2xl"
                style={{
                  background:
                    'linear-gradient(180deg, #FFF3C4 0%, #F4D888 45%, #B8892B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 10px rgba(244, 216, 136, 0.55))',
                }}
              >
                ✦ #424 ✦
              </span>
            </motion.div>

            <p className="max-w-md font-body text-sm leading-relaxed text-mist sm:text-base">
              May this year bring you happiness,
              <br />
              good health,
              <br />
              success,
              <br />
              and countless beautiful memories.
            </p>

            {showFinalButton && (
              <motion.button
                type="button"
                onClick={() => navigate('/gift')}
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
                className="btn-luxury mt-12 shadow-glow-purple"
              >
                🎁 Open Your Final Surprise
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}

function CakeIllustration({ isBlowingOut = false, extinguished = [], showAfterglow = false }) {
  return (
    <svg
      viewBox="0 0 420 480"
      className="w-full h-auto drop-shadow-[0_30px_60px_rgba(139,92,246,0.35)]"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A two-tier white buttercream birthday cake with purple ribbon, gold trim, roses, and a gold letter K topper"
    >
      <defs>
        <radialGradient id="standGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B8892B" />
          <stop offset="20%" stopColor="#F4D888" />
          <stop offset="50%" stopColor="#FFF3C4" />
          <stop offset="80%" stopColor="#F4D888" />
          <stop offset="100%" stopColor="#B8892B" />
        </linearGradient>

        <linearGradient id="goldTrimV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4D888" />
          <stop offset="50%" stopColor="#FFF3C4" />
          <stop offset="100%" stopColor="#B8892B" />
        </linearGradient>

        <linearGradient id="standMetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F4D888" />
          <stop offset="45%" stopColor="#D9A94A" />
          <stop offset="100%" stopColor="#8A6420" />
        </linearGradient>

        <linearGradient id="buttercream" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1EAF9" />
        </linearGradient>

        <linearGradient id="buttercreamSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBF8FF" />
          <stop offset="100%" stopColor="#E6DAF5" />
        </linearGradient>

        <linearGradient id="purpleRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <radialGradient id="pearl" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF9E5" />
          <stop offset="60%" stopColor="#F4D888" />
          <stop offset="100%" stopColor="#B8892B" />
        </radialGradient>

        <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#2A1550" floodOpacity="0.45" />
        </filter>

        <linearGradient id="plaqueGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCEAA0" />
          <stop offset="45%" stopColor="#E8C766" />
          <stop offset="100%" stopColor="#9C7420" />
        </linearGradient>

        <filter id="plaqueShadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="1.6" floodColor="#1A0F33" floodOpacity="0.4" />
        </filter>

        <filter id="smokeBlur" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* soft spotlight pool beneath the whole cake */}
      <ellipse cx="210" cy="430" rx="190" ry="42" fill="url(#standGlow)" />

      {/* ---------- cake stand ---------- */}
      <ellipse cx="210" cy="432" rx="150" ry="16" fill="#150B2E" opacity="0.5" />
      <ellipse cx="210" cy="424" rx="148" ry="15" fill="url(#standMetal)" />
      <ellipse cx="210" cy="420" rx="148" ry="15" fill="url(#goldTrim)" />
      <rect x="198" y="392" width="24" height="30" fill="url(#standMetal)" />
      <ellipse cx="210" cy="392" rx="118" ry="12" fill="url(#goldTrim)" />
      <ellipse cx="210" cy="389" rx="118" ry="11" fill="url(#standMetal)" opacity="0.9" />

      {/* ---------- bottom tier ---------- */}
      <g filter="url(#softShadow)">
        <rect x="90" y="300" width="240" height="92" rx="14" fill="url(#buttercreamSide)" />
        <rect x="90" y="300" width="240" height="26" rx="13" fill="url(#buttercream)" />
        {/* subtle piped texture */}
        {[110, 134, 158, 182, 206, 230, 254, 278, 302].map((x) => (
          <path
            key={x}
            d={`M${x} 330 q6 8 0 16 q-6 8 0 16 q6 8 0 16`}
            stroke="#E8DEF7"
            strokeWidth="2"
            fill="none"
            opacity="0.55"
          />
        ))}
        {/* gold trim bands */}
        <rect x="90" y="322" width="240" height="4" fill="url(#goldTrim)" />
        <rect x="90" y="386" width="240" height="4" fill="url(#goldTrim)" />
        {/* purple ribbon */}
        <rect x="90" y="352" width="240" height="20" fill="url(#purpleRibbon)" />
        <rect x="90" y="352" width="240" height="3" fill="#F4D888" opacity="0.7" />
        <rect x="90" y="369" width="240" height="3" fill="#F4D888" opacity="0.7" />

        {/* small gold nameplate plaque, centered on the ribbon */}
        <g filter="url(#plaqueShadow)">
          <rect
            x="190"
            y="354"
            width="40"
            height="16"
            rx="8"
            fill="url(#plaqueGold)"
            stroke="#7A5A18"
            strokeWidth="0.6"
          />
          <rect
            x="191.5"
            y="355.5"
            width="37"
            height="6"
            rx="3"
            fill="#FFF6D9"
            opacity="0.35"
          />
          <text
            x="210"
            y="365.5"
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontWeight="600"
            fontSize="9"
            letterSpacing="0.5"
            fill="#5C3E10"
          >
            424
          </text>
        </g>
      </g>

      {/* ---------- top tier ---------- */}
      <g filter="url(#softShadow)">
        <rect x="140" y="205" width="140" height="80" rx="12" fill="url(#buttercreamSide)" />
        <rect x="140" y="205" width="140" height="22" rx="11" fill="url(#buttercream)" />
        {[156, 176, 196, 216, 236, 256, 264]
          .filter((x) => x <= 264)
          .map((x) => (
            <path
              key={x}
              d={`M${x} 232 q5 7 0 14 q-5 7 0 14 q5 7 0 14`}
              stroke="#E8DEF7"
              strokeWidth="1.6"
              fill="none"
              opacity="0.5"
            />
          ))}
        <rect x="140" y="224" width="140" height="3.5" fill="url(#goldTrim)" />
        <rect x="140" y="277" width="140" height="3.5" fill="url(#goldTrim)" />
        <rect x="140" y="248" width="140" height="16" fill="url(#purpleRibbon)" />
        <rect x="140" y="248" width="140" height="2.5" fill="#F4D888" opacity="0.7" />
        <rect x="140" y="261.5" width="140" height="2.5" fill="#F4D888" opacity="0.7" />
      </g>

      {/* ---------- florals on bottom tier ---------- */}
      <Rose x={112} y={300} scale={1} />
      <Rose x={308} y={300} scale={1} />
      <PurpleBloom x={150} y={302} />
      <PurpleBloom x={270} y={302} />
      <PurpleBloom x={210} y={306} small />

      {/* gold pearls scattered along the ribbon edges */}
      <circle cx="104" cy="361" r="3" fill="url(#pearl)" />
      <circle cx="126" cy="361" r="3" fill="url(#pearl)" />
      <circle cx="294" cy="361" r="3" fill="url(#pearl)" />
      <circle cx="316" cy="361" r="3" fill="url(#pearl)" />
      <circle cx="156" cy="255" r="2.4" fill="url(#pearl)" />
      <circle cx="264" cy="255" r="2.4" fill="url(#pearl)" />

      {/* ---------- florals on top tier ---------- */}
      <Rose x={150} y={205} scale={0.75} />
      <Rose x={270} y={205} scale={0.75} />
      <PurpleBloom x={210} y={207} />

      {/* ---------- five candles ---------- */}
      {CANDLE_X_POSITIONS.map((x, i) => {
        const isOut = extinguished[i]
        const flameAnimate = isOut
          ? { opacity: 0, scaleY: 0.15, y: 4 }
          : isBlowingOut
          ? { opacity: [1, 0.55, 1, 0.7, 1], scaleY: [1, 0.8, 1.05, 0.85, 1] }
          : { opacity: [1, 0.92, 1], scaleY: [1, 0.97, 1] }
        const flameTransition = isOut
          ? { duration: 0.3, ease: EASE }
          : isBlowingOut
          ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }

        return (
          <g key={x}>
            <rect x={x} y={168} width="5" height="38" rx="2.5" fill={i % 2 === 0 ? '#C084FC' : '#F8FAFC'} />
            <rect x={x} y={168} width="5" height="6" rx="2.5" fill="url(#goldTrim)" />
            <motion.g
              style={{ transformOrigin: `${x + 2.5}px 167px` }}
              animate={flameAnimate}
              transition={flameTransition}
            >
              <path
                d={`M${x + 2.5} 150 c 5 6 5 12 0 17 c -5 -5 -5 -11 0 -17 Z`}
                fill="#FCD34D"
              />
              <path
                d={`M${x + 2.5} 155 c 3 4 3 7 0 10 c -3 -3 -3 -6 0 -10 Z`}
                fill="#FFF7E0"
              />
            </motion.g>

            {/* soft wisp of smoke, released once this candle is snuffed out */}
            {isOut && (
              <motion.g
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.42, 0.28, 0], y: -30 }}
                transition={{ duration: 2.6, ease: 'easeOut', times: [0, 0.18, 0.6, 1] }}
              >
                <ellipse
                  cx={x + 2.5}
                  cy={144}
                  rx="2.4"
                  ry="4.5"
                  fill="#D9D4E6"
                  opacity="0.55"
                  filter="url(#smokeBlur)"
                />
                <ellipse
                  cx={x + 1.2}
                  cy={132}
                  rx="3.4"
                  ry="5.5"
                  fill="#D9D4E6"
                  opacity="0.35"
                  filter="url(#smokeBlur)"
                />
                <ellipse
                  cx={x + 3.6}
                  cy={119}
                  rx="4.2"
                  ry="6.5"
                  fill="#D9D4E6"
                  opacity="0.2"
                  filter="url(#smokeBlur)"
                />
              </motion.g>
            )}
          </g>
        )
      })}

      {/* ---------- sparkle wave, blooming from the cake's center once all candles are out ---------- */}
      {showAfterglow && (
        <g>
          <motion.circle
            cx={210}
            cy={260}
            r={8}
            fill="none"
            stroke="url(#goldTrim)"
            strokeWidth="1.4"
            initial={{ opacity: 0.85, scale: 0 }}
            animate={{ opacity: [0.85, 0.4, 0], scale: [0, 5.5, 8] }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{ transformOrigin: '210px 260px' }}
          />
          <motion.circle
            cx={210}
            cy={260}
            r={8}
            fill="none"
            stroke="#C084FC"
            strokeWidth="0.9"
            initial={{ opacity: 0.6, scale: 0 }}
            animate={{ opacity: [0.6, 0.25, 0], scale: [0, 4, 6.4] }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.12 }}
            style={{ transformOrigin: '210px 260px' }}
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 210 260)`}>
              <motion.path
                d="M210 260 l1.2 -4.4 l1.2 4.4 l4.4 1.2 l-4.4 1.2 l-1.2 4.4 l-1.2 -4.4 l-4.4 -1.2 z"
                fill="#FCEAA0"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: [0, 1, 0], y: -66 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
              />
            </g>
          ))}
        </g>
      )}

      {/* ---------- gold "K" topper with small crown ---------- */}
      <g>
        <path
          d="M198 118 l4 -9 4 6 4 -6 4 9 -3 1 -2.5 -5 -2.5 5 -2.5 -5 -2.5 5 z"
          fill="url(#goldTrim)"
          stroke="#8A6420"
          strokeWidth="0.5"
        />
        <circle cx="202" cy="108" r="1.6" fill="#F4D888" />
        <circle cx="210" cy="105" r="1.8" fill="#F4D888" />
        <circle cx="218" cy="108" r="1.6" fill="#F4D888" />
        <text
          x="210"
          y="148"
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fontSize="30"
          fill="url(#goldTrimV)"
          stroke="#8A6420"
          strokeWidth="0.6"
        >
          K
        </text>
      </g>
    </svg>
  )
}

function Rose({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle r="9" fill="#FBF8FF" />
      <circle r="6.2" fill="#F3EAFB" />
      <circle r="3.6" fill="#FFFFFF" />
      <circle cx="-4" cy="-2" r="3.4" fill="#F3EAFB" opacity="0.9" />
      <circle cx="4" cy="-2" r="3.4" fill="#F3EAFB" opacity="0.9" />
      <circle cx="0" cy="4" r="3.4" fill="#F3EAFB" opacity="0.9" />
    </g>
  )
}

function PurpleBloom({ x, y, small = false }) {
  const r = small ? 4.5 : 6
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx={0}
          cy={-r * 0.7}
          rx={r * 0.42}
          ry={r * 0.7}
          fill="#C084FC"
          opacity="0.9"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r={r * 0.35} fill="#FFF3C4" />
    </g>
  )
}
