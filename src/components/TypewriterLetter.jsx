import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { getHoldSeconds } from '../utils/sentenceTiming.js'

// Milliseconds per typed character. Fast enough to feel alive, slow
// enough to read as "being written" rather than a text dump.
const CHAR_MS = 34

// One line of the letter, typed out character by character, then
// held on screen long enough to comfortably read before the parent
// is told it's safe to move on.
export default function TypewriterLetter({ text, active, onDone }) {
  const [count, setCount] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!active) {
      setCount(0)
      return
    }

    let i = 0
    setCount(0)
    const typeTimer = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) {
        clearInterval(typeTimer)
      }
    }, CHAR_MS)

    return () => clearInterval(typeTimer)
  }, [text, active])

  const isTypingDone = count >= text.length

  useEffect(() => {
    if (!active || !isTypingDone) return
    const holdMs = getHoldSeconds(text) * 1000
    const holdTimer = setTimeout(() => onDoneRef.current?.(), holdMs)
    return () => clearTimeout(holdTimer)
  }, [active, isTypingDone, text])

  if (!active) return null

  return (
    <span>
      {text.slice(0, count)}
      <motion.span
        aria-hidden="true"
        className="ml-[2px] inline-block h-[0.9em] w-[2px] translate-y-[0.1em] bg-purple-accent align-middle"
        animate={{ opacity: isTypingDone ? [1, 0, 1] : 1 }}
        transition={
          isTypingDone
            ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0 }
        }
        style={{ boxShadow: '0 0 8px rgba(168,85,247,0.85)' }}
      />
    </span>
  )
}
