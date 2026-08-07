import { useEffect, useRef } from 'react'

// Lightweight canvas particle field — soft drifting motes of light.
// No external deps, tuned to stay well under 60 particles for perf.
export default function ParticleField({ density = 46, tint = 'mixed' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let particles = []
    let width = 0
    let height = 0

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    function palette() {
      if (tint === 'violet') return ['rgba(139,92,246,', 'rgba(192,132,252,']
      if (tint === 'soft') return ['rgba(192,132,252,', 'rgba(248,250,252,']
      return ['rgba(139,92,246,', 'rgba(168,85,247,', 'rgba(248,250,252,']
    }

    function resize() {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    function init() {
      const colors = palette()
      particles = Array.from({ length: density }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.25 + 0.05,
        drift: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    }

    function tick() {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.y -= p.speed
        p.x += p.drift
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        ctx.beginPath()
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    init()
    if (prefersReduced) {
      // Draw a single static frame for reduced-motion users.
      tick()
      cancelAnimationFrame(raf)
    } else {
      tick()
    }

    const handleResize = () => {
      resize()
      init()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
    }
  }, [density, tint])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
