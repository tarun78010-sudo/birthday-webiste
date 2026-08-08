/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#050816',
          deep: '#03050D',
          raised: '#0B1023',
          line: 'rgba(248,250,252,0.08)',
        },
        purple: {
          glow: '#8B5CF6',
          accent: '#A855F7',
          soft: '#C084FC',
          deep: '#3B2172',
        },
        ivory: '#F8FAFC',
        mist: '#94A3B8',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 60px -10px rgba(139,92,246,0.55)',
        'glow-accent': '0 0 60px -10px rgba(168,85,247,0.45)',
        'inner-glass': 'inset 0 1px 0 0 rgba(248,250,252,0.06)',
        'neon-border': '0 0 0 1px rgba(168,85,247,0.18), 0 0 34px -4px rgba(139,92,246,0.4), 0 0 70px -20px rgba(168,85,247,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-18px,0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.55, filter: 'blur(60px)' },
          '50%': { opacity: 0.9, filter: 'blur(70px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        tickIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(-4%,-2%,0) scale(1)', opacity: 0.55 },
          '50%': { transform: 'translate3d(4%,3%,0) scale(1.12)', opacity: 0.8 },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.15 },
          '50%': { opacity: 0.9 },
        },
        raySweep: {
          '0%, 100%': { opacity: 0.04, transform: 'rotate(0deg)' },
          '50%': { opacity: 0.09, transform: 'rotate(1.5deg)' },
        },
      },
      animation: {
        drift: 'drift 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 6s ease-in-out infinite',
        shimmer: 'shimmer 3.5s linear infinite',
        'tick-in': 'tickIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        aurora: 'aurora 14s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'ray-sweep': 'raySweep 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
