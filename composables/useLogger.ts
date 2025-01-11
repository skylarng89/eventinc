// composables/useLogger.ts

import { LogLevel } from '~/types/logger'

export const useLogger = () => {
  const config = useRuntimeConfig()
  
  const isClient = process.client
  const isDev = process.dev

  const log = (level: string, message: string, data?: any) => {
    if (isDev) {
      const timestamp = new Date().toISOString()
      const logMessage = `[${timestamp}] [${level}] ${message}`
      
      switch (level) {
        case 'error':
          console.error(logMessage, data || '')
          break
        case 'warn':
          console.warn(logMessage, data || '')
          break
        case 'info':
          console.info(logMessage, data || '')
          break
        case 'debug':
          console.debug(logMessage, data || '')
          break
        default:
          console.log(logMessage, data || '')
      }
    }

    // Only persist logs on client side
    if (isClient && config.public.persistLogs) {
      try {
        const logs = JSON.parse(localStorage.getItem('eventinc_logs') || '[]')
        logs.push({
          timestamp: new Date().toISOString(),
          level,
          message,
          data
        })

        // Keep only the latest logs based on config
        const maxLogs = config.public.maxStoredLogs || 1000
        while (logs.length > maxLogs) {
          logs.shift()
        }

        localStorage.setItem('eventinc_logs', JSON.stringify(logs))
      } catch (error) {
        console.error('Failed to persist log:', error)
      }
    }
  }

  return {
    debug: (message: string, data?: any) => log('debug', message, data),
    info: (message: string, data?: any) => log('info', message, data),
    warn: (message: string, data?: any) => log('warn', message, data),
    error: (message: string, data?: any) => log('error', message, data),
    
    // Utility function to get logs (client-side only)
    getLogs: () => {
      if (isClient) {
        try {
          return JSON.parse(localStorage.getItem('eventinc_logs') || '[]')
        } catch {
          return []
        }
      }
      return []
    },
    
    // Clear logs (client-side only)
    clearLogs: () => {
      if (isClient) {
        localStorage.removeItem('eventinc_logs')
      }
    }
  }
}