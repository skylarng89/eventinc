// nuxt.config.ts

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  tailwindcss: {
    configPath: './tailwind.config.js',
    exposeConfig: true,
    injectPosition: 0,
    viewer: true
  },

  css: [
    '@/assets/css/main.css'
  ],

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    emailServer: process.env.EMAIL_SERVER,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    
    public: {
      apiBase: process.env.API_BASE || '/api',
      persistLogs: process.env.PERSIST_LOGS === 'true',
      maxStoredLogs: parseInt(process.env.MAX_STORED_LOGS || '1000'),
      logLevel: process.env.LOG_LEVEL || 'info'
    }
  },

  components: true
})