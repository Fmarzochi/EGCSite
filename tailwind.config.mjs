/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        egc: {
          50: 'var(--egc-green-50, #f0fdf4)',
          100: 'var(--egc-green-100, #dcfce7)',
          200: 'var(--egc-green-200, #bbf7d0)',
          300: 'var(--egc-green-300, #86efac)',
          400: 'var(--egc-green-400, #4ade80)',
          500: 'var(--egc-green, #22c55e)',
          600: 'var(--egc-green-dark, #16a34a)',
          700: 'var(--egc-green-700, #15803d)',
          800: 'var(--egc-green-800, #166534)',
          900: 'var(--egc-green-900, #14532d)',
          950: 'var(--egc-green-950, #052e16)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(34,197,94,0.3), 0 0 24px rgba(34,197,94,0.1)',
          },
          '50%': {
            boxShadow: '0 0 16px rgba(34,197,94,0.5), 0 0 48px rgba(34,197,94,0.2)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        'subtle-grid':
          'radial-gradient(rgba(34,197,94,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-24': '24px 24px',
      },
    },
  },
  plugins: [],
};
