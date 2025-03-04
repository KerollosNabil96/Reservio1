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
        class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600"
      >
        {{ fullAddress }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentVenue", "fullAddress"],
};
</script>
