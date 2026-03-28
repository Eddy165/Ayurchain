/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#012D1D', // updated from stitch
          light:   '#1B4332',
          muted:   '#52796F',
          50:      '#ECFDF5',
          100:     '#D1FAE5',
        },
        gold: {
          DEFAULT: '#795900', // updated from stitch
          dark:    '#B8860B',
          light:   '#D4A017', // original gold as light
          50:      '#FFFBEB',
        },
        cream: {
          DEFAULT: '#FFF9EC', // updated from stitch
          dark:    '#F9F0D3',
        },
        surface: {
          DEFAULT: '#FFF9EC',
          container: '#F4EDDD',
          'container-low': '#FAF3E2',
          'container-lowest': '#FFFFFF',
          'container-high': '#EEE8D7',
          'container-highest': '#E9E2D2',
        },
        stage: {
          farm:     '#D97706',
          'farm-bg':'#FEF3C7',
          process:  '#2563EB',
          'process-bg':'#DBEAFE',
          lab:      '#7C3AED',
          'lab-bg': '#EDE9FE',
          certify:  '#059669',
          'certify-bg':'#D1FAE5',
          brand:    '#0891B2',
          'brand-bg':'#CFFAFE',
          consumer: '#D4A017',
          'consumer-bg':'#FEF9C3',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        ui:      ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1.05', fontWeight: '700' }],
        'h1':      ['48px', { lineHeight: '1.1',  fontWeight: '600' }],
        'h2':      ['36px', { lineHeight: '1.2',  fontWeight: '600' }],
        'h3':      ['24px', { lineHeight: '1.3',  fontWeight: '600' }],
        'h4':      ['18px', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.7',  fontWeight: '400' }],
        'body':    ['14px', { lineHeight: '1.6',  fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5',  fontWeight: '400' }],
        'mono-sm': ['11px', { lineHeight: '1.4',  fontWeight: '400' }],
      },
      spacing: {
        '4.5': '18px',
        '18':  '72px',
        '22':  '88px',
        '30':  '120px',
      },
      borderRadius: {
        'sm':   '4px',
        'md':   '8px',
        'lg':   '12px',
        'xl':   '16px',
        '2xl':  '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm':   '0 1px 3px rgba(0,0,0,0.06)',
        'md':   '0 4px 16px rgba(0,0,0,0.08)',
        'lg':   '0 8px 32px rgba(0,0,0,0.10)',
        'xl':   '0 16px 48px rgba(0,0,0,0.12)',
        'ambient': '0 24px 48px rgba(27,67,50,0.08)', // From stitch
        'gold': '0 4px 24px rgba(212,160,23,0.20)',
        'inner-gold': 'inset 0 0 0 2px rgba(212,160,23,0.40)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 1.5s infinite',
        'fade-up':    'fade-up 0.3s ease-out',
        'slide-in':   'slide-in 0.3s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        'pulse-gold': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(212,160,23,0.4)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(212,160,23,0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
