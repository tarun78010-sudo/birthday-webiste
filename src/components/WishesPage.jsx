import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'

const EASE = [0.16, 1, 0.3, 1]

// "Three Wishes" — reached via the "Continue →" button at the end of
// "Why I Built This" (StoryPage.jsx, which already navigates to
// /wishes — that wiring is untouched). Three tappable glass cards,
// each opening to reveal a wish. Once all three are open, a thank-you
// line fades in, and a glowing "View Memories" button follows two
// seconds later, leading to the (placeholder) /memories route.

const WISHES = [
  {
    id: 'happiness',
    emoji: '🌸',
    title: 'Happiness',
    message:
      'May your smile always stay bright, and may every new day give you another reason to smile.',
  },
  {
    id: 'dreams',
    emoji: '⭐',
    title: 'Dreams',
    message:
      'May every dream you chase bring you one step closer to the life you imagine.',
  },
  {
    id: 'success',
    emoji: '💜',
    title: 'Success',
    message:
      'Wishing you success, good health, confidence, peace, and countless beautiful memories.',
  },
]

// Same soft neon glow used by .glass-panel-neon, and a brighter peak
// for it to breathe toward — kept in sync with tailwind.config.js's
// 'neon-border' shadow so the pulse reads as the same design language,
// just alive.
const GLOW_SOFT =
  '0 0 0 1px rgba(168,85,247,0.18), 0 0 34px -4px rgba(139,92,246,0.4), 0 0 70px -20px rgba(168,85,247,0.35)'
const GLOW_BRIGHT =
  '0 0 0 1px rgba(168,85,247,0.38), 0 0 52px -4px rgba(139,92,246,0.65), 0 0 95px -15px rgba(168,85,247,0.55)'

const BUTTON_DELAY_SECONDS = 2

function WishCard({ wish, isOpen, onOpen, index }) {
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 4.5 + index * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.4,
      }}
    >
      <motion.button
        type="button"
        onClick={() => onOpen(wish.id)}
        disabled={isOpen}
        aria-expanded={isOpen}
        whileHover={isOpen ? undefined : { y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        animate={{ boxShadow: [GLOW_SOFT, GLOW_BRIGHT, GLOW_SOFT] }}
        transition={{
          boxShadow: {
            duration: 5,
            repeat: Infinity,
            delay: index * 1.2,
            ease: 'easeInOut',
          },
        }}
        className={`glass-panel-neon flex w-full flex-col items-center px-6 py-8 text-center transition-colors duration-300 sm:px-8 sm:py-10 ${
          isOpen ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <span className="text-4xl sm:text-5xl" aria-hidden="true">
          {wish.emoji}
        </span>

        <h3 className="mt-4 font-display text-lg font-semibold text-ivory sm:text-xl">
          {wish.title}
        </h3>

        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="label-eyebrow mt-4 text-[10px]"
            >
              ✨ Tap to open
            </motion.span>
          )}

          {isOpen && (
            <motion.p
              key="message"
              initial={{ opacity: 0, height: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-4 overflow-hidden font-body text-sm leading-relaxed text-mist sm:text-base"
            >
              {wish.message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

export default function WishesPage() {
  const navigate = useNavigate()
  const [openedIds, setOpenedIds] = useState(() => new Set())
  const [showMemoriesButton, setShowMemoriesButton] = useState(false)

  const allOpened = openedIds.size === WISHES.length

  const handleOpen = (id) => {
    setOpenedIds((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  useEffect(() => {
    if (!allOpened) return
    const t = setTimeout(() => setShowMemoriesButton(true), BUTTON_DELAY_SECONDS * 1000)
    return () => clearTimeout(t)
  }, [allOpened])

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <AmbientGlow />
      <ParticleField density={44} tint="soft" />

      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
      >
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="label-eyebrow"
        >
          One more chapter
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: EASE }}
          className="mt-6 font-display text-3xl font-semibold leading-[1.15] text-gradient-aurora sm:text-4xl"
        >
          ✨ Three Wishes For You ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          className="mt-5 font-body text-sm text-mist sm:text-base"
        >
          Each card holds a special birthday wish.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
          className="mt-1.5 font-body text-xs text-mist/80 sm:text-sm"
        >
          ✨ Tap each card to reveal what's inside.
        </motion.p>

        <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {WISHES.map((wish, index) => (
            <WishCard
              key={wish.id}
              wish={wish}
              index={index}
              isOpen={openedIds.has(wish.id)}
              onOpen={handleOpen}
            />
          ))}
        </div>

        <AnimatePresence>
          {allOpened && (
            <motion.p
              key="thank-you"
              initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: EASE }}
              className="mt-12 font-display text-lg font-medium text-ivory sm:text-xl"
            >
              ✨ Thank you for reading every wish.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMemoriesButton && (
            <motion.button
              key="memories-button"
              type="button"
              onClick={() => navigate('/memories')}
              initial={{ opacity: 0, y: 14, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
              transition={{ duration: 0.9, ease: EASE }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-luxury shadow-glow-purple mt-8 cursor-pointer gap-2.5 px-9 py-3.5 text-xs uppercase tracking-[0.25em] sm:text-sm"
            >
              <span>📸 View Memories</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
