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

  // Modules configuration
  modules: [
    // Add any modules here
  ],

  // Runtime configuration
  runtimeConfig: {
    // Private keys that are exposed to the server
    mongodbUri: process.env.MONGODB_URI,
    emailServer: process.env.EMAIL_SERVER,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    
    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  },

  // Nitro configuration (server)
  nitro: {
    plugins: ['~/server/plugins/mongoose.ts']
  },

  compatibilityDate: '2025-01-11'
})