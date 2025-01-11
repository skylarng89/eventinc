// pages/admin/events/create.vue

<script setup lang="ts">
  import { ref } from 'vue';
  import { EventType, EventStatus } from '~/server/models/event.model';
  import { useLogger } from '~/composables/useLogger';

  // Additional methods for timezone
  const timezones = Intl.supportedValuesOf('timeZone');

  definePageMeta({
    layout: 'admin'
  });

  const logger = useLogger();
  const router = useRouter();

  // Form state
  const formData = ref({
    title: '',
    description: '',
    type: EventType.CONFERENCE,
    startDate: '',
    endDate: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: {
      type: 'physical',
      address: '',
      city: '',
      country: '',
      virtualLink: ''
    },
    capacity: 100,
    pricing: {
      type: 'free',
      amount: 0,
      currency: 'USD'
    },
    registrationDeadline: '',
    tags: [] as string[],
    image: {
      url: '',
      alt: ''
    }
  });

  const loading = ref(false);
  const error = ref('');

  // Event types for select
  const eventTypes = Object.values(EventType).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }));

  // Location types
  const locationTypes = [
    { value: 'physical', label: 'Physical' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  // Pricing types
  const pricingTypes = [
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' }
  ];

  // Form submission
  const handleSubmit = async () => {
    try {
      loading.value = true;
      error.value = '';

      // Validate form
      if (!formData.value.title) {
        throw new Error('Title is required');
      }

      if (!formData.value.startDate || !formData.value.endDate) {
        throw new Error('Start and end dates are required');
      }

      // Create event
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData.value,
          status: EventStatus.DRAFT
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create event');
      }

      logger.info('Event created successfully');
      router.push('/admin/events');
    } catch (err) {
      logger.error('Error creating event:', err);
      error.value = err instanceof Error ? err.message : 'Failed to create event';
    } finally {
      loading.value = false;
    }
  };

  // Handle tag input
  const newTag = ref('');
  const addTag = () => {
    if (newTag.value && !formData.value.tags.includes(newTag.value)) {
      formData.value.tags.push(newTag.value);
      newTag.value = '';
    }
  };

  const removeTag = (tag: string) => {
    formData.value.tags = formData.value.tags.filter(t => t !== tag);
  };
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <form @submit.prevent="handleSubmit">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create New Event
          </h2>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <button type="button"
            class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            @click="router.push('/admin/events')">
            Cancel
          </button>
          <button type="submit" :disabled="loading"
            class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Creating...' : 'Create Event' }}
          </button>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="rounded-md bg-red-50 p-4 mb-6">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Basic Information -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Basic Information
          </h3>

          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input id="title" v-model="formData.title" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <RichTextEditor v-model="formData.description" placeholder="Write a description for your event..." />
            </div>

            <!-- Event Type -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select id="type" v-model="formData.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="type in eventTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="tag in formData.tags" :key="tag"
                  class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
                  {{ tag }}
                  <button type="button"
                    class="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-600 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                    @click="removeTag(tag)">
                    <span class="sr-only">Remove tag</span>
                    ×
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input id="tags" v-model="newTag" type="text" placeholder="Add a tag"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  @keyup.enter.prevent="addTag">
                <button type="button"
                  class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  @click="addTag">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Date and Time Section Continuation -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Date and Time
          </h3>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Start Date -->
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input id="startDate" v-model="formData.startDate" type="datetime-local" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>

            <!-- End Date -->
            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input id="endDate" v-model="formData.endDate" type="datetime-local" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>

            <!-- Timezone -->
            <div class="sm:col-span-2">
              <label for="timezone" class="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select id="timezone" v-model="formData.timezone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="timezone in timezones" :key="timezone" :value="timezone">
                  {{ timezone }}
                </option>
              </select>
            </div>

            <!-- Registration Deadline -->
            <div class="sm:col-span-2">
              <label for="registrationDeadline" class="block text-sm font-medium text-gray-700">
                Registration Deadline
              </label>
              <input id="registrationDeadline" v-model="formData.registrationDeadline" type="datetime-local"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Location
          </h3>

          <div class="space-y-6">
            <!-- Location Type -->
            <div>
              <label for="locationType" class="block text-sm font-medium text-gray-700">
                Location Type
              </label>
              <select id="locationType" v-model="formData.location.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="type in locationTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Physical Location Fields -->
            <div v-if="['physical', 'hybrid'].includes(formData.location.type)">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input id="address" v-model="formData.location.address" type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input id="city" v-model="formData.location.city" type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>

                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input id="country" v-model="formData.location.country" type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
            </div>

            <!-- Virtual Link -->
            <div v-if="['virtual', 'hybrid'].includes(formData.location.type)">
              <label for="virtualLink" class="block text-sm font-medium text-gray-700">
                Virtual Link
              </label>
              <input id="virtualLink" v-model="formData.location.virtualLink" type="url" placeholder="https://"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
          </div>
        </div>
      </div>

      <!-- Capacity and Pricing -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
            Capacity and Pricing
          </h3>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Capacity -->
            <div>
              <label for="capacity" class="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input id="capacity" v-model.number="formData.capacity" type="number" min="1" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>

            <!-- Pricing Type -->
            <div>
              <label for="pricingType" class="block text-sm font-medium text-gray-700">
                Pricing Type
              </label>
              <select id="pricingType" v-model="formData.pricing.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option v-for="type in pricingTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Amount and Currency (if paid) -->
            <template v-if="formData.pricing.type === 'paid'">
              <div>
                <label for="amount" class="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input id="amount" v-model.number="formData.pricing.amount" type="number" min="0" step="0.01" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>

              <div>
                <label for="currency" class="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select id="currency" v-model="formData.pricing.currency"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </template>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>