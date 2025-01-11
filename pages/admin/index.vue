<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const stats = [
  { name: 'Total Events', value: '0' },
  { name: 'Active Events', value: '0' },
  { name: 'Total Registrations', value: '0' },
  { name: 'Today\'s Check-ins', value: '0' },
]
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Dashboard
      </h1>
    </header>

    <div>
      <!-- Stats Section -->
      <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in stats"
          :key="item.name"
          class="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">
            {{ item.name }}
          </dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ item.value }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>