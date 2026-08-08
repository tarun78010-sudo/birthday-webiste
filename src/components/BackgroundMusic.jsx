import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Global, persistent background music.
//
// Mounted exactly once, above/outside <Routes> in App.jsx, so this
// component — and the single <audio> element it owns — never
// unmounts as the visitor navigates between scenes. The audio element
// is created once and reused for the entire lifetime of the app; it
// is never recreated or restarted on route change.
//
// Browsers block audio autoplay until the user interacts with the
// page, so playback is armed on the very first click/tap/keydown
// anywhere on the site (not just on the toggle button itself), then
// keeps playing continuously — looped — across every route after that.
const TRACK_SRC = '/music/birthday.mp3'
const VOLUME = 0.18

export default function BackgroundMusic() {
  const audioRef = useRef(null)
  // Tracks whether we've already armed/started playback, without
  // needing to re-run the listener-setup effect when it flips.
  const startedRef = useRef(false)
  const [isOn, setIsOn] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = VOLUME

    function startOnFirstInteraction() {
      if (startedRef.current) return
      startedRef.current = true

      audio.play()
        .then(() => setHasStarted(true))
        .catch(() => {
          // Playback was blocked (e.g. gesture not recognized) — allow
          // another attempt on the next interaction.
          startedRef.current = false
        })
    }

    const events = ['pointerdown', 'keydown', 'touchstart']
    events.forEach((evt) =>
      window.addEventListener(evt, startOnFirstInteraction, { passive: true })
    )

    return () => {
      events.forEach((evt) =>
        window.removeEventListener(evt, startOnFirstInteraction)
      )
    }
  }, [])

  function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return

    if (isOn) {
      audio.pause()
      setIsOn(false)
    } else {
      audio.volume = VOLUME
      startedRef.current = true
      audio.play().then(() => setHasStarted(true)).catch(() => {})
      setIsOn(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" />

      <AnimatePresence>
        {hasStarted && (
          <motion.button
            type="button"
            onClick={toggleMusic}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-panel fixed bottom-5 left-5 z-[999] flex h-10 w-10 items-center justify-center rounded-full border-white/15 text-mist backdrop-blur-xl transition-colors hover:border-purple-accent/40 hover:text-ivory hover:shadow-glow-purple"
            aria-label={isOn ? 'Turn music off' : 'Turn music on'}
            aria-pressed={isOn}
            title={isOn ? 'Music: on' : 'Music: off'}
          >
            {isOn ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.6" opacity="0.4" />
                <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" opacity="0.4" />
                <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
