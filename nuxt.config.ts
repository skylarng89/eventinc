// nuxt.config.ts

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Enable developer tools
  devtools: { enabled: true },
  
  // Meta configuration
  app: {
    head: {
      title: 'EventInc - Event Management Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          hid: 'description', 
          name: 'description', 
          content: 'Professional event management platform'
        }
      ],
    }
  },

  // CSS configuration
  css: ['~/assets/css/main.css'],

  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Modules configuration
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  // Runtime configuration
  runtimeConfig: {
    // Private keys that are exposed to the server
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    emailServer: process.env.EMAIL_SERVER,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    
    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.API_BASE || '/api',
      persistLogs: process.env.PERSIST_LOGS === 'true',
      maxStoredLogs: parseInt(process.env.MAX_STORED_LOGS || '1000'),
      logLevel: process.env.LOG_LEVEL || 'info'
    }
  },

  // Auto-import components
  components: true,

  // Nitro configuration (server)
  nitro: {
    plugins: ['~/server/plugins/mongoose.ts']
  }
})