<template>
  <div class="mt-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Dynamic reviews using v-for -->
      <div
        v-for="(review, index) in currentVenue.reviews"
        :key="index"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-800"
      >
        <div class="flex items-center mb-2">
          <div
            class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mr-2"
          >
            <img
              :src="review.userPic"
              :alt="review.username"
              class="w-full h-full object-cover"
            />
          </div>
          <span class="font-medium dark:text-white">{{ review.username }}</span>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          {{ review.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentVenue"],
};
</script>

<style lang="scss" scoped></style>
