<template>
  <div class="col-span-1 md:col-span-7 animate-fade-in-up animation-delay-500">
    <div
      class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-xl"
    >
      <h2
        class="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-400 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        About the place
      </h2>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {{ currentVenue.longDescription }}
      </p>
      <h2
        class="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-400 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Full address
      </h2>
      <div
        class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600 mb-6"
      >
        {{ fullAddress }}
      </div>

      <!-- Available Date and Time Slots Section -->
      <h2
        class="text-xl font-semibold mb-3 text-blue-900 dark:text-blue-400 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Available Date & Times
      </h2>

      <!-- Single Date Display -->
      <div class="mb-4">
        <div
          class="bg-blue-100 dark:bg-blue-900/50 border border-blue-500 dark:border-blue-400 rounded-lg px-4 py-3 mb-3"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDateDay(currentVenue.selectedDate) }}
          </p>
          <p class="text-lg font-bold text-gray-800 dark:text-white">
            {{ formatDateFull(currentVenue.selectedDate) }}
          </p>
        </div>
      </div>

      <!-- Time Slots -->
      <div
        class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600"
      >
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Available time slots
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="(slot, index) in currentVenue.timeSlots"
            :key="index"
            :class="[
              'relative p-3 rounded-md text-sm border transition-all duration-200',
              slot.available > 0
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700',
            ]"
          >
            <div class="flex justify-between items-center mb-1">
              <span class="font-medium">{{ slot.from }} - {{ slot.to }}</span>
              <span
                v-if="slot.available === 0"
                class="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full"
              >
                FULL
              </span>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <span v-if="slot.available > 0"
                >{{ slot.available }} spots available</span
              >
              <span v-else>No spots available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentVenue", "fullAddress"],
  methods: {
    formatDateDay(date) {
      return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    },
    formatDateFull(date) {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
/* Custom scrollbar for time slots section */
::-webkit-scrollbar {
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>
