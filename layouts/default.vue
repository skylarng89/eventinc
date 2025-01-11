// layouts/default.vue

<template>
  <div>
    <!-- Basic navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <NuxtLink
              to="/"
              class="flex-shrink-0 flex items-center"
            >
              <span class="text-xl font-bold text-indigo-600">EventInc</span>
            </NuxtLink>
          </div>
          
          <!-- Navigation Links -->
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/events"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Events
            </NuxtLink>
            <NuxtLink
              to="/admin"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main>
      <slot />
    </main>
  </div>
</template>