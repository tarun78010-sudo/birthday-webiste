import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown.js'
import { REVEAL_DATE } from '../config.js'
import { DEV_MODE } from '../config/devConfig.js'
import LoadingScreen from './LoadingScreen.jsx'
import CountdownPage from './CountdownPage.jsx'
import CinematicIntro from './CinematicIntro.jsx'
import DevModeButton from './DevModeButton.jsx'

export default function HomeExperience() {
  const countdown = useCountdown(REVEAL_DATE)
  const [isLoading, setIsLoading] = useState(true)
  // The reveal only happens once the visitor actually opens it — reaching
  // the date just unlocks the button, it doesn't auto-navigate.
  const [revealed, setRevealed] = useState(false)
  // Developer-only override. Jumps straight past the loading screen,
  // the countdown, and the lock popup into the cinematic intro.
  // Wired to the 🛠 button and Ctrl+Shift+B below — both no-ops
  // unless DEV_MODE is true.
  const [devBypass, setDevBypass] = useState(false)

  useEffect(() => {
    if (!DEV_MODE) return
    function handleKeyDown(e) {
      const key = e.key?.toLowerCase()
      if (e.ctrlKey && e.shiftKey && key === 'b') {
        e.preventDefault()
        setDevBypass(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const showCinematic = devBypass || (revealed && countdown.isComplete)

  return (
    <div className="relative min-h-screen w-full bg-midnight">
      <AnimatePresence mode="wait">
        {showCinematic ? (
          <CinematicIntro key="cinematic" />
        ) : isLoading ? (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        ) : (
          <CountdownPage key="countdown" countdown={countdown} onOpen={() => setRevealed(true)} />
        )}
      </AnimatePresence>

      {DEV_MODE && !showCinematic && (
        <DevModeButton onActivate={() => setDevBypass(true)} />
      )}
    </div>
  )
}
