import { AnimatePresence, motion } from 'framer-motion'

export default function CountdownUnit({ value, label }) {
  const display = String(value).padStart(2, '0')

  return (
    <motion.div
      className="flex flex-col items-center gap-2.5"
      whileHover="hover"
      initial="rest"
      animate="idle"
    >
      <motion.div
        variants={{
          idle: {
            boxShadow: [
              '0 0 0 1px rgba(248,250,252,0.1), 0 0 16px -6px rgba(139,92,246,0.35)',
              '0 0 0 1px rgba(168,85,247,0.22), 0 0 26px -6px rgba(139,92,246,0.55)',
              '0 0 0 1px rgba(248,250,252,0.1), 0 0 16px -6px rgba(139,92,246,0.35)',
            ],
            y: 0,
          },
          hover: {
            boxShadow:
              '0 0 0 1px rgba(168,85,247,0.65), 0 0 40px -4px rgba(139,92,246,0.85), 0 10px 28px -8px rgba(139,92,246,0.5)',
            y: -4,
          },
        }}
        transition={{
          boxShadow: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        }}
        className="relative flex h-[64px] w-[80px] items-center justify-center overflow-hidden rounded-2xl border border-purple-glow/25 bg-purple-deep/25 backdrop-blur-2xl sm:h-[88px] sm:w-[104px]"
      >
        {/* layered glass tint + inner highlight for extra depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-glow/16 via-transparent to-purple-accent/8" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(248,250,252,0.12),inset_0_-1px_0_0_rgba(139,92,246,0.12)]" />
        {/* faint top reflection */}
        <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: 18, opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -18, opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl italic tracking-wide text-white sm:text-4xl"
            style={{
              textShadow: '0 0 18px rgba(168,85,247,0.65), 0 0 42px rgba(139,92,246,0.35)',
              fontVariantNumeric: 'oldstyle-nums',
            }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <span className="label-eyebrow whitespace-nowrap text-[9px] tracking-[0.2em] sm:text-[10px]">{label}</span>
    </motion.div>
  )
}
