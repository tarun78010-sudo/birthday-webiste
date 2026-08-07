import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const STEPS = ['Initializing...', 'Preparing something special...', 'Almost Ready...']
const STEP_DURATION = 1000 // ms — 3 steps × 1s = 3s total

export default function LoadingScreen({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) {
      const finish = setTimeout(() => onComplete?.(), STEP_DURATION)
      return () => clearTimeout(finish)
    }
    const advance = setTimeout(() => setStepIndex((i) => i + 1), STEP_DURATION)
    return () => clearTimeout(advance)
  }, [stepIndex, onComplete])

  return (
    <motion.div
      key="loading"
      exit={{ opacity: 0, filter: 'blur(16px)' }}
      transition={{ duration: 0.9, ease: [0.6, 0, 0.4, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight"
    >
      {/* minimal ambient glow, kept quiet so the type is the focus */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-glow/15 blur-[130px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* breathing mark */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-2 w-2 rounded-full bg-purple-soft"
          style={{ boxShadow: '0 0 20px 4px rgba(168,85,247,0.7)' }}
        />

        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs uppercase tracking-[0.35em] text-mist"
            >
              {STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
