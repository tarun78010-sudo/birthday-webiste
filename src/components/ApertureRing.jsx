import { motion } from 'framer-motion'

// The signature element: a chronograph-style aperture that slowly fills
// with light as the reveal approaches — read as "light being let in."
export default function ApertureRing({ progress = 0, size = 380 }) {
  const radius = size / 2 - 14
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  const center = size / 2

  // A short bright arc that continuously sweeps the bezel — separate
  // from the progress fill, purely decorative.
  const sweepLength = circumference * 0.1

  // Fixed points on the ring's own circle — since the parent rotates
  // continuously, these read as tiny particles travelling around it.
  const orbitParticles = [
    { angle: 20, r: radius, size: 2.6, delay: 0 },
    { angle: 95, r: radius, size: 1.8, delay: 0.8 },
    { angle: 160, r: radius, size: 2.2, delay: 1.6 },
    { angle: 210, r: radius, size: 1.6, delay: 0.4 },
    { angle: 275, r: radius, size: 2, delay: 1.2 },
    { angle: 330, r: radius, size: 1.8, delay: 2 },
  ]

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size }}
    >
    <motion.div
      className="relative h-full w-full"
      style={{ willChange: 'transform' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
    >
      {/* soft dark disc beneath everything, for a sense of depth/lift */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.05) 55%, transparent 75%)',
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="apertureGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.95" />
          </linearGradient>
          <filter id="apertureBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="sweepBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={2}
        />

        {/* Subtle specular highlight, upper-left, for a glass/3D feel */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(248,250,252,0.22)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.16} ${circumference}`}
          strokeDashoffset={circumference * 0.08}
          transform={`rotate(-135 ${center} ${center})`}
        />

        {/* Glow duplicate beneath the progress stroke, with a slow breathing glow */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#apertureGradient)"
          strokeWidth={7}
          strokeLinecap="round"
          filter="url(#apertureBlur)"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset, opacity: [0.55, 0.95, 0.55] }}
          transition={{
            strokeDashoffset: { duration: 1.2, ease: 'easeOut' },
            opacity: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Crisp progress stroke */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#apertureGradient)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Moving purple-white light sweep, independent of progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#sweepGradient)"
          strokeWidth={2.5}
          strokeLinecap="round"
          filter="url(#sweepBlur)"
          strokeDasharray={`${sweepLength} ${circumference - sweepLength}`}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -circumference }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          transform={`rotate(-90 ${center} ${center})`}
          opacity={0.8}
        />

        {/* Subtle 3D tilt highlight — a soft ellipse of light across the
            upper face of the ring, for a slight glassy dimensionality */}
        <ellipse
          cx={center}
          cy={center - radius * 0.32}
          rx={radius * 0.62}
          ry={radius * 0.16}
          fill="url(#apertureGradient)"
          opacity={0.05}
          filter="url(#apertureBlur)"
        />

        {/* Tiny particles travelling around the ring, independent of
            progress — twinkling motes riding the bezel */}
        {orbitParticles.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180
          const x = center + p.r * Math.cos(rad)
          const y = center + p.r * Math.sin(rad)
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={p.size}
              fill="#F8FAFC"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
              style={{ filter: 'drop-shadow(0 0 6px rgba(192,132,252,0.85))' }}
            />
          )
        })}

        {/* Leading light point */}
        <motion.circle
          r={4}
          fill="#fff"
          initial={false}
          animate={{
            cx: center + radius * Math.cos(progress * Math.PI * 2 - Math.PI / 2),
            cy: center + radius * Math.sin(progress * Math.PI * 2 - Math.PI / 2),
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.95))' }}
        />
      </svg>
    </motion.div>
    </div>
  )
}
