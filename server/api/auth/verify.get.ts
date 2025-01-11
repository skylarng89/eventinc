// server/api/auth/verify.get.ts

import { useLogger } from '~/composables/useLogger'

export default defineEventHandler(async (event) => {
  const logger = useLogger()

  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'No token provided'
      })
    }

    // TODO: Replace with proper JWT verification
    // This is temporary for testing
    try {
      const userData = JSON.parse(Buffer.from(token, 'base64').toString())
      logger.info('Token verified successfully', { userId: userData.id })
      return { user: userData }
    } catch {
      throw createError({
        statusCode: 401,
        message: 'Invalid token'
      })
    }
  } catch (error) {
    logger.error('Token verification error:', error)
    throw error
  }
})