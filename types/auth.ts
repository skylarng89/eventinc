// types/auth.ts

import type { User, UserRole } from './index'

export interface AuthState {
  user: User | null
  token: string | null
}

export interface AuthError {
  code: string
  message: string
}

export class AuthenticationError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

// Type guard for User
export function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'firstName' in obj &&
    'lastName' in obj &&
    'role' in obj &&
    Object.values(UserRole).includes(obj.role)
  )
}

// Type guard for AuthError
export function isAuthError(obj: any): obj is AuthError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'code' in obj &&
    'message' in obj &&
    typeof obj.code === 'string' &&
    typeof obj.message === 'string'
  )
}

// Utility function to validate JWT token format
export function isValidTokenFormat(token: string): boolean {
  const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
  return jwtRegex.test(token)
}