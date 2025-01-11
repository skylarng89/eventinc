// server/api/auth/login.post.ts

import { UserRole } from '~/types'
import { useLogger } from '~/composables/useLogger'

export default defineEventHandler(async (event) => {
  const logger = useLogger()

  try {
    const body = await readBody(event)

    // Validate request body
    if (!body?.email || !body?.password) {
      throw createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }

    logger.info('Login attempt', { email: body.email })

    // TODO: Replace with actual database authentication
    // This is temporary for testing
    if (body.email === 'admin@eventinc.com' && body.password === 'admin123') {
      const userData = {
        id: '1',
        email: body.email,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN
      }

      // Generate a simple token (replace with proper JWT in production)
      const token = Buffer.from(JSON.stringify(userData)).toString('base64')

      logger.info('Login successful', { userId: userData.id })

      return {
        token,
        user: userData
      }
    }

    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  } catch (error) {
    logger.error('Login error:', error)
    throw error
  }
})