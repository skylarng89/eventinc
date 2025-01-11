// middleware/auth.global.ts

import { useLogger } from '~/composables/useLogger'

export default defineNuxtRouteMiddleware(async (to) => {
  const logger = useLogger()
  const publicRoutes = ['/admin/login']

  // Allow access to public routes
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Check if route is admin route
  if (to.path.startsWith('/admin')) {
    const token = localStorage.getItem('token')

    if (!token) {
      logger.warn('Access denied: No token found')
      return navigateTo('/admin/login')
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Invalid token')
      }

      logger.info('Route access granted', { route: to.path })
    } catch (error) {
      logger.warn('Access denied: Authentication required', {
        route: to.path,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return navigateTo('/admin/login')
    }
  }
})