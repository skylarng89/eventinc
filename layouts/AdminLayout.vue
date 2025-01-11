<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '~/types'
import { useLogger } from '~/composables/useLogger'
import { useAuth } from '~/composables/useAuth'

const logger = useLogger()
const { logout, verifyAuth } = useAuth()
const router = useRouter()

// Navigation items
const navigationItems = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Events', path: '/admin/events' },
  { name: 'Users', path: '/admin/users' },
  { name: 'Settings', path: '/admin/settings' }
] as const

// Component state
const user = ref<User | null>(null)

// Check authentication on mount
onMounted(async () => {
  try {
    const userData = await verifyAuth()
    user.value = userData
    logger.info('User authenticated successfully', { userId: userData.id })
  } catch (error) {
    logger.error('Authentication failed:', error)
    router.push('/admin/login')
  }
})

// Logout handler
const handleLogout = async () => {
  try {
    await logout()
    logger.info('User logged out successfully')
    router.push('/admin/login')
  } catch (error) {
    logger.error('Logout failed:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navigation Bar -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">EventInc Admin</h1>
            </div>
            
            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{
                  'border-indigo-500 text-gray-900': $route.path.startsWith(item.path)
                }"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Right side navigation -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span v-if="user" class="text-sm text-gray-500 mr-4">
                {{ user.firstName }} {{ user.lastName }}
              </span>
              <button
                @click="handleLogout"
                class="bg-indigo-600 p-2 rounded-md text-white hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Page header -->
      <header v-if="$slots.header" class="mb-8">
        <slot name="header" />
      </header>

      <!-- Main content -->
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>