// composables/useAuth.ts

import type { Ref } from 'vue'
import type { User, AuthResponse, LoginCredentials } from '~/types'
import { useLogger } from './useLogger'

export const useAuth = () => {
  const logger = useLogger()
  const user: Ref<User | null> = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data: AuthResponse = await response.json()
      localStorage.setItem('token', data.token)
      user.value = data.user
      
      logger.info('Login successful', { userId: data.user.id })
      return data.user
    } catch (error) {
      logger.error('Login failed:', error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    localStorage.removeItem('token')
    user.value = null
  }

  const verifyAuth = async (): Promise<User> => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No token found')
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Token verification failed')
      }

      const data = await response.json()
      user.value = data.user
      return data.user
    } catch (error) {
      logger.error('Token verification failed:', error)
      throw error
    }
  }

  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    verifyAuth
  }
}