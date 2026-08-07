import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AmbientGlow from './AmbientGlow.jsx'
import ParticleField from './ParticleField.jsx'

const EASE = [0.16, 1, 0.3, 1]

// "A Letter For You" — Scene reached via the "Continue →" button at the
// end of "A Few Beautiful Memories" (MemoriesPage.jsx, which already
// navigates to /birthday-letter — that wiring is untouched).
//
// A premium cream-and-gold envelope, sealed with a wax "K" seal (no
// hearts, no romantic iconography — this is a birthday surprise from a
// friend, not a love letter). Tapping the seal breaks it, the flap
// lifts, and an elegant letter unfolds. Paragraphs reveal one at a
// time with a soft fade + blur, at a comfortable reading pace, and the
// letter never auto-closes. Once fully read, a glowing button leads to
// the (placeholder) /cake route.

const LETTER_CONTENT = [
  { type: 'text', content: 'Dear Komali,' },
  { type: 'text', content: '✨ Happy Birthday!' },
  {
    type: 'text',
    content:
      'Today is your special day, and I wanted to do something a little different.',
  },
  {
    type: 'text',
    content:
      'Instead of sending just another birthday message, I decided to create this small experience especially for you.',
  },
  {
    type: 'text',
    content:
      'I hope every page, every animation, and every little surprise brought a smile to your face.',
  },
  { type: 'text', content: 'Thank you for being such a wonderful friend.' },
  {
    type: 'text',
    content:
      'May this year bring you happiness, success, good health, exciting opportunities, and countless beautiful memories.',
  },
  {
    type: 'text',
    content:
      'Keep smiling, keep believing in yourself, and keep enjoying every moment life brings your way.',
  },
  { type: 'text', content: '✨ Happy Birthday once again!' },
  { type: 'signature', lines: ['With Best Wishes,', 'Tarun'] },
]

// Warm gold / cream palette, kept local to this scene — the rest of
// the site stays on its midnight + purple theme untouched.
const GOLD = '#C9A227'
const GOLD_BRIGHT = '#F0D98C'
const GOLD_DEEP = '#8A6415'
const CREAM_LIGHT = '#FDF8EA'
const CREAM = '#F3E6C4'
const CREAM_DEEP = '#E6D2A0'
const INK = '#3A2E17'

const SEAL_GLOW_SOFT =
  '0 4px 16px rgba(0,0,0,0.45), 0 0 18px rgba(212,175,55,0.45), inset 0 1px 1px rgba(255,255,255,0.35)'
const SEAL_GLOW_BRIGHT =
  '0 4px 16px rgba(0,0,0,0.45), 0 0 30px rgba(240,217,140,0.75), inset 0 1px 1px rgba(255,255,255,0.45)'

export default function BirthdayLetterPage() {
  const navigate = useNavigate()

  const [breaking, setBreaking] = useState(false)
  const [flapOpen, setFlapOpen] = useState(false)
  const [envelopeGone, setEnvelopeGone] = useState(false)
  const [showLetter, setShowLetter] = useState(false)

  const handleSealClick = () => {
    if (breaking) return
    setBreaking(true)
    const t1 = setTimeout(() => setFlapOpen(true), 450)
    const t2 = setTimeout(() => setEnvelopeGone(true), 1500)
    const t3 = setTimeout(() => setShowLetter(true), 2150)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }

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
        <AnimatePresence mode="wait">
          {!showLetter ? (
            <motion.div
              key="envelope-scene"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex w-full flex-col items-center"
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
                ✉️ A Letter For You
              </motion.h1>

              {/* Envelope */}
              <motion.div
                animate={
                  envelopeGone
                    ? { opacity: 0, y: -24, scale: 0.94, filter: 'blur(10px)' }
                    : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                }
                transition={{ duration: 0.65, ease: EASE }}
                className="relative mt-12 w-[86vw] max-w-[340px] sm:mt-14"
                style={{ perspective: 1200 }}
              >
                <div
                  className="relative w-full"
                  style={{ aspectRatio: '3 / 2' }}
                >
                  {/* Envelope body */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-2xl"
                    style={{
                      border: `2px solid ${GOLD}`,
                      background: `linear-gradient(160deg, ${CREAM_LIGHT} 0%, ${CREAM} 55%, ${CREAM_DEEP} 100%)`,
                      boxShadow:
                        '0 24px 60px -18px rgba(0,0,0,0.55), 0 0 46px -12px rgba(212,175,55,0.4)',
                    }}
                  >
                    {/* Inner front V-fold seams, for a touch of realism */}
                    <div className="absolute inset-x-0 bottom-0 h-[62%] overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 h-full w-1/2"
                        style={{
                          clipPath: 'polygon(0 100%, 0 0, 100% 100%)',
                          background:
                            'linear-gradient(135deg, rgba(138,100,21,0.16), transparent)',
                        }}
                      />
                      <div
                        className="absolute bottom-0 right-0 h-full w-1/2"
                        style={{
                          clipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
                          background:
                            'linear-gradient(225deg, rgba(138,100,21,0.16), transparent)',
                        }}
                      />
                    </div>

                    {/* Faint gold foil border, set slightly inside the edge */}
                    <div
                      className="pointer-events-none absolute inset-[6px] rounded-xl"
                      style={{ border: `1px solid rgba(201,162,39,0.35)` }}
                    />
                  </div>

                  {/* Flap */}
                  <motion.div
                    className="absolute inset-x-0 top-0 h-[58%] origin-top"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      background: `linear-gradient(165deg, ${CREAM_LIGHT} 0%, ${CREAM} 55%, ${CREAM_DEEP} 100%)`,
                      borderTop: `2px solid ${GOLD}`,
                      boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.1)',
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateX: flapOpen ? -165 : 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                  />

                  {/* Wax seal */}
                  {!flapOpen && (
                    <motion.button
                      type="button"
                      onClick={handleSealClick}
                      aria-label="Break the wax seal to open the letter"
                      initial={{ opacity: 1, scale: 1, rotate: 0 }}
                      animate={
                        breaking
                          ? { opacity: 0, scale: 0.15, rotate: 22 }
                          : { boxShadow: [SEAL_GLOW_SOFT, SEAL_GLOW_BRIGHT, SEAL_GLOW_SOFT] }
                      }
                      transition={
                        breaking
                          ? { duration: 0.45, ease: 'easeIn' }
                          : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
                      }
                      whileHover={!breaking ? { scale: 1.06 } : {}}
                      whileTap={!breaking ? { scale: 0.94 } : {}}
                      className="absolute left-1/2 top-[38%] z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full sm:h-[72px] sm:w-[72px]"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${GOLD_BRIGHT} 0%, ${GOLD} 55%, ${GOLD_DEEP} 100%)`,
                        border: '1px solid rgba(255,255,255,0.25)',
                      }}
                    >
                      <span
                        className="font-display text-2xl font-bold sm:text-3xl"
                        style={{ color: INK, textShadow: '0 1px 0 rgba(255,255,255,0.25)' }}
                      >
                        K
                      </span>
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.p
                animate={
                  breaking
                    ? { opacity: 0, y: 6 }
                    : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-8 font-body text-sm text-mist sm:text-base"
              >
                Click the seal to open the letter.
              </motion.p>
            </motion.div>
          ) : (
            <LetterView key="letter-scene" onContinue={() => navigate('/cake')} />
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}

function LetterView({ onContinue }) {
  const [revealed, setRevealed] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (revealed >= LETTER_CONTENT.length) return
    const delay = revealed === 0 ? 650 : 1450
    const t = setTimeout(() => setRevealed((r) => r + 1), delay)
    return () => clearTimeout(t)
  }, [revealed])

  useEffect(() => {
    if (revealed < LETTER_CONTENT.length) return
    const t = setTimeout(() => setShowButton(true), 1300)
    return () => clearTimeout(t)
  }, [revealed])

  return (
    <motion.div
      key="letter-scene-inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex w-full flex-col items-center"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -36,
          clipPath: 'inset(0% 0% 100% 0%)',
          filter: 'blur(10px)',
        }}
        animate={{
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          filter: 'blur(0px)',
        }}
        transition={{ duration: 1.15, ease: EASE }}
        className="relative w-full max-w-lg overflow-hidden rounded-[26px] px-7 py-10 sm:px-12 sm:py-14"
        style={{
          background: `linear-gradient(165deg, ${CREAM_LIGHT} 0%, ${CREAM} 100%)`,
          boxShadow:
            '0 30px 90px -22px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,162,39,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        {/* Subtle gold top accent line */}
        <div
          className="absolute inset-x-8 top-0 h-[3px] rounded-full sm:inset-x-12"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
        />

        <div className="flex flex-col gap-4 text-left sm:gap-5">
          {LETTER_CONTENT.map((block, idx) => {
            const isRevealed = revealed > idx
            const hiddenState = { opacity: 0, y: 10, filter: 'blur(6px)' }
            const visibleState = { opacity: 1, y: 0, filter: 'blur(0px)' }

            if (block.type === 'signature') {
              return (
                <motion.div
                  key={idx}
                  initial={hiddenState}
                  animate={isRevealed ? visibleState : hiddenState}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="mt-3 font-display italic sm:mt-4"
                  style={{ color: INK }}
                >
                  <p className="text-base sm:text-lg">{block.lines[0]}</p>
                  <p className="mt-1 text-lg font-semibold not-italic sm:text-xl">
                    {block.lines[1]}
                  </p>
                </motion.div>
              )
            }

            return (
              <motion.p
                key={idx}
                initial={hiddenState}
                animate={isRevealed ? visibleState : hiddenState}
                transition={{ duration: 0.9, ease: EASE }}
                className="font-display text-base leading-relaxed sm:text-lg"
                style={{ color: INK }}
              >
                {block.content}
              </motion.p>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.button
            key="continue-to-cake"
            type="button"
            onClick={onContinue}
            initial={{ opacity: 0, y: 14, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
            transition={{ duration: 0.9, ease: EASE }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-luxury mt-10 cursor-pointer gap-2.5 px-9 py-3.5 text-xs uppercase tracking-[0.25em] sm:mt-12 sm:text-sm"
            style={{
              boxShadow:
                '0 0 0 1px rgba(212,175,55,0.35), 0 0 40px -8px rgba(240,217,140,0.65)',
            }}
          >
            <span>🎂 Continue To Birthday Cake</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
