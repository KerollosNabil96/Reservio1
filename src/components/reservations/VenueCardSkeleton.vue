<template>
  <div
    class="h-full bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700"
  >
    <!-- Image skeleton -->
    <div class="w-full h-48 relative">
      <SkeletonLoader height="full" />
    </div>

    <!-- Content skeletons -->
    <div
      class="p-4 flex-grow flex flex-col space-y-3 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm"
    >
      <!-- Title -->
      <SkeletonLoader height="24px" width="80%" />

      <!-- Description -->
      <div class="space-y-2">
        <SkeletonLoader height="16px" />
        <SkeletonLoader height="16px" width="90%" />
      </div>

      <!-- Rating -->
      <div class="flex items-center mt-1">
        <SkeletonLoader height="16px" width="120px" />
      </div>

      <!-- Price and button -->
      <div class="mt-2 flex justify-between items-center">
        <SkeletonLoader height="20px" width="100px" />
        <SkeletonLoader height="36px" width="80px" rounded="0.5rem" />
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from "@/components/common/SkeletonLoader.vue";

export default {
  name: "VenueCardSkeleton",
  components: {
    SkeletonLoader,
  },
};
</script>
