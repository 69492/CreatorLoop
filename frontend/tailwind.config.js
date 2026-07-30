/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Midnight Studio palette
        studio: {
          bg:       '#050816',
          surface:  '#0F172A',
          elevated: '#172033',
          border:   '#263247',
          hover:    '#1E2D44',
        },
        // Legacy navy (kept for backward compat)
        navy: {
          950: '#030610',
          900: '#050816',
          800: '#0F172A',
          750: '#172033',
          700: '#1a2540',
          650: '#1E2D44',
          600: '#263247',
          500: '#2d3d58',
          400: '#3a4f6e',
          350: '#475e80',
          300: '#5a7294',
        },
        brand: {
          // Primary: Creative Orange
          orange:        '#FF7A1A',
          'orange-light': '#FF9A4D',
          'orange-dim':  '#E66A0A',
          // Secondary: Fresh Teal
          teal:          '#2DD4BF',
          'teal-light':  '#5EEAD4',
          'teal-dim':    '#1EB8A3',
          // Legacy purple (kept for backward compat)
          purple:        '#7c3aed',
          'purple-light': '#a78bfa',
          'purple-dim':  '#6d28d9',
          blue:          '#3b82f6',
          'blue-light':  '#60a5fa',
          'blue-dim':    '#2563eb',
        },
        surface: {
          1: 'rgba(255,255,255,0.03)',
          2: 'rgba(255,255,255,0.05)',
          3: 'rgba(255,255,255,0.07)',
          4: 'rgba(255,255,255,0.10)',
        },
      },
      fontFamily: {
        heading: ['Sora', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(145deg, #050816 0%, #0A1020 40%, #0D0F22 70%, #050816 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(23,32,51,0.6) 0%, rgba(15,23,42,0.8) 100%)',
        'orange-glow': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,122,26,0.12) 0%, transparent 70%)',
        'teal-glow': 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(45,212,191,0.08) 0%, transparent 70%)',
      },
      animation: {
        'fade-in':          'fadeIn 0.3s ease-out both',
        'fade-in-up':       'fadeInUp 0.4s ease-out both',
        'fade-in-down':     'fadeInDown 0.3s ease-out both',
        'slide-up':         'slideUp 0.4s ease-out both',
        'slide-in-right':   'slideInRight 0.3s ease-out both',
        'scale-in':         'scaleIn 0.2s ease-out both',
        'scale-in-spring':  'scaleInSpring 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-slow':       'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':          'shimmer 2s linear infinite',
        'float':            'float 6s ease-in-out infinite',
        'spin-slow':        'spin 8s linear infinite',
        'glow-pulse':       'glowPulse 3s ease-in-out infinite',
        'stagger-1':        'fadeInUp 0.4s 0.1s ease-out both',
        'stagger-2':        'fadeInUp 0.4s 0.2s ease-out both',
        'stagger-3':        'fadeInUp 0.4s 0.3s ease-out both',
        'stagger-4':        'fadeInUp 0.4s 0.4s ease-out both',
        'enter-from-top':   'enterFromTop 0.25s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(14px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleInSpring: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,122,26,0.12)' },
          '50%':      { boxShadow: '0 0 40px rgba(255,122,26,0.25), 0 0 60px rgba(255,122,26,0.08)' },
        },
        enterFromTop: {
          '0%':   { opacity: '0', transform: 'translateY(-6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs:   '2px',
        '2xl': '40px',
      },
      boxShadow: {
        'glow-orange':    '0 0 40px rgba(255, 122, 26, 0.18)',
        'glow-orange-lg': '0 0 80px rgba(255, 122, 26, 0.22)',
        'glow-teal':      '0 0 40px rgba(45, 212, 191, 0.14)',
        'card':           '0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
        'card-hover':     '0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)',
        'card-active':    '0 0 0 2px rgba(255,122,26,0.4)',
        'inner-glow':     'inset 0 1px 0 rgba(255,255,255,0.06)',
        'nav':            '0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.35)',
        'modal':          '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)',
        'toast':          '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
