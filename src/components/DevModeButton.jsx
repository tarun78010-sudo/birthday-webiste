import { motion } from 'framer-motion'

// Fixed, bottom-right utility button. Only ever mounted when
// DEV_MODE is true (see HomeExperience.jsx) — lets you preview the
// cinematic intro instantly instead of waiting on the real countdown.
export default function DevModeButton({ onActivate }) {
  return (
    <motion.button
      type="button"
      onClick={onActivate}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className="glass-panel fixed bottom-5 right-5 z-[999] flex items-center gap-2 rounded-full border-white/15 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-mist backdrop-blur-xl transition-colors hover:border-purple-accent/40 hover:text-ivory hover:shadow-glow-purple"
      title="Skip to cinematic intro (Ctrl+Shift+B)"
    >
      <span aria-hidden="true">🛠</span>
      <span>Developer Mode</span>
    </motion.button>
  )
}
