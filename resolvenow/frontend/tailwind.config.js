/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Cinzel"', 'serif'],
        serif: ['"Cinzel"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        background: {
          DEFAULT: 'var(--color-bg)',
          alt: 'var(--color-bg-alt)'
        },
        gold: {
          bright: 'var(--color-gold-bright)',
          DEFAULT: 'var(--color-gold)',
          bronze: 'var(--color-gold-bronze)',
        },
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)'
        },
        glass: {
          panel: 'var(--color-glass-panel)',
          border: 'var(--color-glass-border)',
          fill: 'var(--color-glass-fill)',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold-bronze))',
      },
      animation: {
        'drift': 'drift 25s ease-in-out infinite',
        'fade-slide': 'fadeSlide 0.5s ease-out forwards',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(5%, 10%)' },
        },
        fadeSlide: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      borderRadius: {
        'sm-glass': '10px',
        'md-glass': '16px',
        'lg-glass': '22px',
      }
    },
  },
  plugins: [],
}
