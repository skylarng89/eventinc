// pages/admin/events/index.vue

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Plus, Filter, MoreHorizontal } from 'lucide-vue-next'
import { EventStatus, EventType } from '~/server/models/event.model'
import { useLogger } from '~/composables/useLogger'

definePageMeta({
  layout: 'admin'
})

const logger = useLogger()
const router = useRouter()

// State
const events = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedType = ref('all')

// Filter options
const statusOptions = [
  { value: 'all', label: 'All Status' },
  ...Object.values(EventStatus).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
  }))
]

const typeOptions = [
  { value: 'all', label: 'All Types' },
  ...Object.values(EventType).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))
]

// Methods
const fetchEvents = async () => {
  try {
    loading.value = true
    const response = await fetch('/api/admin/events?' + new URLSearchParams({
      search: searchQuery.value,
      status: selectedStatus.value,
      type: selectedType.value
    }))
    
    if (!response.ok) throw new Error('Failed to fetch events')
    
    const data = await response.json()
    events.value = data.events
    logger.info('Events fetched successfully', { count: data.events.length })
  } catch (error) {
    logger.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  logger.debug('Searching events', { query: searchQuery.value })
  fetchEvents()
}

const handleStatusChange = () => {
  logger.debug('Status filter changed', { status: selectedStatus.value })
  fetchEvents()
}

const handleTypeChange = () => {
  logger.debug('Type filter changed', { type: selectedType.value })
  fetchEvents()
}

const handleCreateEvent = () => {
  router.push('/admin/events/create')
}

const handleEditEvent = (eventId: string) => {
  router.push(`/admin/events/${eventId}/edit`)
}

const handleToggleStatus = async (eventId: string, currentStatus: EventStatus) => {
  try {
    const newStatus = currentStatus === EventStatus.PUBLISHED 
      ? EventStatus.DRAFT 
      : EventStatus.PUBLISHED

    const response = await fetch(`/api/admin/events/${eventId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })

    if (!response.ok) throw new Error('Failed to update event status')

    logger.info('Event status updated', { eventId, status: newStatus })
    await fetchEvents()
  } catch (error) {
    logger.error('Error updating event status:', error)
  }
}

// Initial load
onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div class="min-w-0 flex-1">
        <h1 class="text-lg font-medium leading-6 text-gray-900 sm:truncate">
          Events
        </h1>
      </div>
      <div class="mt-4 flex sm:mt-0 sm:ml-4">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="handleCreateEvent"
        >
          <Plus class="mr-2 h-4 w-4" />
          Create Event
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Search -->
        <div class="flex-1 max-w-lg">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search events..."
              class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              @input="handleSearch"
            >
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-4">
          <select
            v-model="selectedStatus"
            class="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            @change="handleStatusChange"
          >
            <option 
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <select
            v-model="selectedType"
            class="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            @change="handleTypeChange"
          >
            <option 
              v-for="option in typeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Events Table -->
    <div class="min-h-[500px] relative">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-sm text-gray-600">Loading events...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="events.length === 0"
        class="text-center py-12"
      >
        <h3 class="mt-2 text-sm font-semibold text-gray-900">No events found</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new event.
        </p>
        <div class="mt-6">
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="handleCreateEvent"
          >
            <Plus class="mr-2 h-4 w-4" />
            Create Event
          </button>
        </div>
      </div>

      <!-- Events List -->
      <div v-else>
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th 
                scope="col" 
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Event
              </th>
              <th 
                scope="col" 
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Type
              </th>
              <th 
                scope="col" 
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Date
              </th>
              <th 
                scope="col" 
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th 
                scope="col" 
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Registrations
              </th>
              <th 
                scope="col" 
                class="relative py-3.5 pl-3 pr-4 sm:pr-6"
              >
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="event in events" :key="event._id">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center">
                  <div 
                    v-if="event.image?.url"
                    class="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200"
                  >
                    <img 
                      :src="event.image.url" 
                      :alt="event.image.alt"
                      class="h-10 w-10 rounded-md object-cover"
                    >
                  </div>
                  <div 
                    v-else
                    class="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center"
                  >
                    <span class="text-gray-500 text-xs">No image</span>
                  </div>
                  <div class="ml-4">
                    <div class="font-medium text-gray-900">{{ event.title }}</div>
                    <div class="text-gray-500">{{ event.location.type }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ event.type }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
              <!-- Events Table -->
  <div class="min-h-[500px] relative">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-600">Loading events...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="events.length === 0"
      class="text-center py-12"
    >
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No events found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new event.
      </p>
      <div class="mt-6">
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="handleCreateEvent"
        >
          <Plus class="mr-2 h-4 w-4" />
          Create Event
        </button>
      </div>
    </div>

    <!-- Events List -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th 
              scope="col" 
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Event
            </th>
            <th 
              scope="col" 
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Type
            </th>
            <th 
              scope="col" 
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Date
            </th>
            <th 
              scope="col" 
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th 
              scope="col" 
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Registrations
            </th>
            <th 
              scope="col" 
              class="relative py-3.5 pl-3 pr-4 sm:pr-6"
            >
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="event in events" :key="event._id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="flex items-center">
                <div 
                  v-if="event.image?.url"
                  class="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200"
                >
                  <img 
                    :src="event.image.url" 
                    :alt="event.image.alt"
                    class="h-10 w-10 rounded-md object-cover"
                  >
                </div>
                <div 
                  v-else
                  class="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center"
                >
                  <span class="text-gray-500 text-xs">No image</span>
                </div>
                <div class="ml-4">
                  <div class="font-medium text-gray-900">{{ event.title }}</div>
                  <div class="text-gray-500">{{ event.location.type }}</div>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ event.type }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ new Date(event.startDate).toLocaleDateString() }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                :class="{
                  'bg-green-100 text-green-800': event.status === 'published',
                  'bg-yellow-100 text-yellow-800': event.status === 'draft',
                  'bg-red-100 text-red-800': event.status === 'cancelled'
                }"
              >
                {{ event.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ event.meta.registeredCount }} / {{ event.capacity }}
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="flex justify-end gap-2">
                <button
                  @click="handleEditEvent(event._id)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <button
                  @click="handleToggleStatus(event._id, event.status)"
                  class="text-gray-600 hover:text-gray-900"
                >
                  {{ event.status === 'published' ? 'Unpublish' : 'Publish' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>