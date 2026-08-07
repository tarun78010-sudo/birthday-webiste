export default function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Soft top-down ambient stage light, like a keynote spotlight */}
      <div
        className="absolute left-1/2 top-0 h-[60vh] w-[120vw] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,92,246,0.14) 0%, transparent 65%)' }}
      />

      {/* Layer 1 — deep aurora mass, upper field, slow drift + breathing scale */}
      <div className="absolute -left-1/4 -top-1/3 h-[70vw] w-[70vw] max-h-[720px] max-w-[720px] rounded-full bg-purple-glow/28 blur-[130px] animate-aurora" />

      {/* Layer 2 — secondary aurora, lower right, offset timing for parallax feel */}
      <div
        className="absolute -right-1/4 bottom-[-15%] h-[60vw] w-[60vw] max-h-[600px] max-w-[600px] rounded-full bg-purple-accent/24 blur-[120px] animate-aurora"
        style={{ animationDelay: '-7s' }}
      />

      {/* Layer 3 — soft violet fog, centered, subtle pulse */}
      <div className="absolute left-1/2 top-[38%] h-[45vw] w-[45vw] max-h-[420px] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-soft/12 blur-[140px] animate-pulse-glow" />

      {/* Layer 4 — a smaller, closer aurora wisp for extra depth in the mid-field */}
      <div
        className="absolute left-[20%] bottom-[10%] h-[30vw] w-[30vw] max-h-[300px] max-w-[300px] rounded-full bg-purple-glow/14 blur-[100px] animate-aurora"
        style={{ animationDelay: '-11s' }}
      />

      {/* Fine grain of tiny twinkling stars, distributed across the field */}
      <div className="absolute inset-0">
        {STAR_POSITIONS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              boxShadow: '0 0 4px rgba(248,250,252,0.6)',
            }}
          />
        ))}
      </div>

      {/* Subtle rotating light rays, purple-tinted, barely perceptible */}
      <div
        className="absolute inset-0 origin-top animate-ray-sweep"
        style={{
          background:
            'repeating-conic-gradient(from 200deg at 50% -20%, transparent 0deg, rgba(196,132,252,0.5) 1deg, transparent 3deg, transparent 14deg)',
        }}
      />

      {/* Vignette to keep edges premium-dark and focus the center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, rgba(3,5,13,0.78) 100%)',
        }}
      />
    </div>
  )
}

// Fixed, deterministic star field so layout doesn't shift between renders.
const STAR_POSITIONS = [
  { x: 8, y: 12, size: 2, delay: 0, duration: 3.2 },
  { x: 18, y: 28, size: 1.5, delay: 0.6, duration: 2.6 },
  { x: 27, y: 8, size: 1.5, delay: 1.2, duration: 3.8 },
  { x: 35, y: 44, size: 2, delay: 0.3, duration: 3 },
  { x: 46, y: 16, size: 1.5, delay: 1.8, duration: 2.4 },
  { x: 58, y: 32, size: 2, delay: 0.9, duration: 3.4 },
  { x: 66, y: 10, size: 1.5, delay: 1.5, duration: 2.8 },
  { x: 74, y: 40, size: 2, delay: 0.2, duration: 3.6 },
  { x: 84, y: 20, size: 1.5, delay: 1.1, duration: 2.5 },
  { x: 92, y: 48, size: 2, delay: 0.7, duration: 3.1 },
  { x: 12, y: 62, size: 1.5, delay: 1.4, duration: 2.9 },
  { x: 22, y: 78, size: 2, delay: 0.4, duration: 3.3 },
  { x: 40, y: 68, size: 1.5, delay: 1.9, duration: 2.7 },
  { x: 52, y: 84, size: 2, delay: 0.5, duration: 3.5 },
  { x: 64, y: 72, size: 1.5, delay: 1.3, duration: 2.6 },
  { x: 78, y: 88, size: 2, delay: 0.8, duration: 3.2 },
  { x: 88, y: 66, size: 1.5, delay: 1.6, duration: 2.9 },
  { x: 5, y: 90, size: 1.5, delay: 0.1, duration: 3.7 },
  { x: 14, y: 4, size: 1, delay: 0.9, duration: 2.3 },
  { x: 31, y: 55, size: 1, delay: 1.7, duration: 3.9 },
  { x: 48, y: 6, size: 1, delay: 0.2, duration: 2.8 },
  { x: 55, y: 60, size: 1, delay: 1.1, duration: 3.1 },
  { x: 62, y: 24, size: 1, delay: 0.5, duration: 2.5 },
  { x: 70, y: 76, size: 1, delay: 1.4, duration: 3.6 },
  { x: 80, y: 4, size: 1, delay: 0.8, duration: 2.9 },
  { x: 95, y: 30, size: 1, delay: 0.3, duration: 3.4 },
  { x: 3, y: 40, size: 1, delay: 1.6, duration: 2.6 },
  { x: 25, y: 92, size: 1, delay: 0.6, duration: 3.2 },
  { x: 44, y: 96, size: 1, delay: 1.2, duration: 2.7 },
  { x: 90, y: 84, size: 1, delay: 0.4, duration: 3.5 },
]
