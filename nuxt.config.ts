import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'

// Extend Aura with our tactical olive primary + zinc surfaces
const TDBallisticsPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#f5f7ee',
      100: '#e8edcc',
      200: '#d0db99',
      300: '#b5c68a',
      400: '#8a9a5b',
      500: '#6b7a3d',
      600: '#4e5a2a',
      700: '#364020',
      800: '#202618',
      900: '#141910',
      950: '#0a0c08',
    },
    colorScheme: {
      dark: {
        surface: {
          0:   '#ffffff',
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      light: {
        surface: {
          0:   '#ffffff',
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
    },
  },
})

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@tresjs/nuxt',
  ],

  // Register all components by filename only (no directory prefix)
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  vite: {
    optimizeDeps: {
      include: ['localforage', 'echarts', 'vue-echarts'],
    },
  },

  css: ['~/assets/styles/main.css'],

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  primevue: {
    usePrimeVue: true,
    options: {
      theme: {
        preset: TDBallisticsPreset,
        options: {
          // Match our data-theme attribute for dark mode
          darkModeSelector: '[data-theme="dark"], [data-theme="military"]',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
      ripple: true,
    },
    autoImport: true,
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  typescript: {
    strict: true,
  },

  imports: {
    dirs: ['stores', 'composables', 'utils'],
  },
  app: {
      head: {
        link: [
          { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }
        ]
      }
    }
})
