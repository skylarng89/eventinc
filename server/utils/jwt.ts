// server/utils/jwt.ts

import jwt from 'jsonwebtoken'
import { useLogger } from '~/composables/useLogger'
import { AuthenticationError } from '~/types/auth'
import type { UserRole } from '~/types'

interface TokenPayload {
  userId: string
  role: UserRole
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '24h'

export function generateToken(payload: TokenPayload): string {
  const logger = useLogger()

  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  } catch (error) {
    logger.error('Failed to generate token:', error)
    throw new AuthenticationError(
      'Failed to generate token',
      'TOKEN_GENERATION_FAILED'
    )
  }
}

export function verifyToken(token: string): TokenPayload {
  const logger = useLogger()

  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    logger.error('Failed to verify token:', error)
    
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError(
        'Token has expired',
        'TOKEN_EXPIRED'
      )
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError(
        'Invalid token',
        'INVALID_TOKEN'
      )
    }
    
    throw new AuthenticationError(
      'Token verification failed',
      'TOKEN_VERIFICATION_FAILED'
    )
  }
}