// pages/admin/login/index.vue

<script setup lang="ts">
import { ref } from 'vue'
import { useLogger } from '~/composables/useLogger'
import { useAuth } from '~/composables/useAuth'

const logger = useLogger()
const { login } = useAuth()
const router = useRouter()

// Form state
const credentials = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

// Login handler
const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    logger.info('Attempting login', { email: credentials.value.email })
    await login(credentials.value)
    router.push('/admin')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        EventInc Admin
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label 
              for="email" 
              class="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="credentials.email"
                type="email"
                required
                autocomplete="email"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label 
              for="password" 
              class="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                required
                autocomplete="current-password"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <!-- Error message -->
          <div 
            v-if="error" 
            class="mt-3 text-sm text-red-600"
          >
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>