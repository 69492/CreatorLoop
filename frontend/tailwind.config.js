/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#04070f',
          900: '#080d1a',
          800: '#0c1120',
          750: '#0e1526',
          700: '#101828',
          650: '#141e30',
          600: '#18213a',
          500: '#1c2840',
          400: '#293650',
          350: '#344462',
          300: '#3d5070',
        },
        brand: {
          purple: '#7c3aed',
          'purple-light': '#a78bfa',
          'purple-dim': '#6d28d9',
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          'blue-dim': '#2563eb',
        },
        surface: {
          1: 'rgba(255,255,255,0.03)',
          2: 'rgba(255,255,255,0.06)',
          3: 'rgba(255,255,255,0.08)',
          4: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(145deg, #080d1a 0%, #0c1120 40%, #0f0b1f 70%, #080d1a 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(28,40,64,0.6) 0%, rgba(16,24,40,0.8) 100%)',
        'purple-glow': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 70%)',
        'blue-glow': 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(59,130,246,0.1) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out both',
        'fade-in-up': 'fadeInUp 0.45s ease-out both',
        'fade-in-down': 'fadeInDown 0.35s ease-out both',
        'slide-up': 'slideUp 0.45s ease-out both',
        'slide-in-right': 'slideInRight 0.35s ease-out both',
        'scale-in': 'scaleIn 0.2s ease-out both',
        'scale-in-spring': 'scaleInSpring 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'stagger-1': 'fadeInUp 0.45s 0.1s ease-out both',
        'stagger-2': 'fadeInUp 0.45s 0.2s ease-out both',
        'stagger-3': 'fadeInUp 0.45s 0.3s ease-out both',
        'stagger-4': 'fadeInUp 0.45s 0.4s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleInSpring: {
          '0%': { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(124, 58, 237, 0.2)',
        'glow-purple-lg': '0 0 80px rgba(124, 58, 237, 0.25)',
        'glow-blue': '0 0 40px rgba(59, 130, 246, 0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15)',
        'card-hover': '0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
        'card-active': '0 0 0 2px rgba(124,58,237,0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.08)',
        'nav': '0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.3)',
        'modal': '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        'toast': '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
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
