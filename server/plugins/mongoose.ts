// server/plugins/mongoose.ts

import mongoose from 'mongoose'

export default defineNitroPlugin(async (nitroApp) => {
  // Get MongoDB URI from runtime config
  const config = useRuntimeConfig()
  
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri)
    console.log('Connected to MongoDB successfully')
    
    // Handle connection errors
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error)
    })
    
    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
})