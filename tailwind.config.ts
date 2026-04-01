import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './nuxt.config.ts',
  ],
  // Use data-theme attribute instead of prefers-color-scheme so dark: classes
  // match the app's own theme system
  darkMode: ['selector', '[data-theme="dark"], [data-theme="military"]'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        'bg-base':      'var(--color-bg-base)',
        'bg-surface':   'var(--color-bg-surface)',
        'bg-elevated':  'var(--color-bg-elevated)',
        'bg-overlay':   'var(--color-bg-overlay)',
        // Text
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        'text-inverse':   'var(--color-text-inverse)',
        // Brand / Primary
        'primary':       'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active':'var(--color-primary-active)',
        'primary-text':  'var(--color-primary-text)',
        // Accent
        'accent':        'var(--color-accent)',
        'accent-hover':  'var(--color-accent-hover)',
        // Borders
        'border-default': 'var(--color-border)',
        'border-subtle':  'var(--color-border-subtle)',
        'border-strong':  'var(--color-border-strong)',
        // Status
        'status-success': 'var(--color-success)',
        'status-warning': 'var(--color-warning)',
        'status-error':   'var(--color-error)',
        'status-info':    'var(--color-info)',
        // Charts
        'chart-trajectory': 'var(--color-chart-trajectory)',
        'chart-wind':       'var(--color-chart-wind)',
        'chart-velocity':   'var(--color-chart-velocity)',
        'chart-energy':     'var(--color-chart-energy)',
        'chart-grid':       'var(--color-chart-grid)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
