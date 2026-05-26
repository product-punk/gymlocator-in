/**
 * Tailwind CSS v4 — design token reference.
 * v4 reads theme tokens from CSS @theme blocks, not this file.
 * Actual tokens are registered in src/app/globals.css.
 * Keep this in sync with that file.
 */

const tokens = {
  colors: {
    base: '#0C0C0C',
    surface: '#111111',
    raised: '#1A1A1A',
    border: '#222222',
    'border-hi': '#333333',
    accent: '#D4D4D4',
    'accent-dim': '#1E1E1E',
    'text-primary': '#F0F0F0',
    'text-secondary': '#AAAAAA',
    'text-muted': '#555555',
    'text-disabled': '#333333',
  },
  fontFamily: {
    sans: 'Inter',
  },
  borderWidth: {
    hair: '0.5px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    pill: '20px',
  },
} as const

export default tokens
