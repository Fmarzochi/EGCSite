/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        egc: {
          50: '#F4F6F5',
          100: '#E2E8E4',
          200: '#B4F8D6',
          300: '#72F7B6',
          400: '#3DF69B',
          500: '#18B669',
          600: '#12A35F',
          700: '#0E7A48',
          800: '#0A3D27',
          900: '#082C1D',
          950: '#06221A',
        },
        gray: {
          950: '#0A0D0C',
          900: '#0D100F',
          850: '#111614',
          800: '#161C19',
          700: '#1F2723',
          600: '#48534C',
          500: '#6E7B74',
          400: '#8E9E96',
          300: '#CBD3CE',
          200: '#E2E8E4',
          100: '#EDF1EE',
          50: '#F4F6F5',
        },
        brand: {
          ground: '#0C0F0E',
          surface: '#141816',
          forest: '#052818',
          deep: '#0B7A44',
          action: '#10B866',
          glow: '#3DF59A',
          mint: '#B9FFD9',
          'on-green': '#04200F',
          ink: '#F3F6F4',
          muted: '#A3ADA7',
          'soft-light': '#E1E7E3',
          'muted-light': '#48534C',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Consolas', 'monospace'],
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
        egcGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 40px rgba(61,245,154,.55))' },
          '50%': { filter: 'drop-shadow(0 0 80px rgba(61,245,154,.85))' },
        },
        egcSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
        'egc-clover': 'egcGlow 5s ease-in-out infinite',
        'egc-orbit': 'egcSpin 60s linear infinite',
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
