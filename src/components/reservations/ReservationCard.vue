<template>
  <div
    class="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col"
  >
    <!-- Top Image -->
    <img :src="source" :alt="title" class="w-full h-48 object-cover" />

    <!-- Card Content -->
    <div class="p-4 flex flex-col flex-grow">
      <!-- Title & Subtitle -->
      <h3 class="text-lg font-semibold mb-1">
        {{ title }}
      </h3>

      <!-- Description (Lorem Ipsum) -->
      <p class="text-sm text-gray-500 mb-4">
        {{ description }}
      </p>

      <!-- Bottom Price & Button -->
      <div class="mt-10 flex items-center justify-between">
        <span
          class="text-sm text-gray-500 font-medium border-1 border-gray-500 p-2 rounded-md"
        >
          {{ price }} EGP/hr
        </span>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Now
        </button>
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
