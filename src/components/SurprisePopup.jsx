import { AnimatePresence, motion } from 'framer-motion'

// Shown when the button is tapped before the reveal date.
// Glass, purple glow, blurred backdrop, gentle fade — kept mysterious.
export default function SurprisePopup({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-deep/60 px-6 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 8, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-neon relative flex w-full max-w-xs flex-col items-center px-8 py-10 text-center sm:max-w-sm"
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-[28px]"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.16), transparent 65%)' }}
            />
            <motion.span
              className="relative text-3xl"
              animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 0 14px rgba(192,132,252,0.8))' }}
            >
              ✨
            </motion.span>

            <p className="relative mt-5 font-body text-base text-ivory">
              The surprise isn&apos;t ready yet.
            </p>
            <p className="relative mt-1.5 font-body text-sm text-mist">See you soon.</p>

            <button onClick={onClose} className="btn-luxury relative mt-8">
              I&apos;ll Wait
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
