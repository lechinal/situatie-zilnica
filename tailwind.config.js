/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'cad-btn-primary',
    'cad-btn-secondary',
    'cad-btn-ghost',
    'cad-btn-danger',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.1)',
        'modal':      '0 -8px 40px rgba(0,0,0,0.15)',
        'dropdown':   '0 4px 20px rgba(0,0,0,0.12)',
        'btn-teal':   '0 2px 8px rgba(13,148,136,0.3)',
      },
      animation: {
        'slide-up':      'slideUp .25s ease',
        'slide-in-left': 'slideInLeft .22s ease',
        'scale-in':      'scaleIn .2s ease',
      },
      keyframes: {
        slideUp:      { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInLeft:  { from: { transform: 'translateX(-100%)' },            to: { transform: 'translateX(0)' } },
        scaleIn:      { from: { opacity: 0, transform: 'scale(.95)' },       to: { opacity: 1, transform: 'scale(1)' } },
      },
      letterSpacing: {
        tight2: '-0.5px',
        tight1: '-0.3px',
        tight:  '-0.2px',
        wider2: '0.07em',
      },
    },
  },
  plugins: [],
}
