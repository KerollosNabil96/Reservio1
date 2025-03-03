<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-md shadow-md overflow-hidden flex flex-col"
  >
    <!-- Top Image -->
    <img
      src="../../assets/pictures/football1.png"
      :alt="title"
      class="w-full h-48 object-cover"
    />

    <!-- Card Content -->
    <div class="p-4 flex flex-col flex-grow">
      <!-- Title -->
      <h3 class="text-lg font-semibold mb-1">
        {{ title }}
      </h3>

      <p class="text-sm text-gray-500 mb-4 dark:text-gray-400">
        {{ description }}
      </p>

      <!-- Bottom Price & Button -->
      <div class="mt-10 flex items-center justify-between">
        <span
          class="text-sm text-gray-500 dark:text-gray-300 font-medium border-1 border-gray-500 p-2 rounded-md"
        >
          {{ price }} EGP/hr
        </span>
        <BaseButton class="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
          <RouterLink :to="`/book-now/${id}`"> Book Now </RouterLink>
        </BaseButton>
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
