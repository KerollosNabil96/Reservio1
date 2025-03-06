<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 transform transition-all duration-500"
  >
    <!-- Section title -->
    <div class="flex justify-between items-center mb-6">
      <SkeletonLoader height="32px" width="180px" />
      <SkeletonLoader height="20px" width="100px" />
    </div>

    <!-- Rating summary -->
    <div
      class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8"
    >
      <div class="flex flex-col items-center">
        <SkeletonLoader height="40px" width="80px" class="mb-2" />
        <SkeletonLoader height="16px" width="60px" />
      </div>
      <div class="w-3/4">
        <div class="space-y-2">
          <div class="flex items-center" v-for="i in 5" :key="`rating-${i}`">
            <SkeletonLoader height="16px" width="80px" class="mr-2" />
            <SkeletonLoader height="8px" class="flex-grow rounded-full" />
            <SkeletonLoader height="16px" width="30px" class="ml-2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews list -->
    <div class="space-y-6">
      <div
        v-for="i in count"
        :key="`review-${i}`"
        class="border-b dark:border-gray-700 pb-6 last:border-0 last:pb-0"
      >
        <div class="flex items-start">
          <!-- Avatar -->
          <div class="mr-4">
            <SkeletonLoader width="48px" height="48px" rounded="9999px" />
          </div>

          <!-- Review content -->
          <div class="flex-1">
            <!-- Name and date -->
            <div class="flex justify-between mb-2">
              <SkeletonLoader height="20px" width="120px" />
              <SkeletonLoader height="16px" width="100px" />
            </div>

            <!-- Rating -->
            <SkeletonLoader height="20px" width="120px" class="mb-3" />

            <!-- Review text -->
            <div class="space-y-2">
              <SkeletonLoader height="16px" />
              <SkeletonLoader height="16px" width="95%" />
              <SkeletonLoader height="16px" width="90%" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add review section -->
    <div class="mt-8 pt-4 border-t dark:border-gray-700">
      <SkeletonLoader height="28px" width="180px" class="mb-4" />
      <div class="space-y-4">
        <SkeletonLoader height="24px" width="150px" />
        <SkeletonLoader height="100px" width="100%" class="rounded-lg" />
        <div class="flex justify-end">
          <SkeletonLoader height="40px" width="120px" rounded="0.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from "@/components/common/SkeletonLoader.vue";

export default {
  name: "ReviewsSkeleton",
  components: {
    SkeletonLoader,
  },
  props: {
    count: {
      type: Number,
      default: 3,
    },
  },
};
</script>
