// pages/events/[id].vue

<script setup lang="ts">
const route = useRoute()
const eventId = route.params.id

// This will be replaced with real data fetching later
const event = ref({
  id: eventId,
  title: 'Sample Event',
  date: '2025-02-01',
  location: 'Virtual',
  description: 'This is a sample event description',
  capacity: 100,
  registeredCount: 45
})

const registerForEvent = () => {
  // TODO: Implement registration logic
  alert('Registration functionality coming soon!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="px-6 py-8">
          <div class="mb-6">
            <NuxtLink
              to="/events"
              class="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Events
            </NuxtLink>
          </div>

          <h1 class="text-3xl font-bold text-gray-900">
            {{ event.title }}
          </h1>

          <div class="mt-4 space-y-2">
            <p class="text-gray-600">
              <span class="font-medium">Date:</span> 
              {{ new Date(event.date).toLocaleDateString() }}
            </p>
            <p class="text-gray-600">
              <span class="font-medium">Location:</span>
              {{ event.location }}
            </p>
            <p class="text-gray-600">
              <span class="font-medium">Available Spots:</span>
              {{ event.capacity - event.registeredCount }} of {{ event.capacity }}
            </p>
          </div>

          <div class="mt-6">
            <h2 class="text-xl font-semibold text-gray-900">
              About this event
            </h2>
            <p class="mt-2 text-gray-600">
              {{ event.description }}
            </p>
          </div>

          <div class="mt-8">
            <button
              @click="registerForEvent"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register for Event
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>