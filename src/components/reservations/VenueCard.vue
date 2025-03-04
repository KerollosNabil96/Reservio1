<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
  >
    <!-- Top Image with overlay gradient and category badge -->
    <div class="relative">
      <img
        :src="source || '../../assets/pictures/football1.png'"
        :alt="title"
        class="w-full h-52 object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
      ></div>
      <div
        v-if="$route.path === '/'"
        class="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full"
      >
        Popular
      </div>
      <div class="absolute bottom-3 left-3">
        <span
          class="bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full text-sm"
        >
          {{ price }} EGP/hr
        </span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="p-5 flex flex-col flex-grow">
      <!-- Title -->
      <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">
        {{ title }}
      </h3>

      <p class="text-sm text-gray-600 mb-4 dark:text-gray-300 line-clamp-2">
        {{ description }}
      </p>

      <!-- Bottom section with location and button -->
      <div class="mt-auto flex items-center justify-between">
        <div class="flex items-center text-gray-500 dark:text-gray-400">
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          <span class="text-xs">Cairo</span>
        </div>
        <RouterLink :to="`/book-now/${id}`" class="text-white">
          <BaseButton
            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md transform transition-all duration-300 hover:scale-105 shadow-md"
          >
            Book Now
          </BaseButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReservationCard",
  props: ["source", "title", "description", "price", "id"],
};
</script>

<style scoped>
/* 
  By default, the card has:
  - A light gray border
  - Rounded corners (rounded-md)
  - A subtle shadow (shadow-sm)
  - A fixed image height (h-48) for consistent layout
*/
</style>
