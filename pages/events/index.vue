// pages/events/index.vue

<script setup lang="ts">
const events = ref([
  // Placeholder data - will be replaced with real data later
  {
    id: 1,
    title: 'Sample Event',
    date: '2025-02-01',
    location: 'Virtual',
    description: 'This is a sample event description'
  }
])
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
          Upcoming Events
        </h1>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Browse and register for our upcoming events
        </p>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="event in events" 
          :key="event.id"
          class="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">
              {{ event.title }}
            </h3>
            <div class="mt-2 text-sm text-gray-500">
              <p>Date: {{ new Date(event.date).toLocaleDateString() }}</p>
              <p>Location: {{ event.location }}</p>
            </div>
            <p class="mt-3 text-sm text-gray-600">
              {{ event.description }}
            </p>
            <div class="mt-4">
              <NuxtLink
                :to="`/events/${event.id}`"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>