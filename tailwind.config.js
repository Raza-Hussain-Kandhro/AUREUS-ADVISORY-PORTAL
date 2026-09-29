/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0F19',
          deep: '#050505',
          surface: '#0F1420',
          border: 'rgba(255,255,255,0.08)',
        },
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E8CD73',
          dim: '#8A7127',
        },
        emerald: {
          DEFAULT: '#10B981',
          soft: '#34D399',
        },
        platinum: {
          DEFAULT: '#F3F4F6',
          muted: '#9CA3AF',
          faint: '#6B7280',
        },
        vault: {
          silver: '#8A94A6',
          amber: '#C9962C',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        tabular: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'obsidian-radial':
          'radial-gradient(120% 120% at 50% -10%, #131A2B 0%, #0B0F19 45%, #050505 100%)',
        'gold-shimmer':
          'linear-gradient(110deg, transparent 20%, rgba(212,175,55,0.55) 45%, rgba(232,205,115,0.85) 50%, rgba(212,175,55,0.55) 55%, transparent 80%)',
      },
      transitionTimingFunction: {
        // "luxury watch" easing — deliberate deceleration, no bounce
        vault: 'cubic-bezier(0.22, 1, 0.36, 1)',
        mechanism: 'cubic-bezier(0.16, 1, 0.3, 1)',
        settle: 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-150% 0' },
          '100%': { backgroundPosition: '150% 0' },
        },
        breathe: {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        'rise-in': {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.2s linear infinite',
        breathe: 'breathe 2.4s ease-in-out infinite',
        'rise-in': 'rise-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45)',
        'gold-glow': '0 0 0 1px rgba(212,175,55,0.4), 0 8px 24px rgba(212,175,55,0.12)',
      },
      letterSpacing: {
        wide2: '0.04em',
      },
    },
  },
  plugins: [],
};
