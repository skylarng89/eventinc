// Log levels enum
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

// Logger configuration interface
interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  persist: boolean; // Whether to persist logs to localStorage
  maxStoredLogs?: number; // Maximum number of logs to store
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private readonly storageKey = 'eventinc_logs';
  private config: LoggerConfig;

  private constructor() {
    this.config = {
      enabled: process.env.NODE_ENV !== 'production',
      level: LogLevel.INFO,
      persist: true,
      maxStoredLogs: 1000,
    };
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private persistLog(level: string, message: string, data?: unknown): void {
    if (!this.config.persist || !import.meta.client) return;

    try {
      const logs = this.getLogs();
      const newLog: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data
      };

      logs.push(newLog);

      if (this.config.maxStoredLogs && logs.length > this.config.maxStoredLogs) {
        logs.splice(0, logs.length - this.config.maxStoredLogs);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to persist log:', error);
    }
  }

  public debug(message: string, data?: unknown): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.debug(`[DEBUG] ${message}`, data ?? '');
    this.persistLog('DEBUG', message, data);
  }

  public info(message: string, data?: unknown): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.info(`[INFO] ${message}`, data ?? '');
    this.persistLog('INFO', message, data);
  }

  public warn(message: string, data?: unknown): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(`[WARN] ${message}`, data ?? '');
    this.persistLog('WARN', message, data);
  }

  public error(message: string, error?: unknown): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    console.error(`[ERROR] ${message}`, error ?? '');
    this.persistLog('ERROR', message, error);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && this.config.level >= level;
  }

  public getLogs(): LogEntry[] {
    if (!import.meta.client || !this.config.persist) return [];

    try {
      const logs = localStorage.getItem(this.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to retrieve logs:', error);
      return [];
    }
  }

  public clearLogs(): void {
    if (import.meta.client && this.config.persist) {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export const logger = Logger.getInstance();

export function useLogger(): Logger {
  return logger;
}
