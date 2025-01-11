<script setup lang="ts">
const error = useError()

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <h1 class="text-9xl font-bold text-indigo-600">
        {{ error?.statusCode || '404' }}
      </h1>
      <h2 class="mt-6 text-3xl font-bold text-gray-900">
        {{ error?.message || 'Page not found' }}
      </h2>
      <p class="mt-4 text-lg text-gray-600">
        The page you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <div class="mt-8">
        <button
          @click="handleError"
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go back home
        </button>
      </div>
    </div>
  </div>
</template>