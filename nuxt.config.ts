// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@tresjs/nuxt',
  ],

  css: ['~/assets/styles/main.css'],

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  primevue: {
    usePrimeVue: true,
    options: {
      theme: 'none',
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
})
