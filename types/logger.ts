// types/logger.ts

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogEntry {
  timestamp: string
  level: string
  message: string
  data?: any
}

export interface LoggerConfig {
  enabled: boolean
  level: LogLevel
  persist: boolean
  maxStoredLogs: number
}