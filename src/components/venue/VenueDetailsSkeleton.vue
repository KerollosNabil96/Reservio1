<template>
  <div class="relative">
    <!-- Title Section Skeleton -->
    <div class="mb-8 transform transition-all duration-500">
      <div class="flex flex-col items-center">
        <SkeletonLoader
          height="48px"
          width="70%"
          class="mb-2"
          rounded="0.5rem"
        />
        <div class="flex items-center justify-center">
          <SkeletonLoader height="20px" width="200px" class="mt-2" />
        </div>
      </div>
    </div>

    <!-- Image Gallery Section Skeleton -->
    <div class="mb-12">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <!-- Main large image skeleton -->
        <div class="col-span-1 md:col-span-7">
          <div class="relative overflow-hidden rounded-xl shadow-2xl">
            <SkeletonLoader height="400px" />
          </div>
        </div>

        <!-- Side images skeleton -->
        <div
          class="col-span-1 md:col-span-5 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4"
        >
          <div class="relative overflow-hidden rounded-xl shadow-2xl">
            <SkeletonLoader height="195px" />
          </div>
          <div class="relative overflow-hidden rounded-xl shadow-2xl">
            <SkeletonLoader height="195px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Skeleton -->
    <div class="mb-6">
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <div class="py-3 px-6 border-b-2 border-blue-600 dark:border-blue-400">
          <div class="flex items-center">
            <div class="h-5 w-5 mr-2 rounded-full">
              <SkeletonLoader height="20px" width="20px" rounded="9999px" />
            </div>
            <SkeletonLoader height="20px" width="100px" />
          </div>
        </div>
        <div class="py-3 px-6 border-b-2 border-transparent">
          <div class="flex items-center">
            <div class="h-5 w-5 mr-2 rounded-full">
              <SkeletonLoader height="20px" width="20px" rounded="9999px" />
            </div>
            <SkeletonLoader height="20px" width="80px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Venue Info and Booking Section Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
      <!-- About Venue Skeleton -->
      <div class="col-span-1 md:col-span-7 space-y-6">
        <!-- Description -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <SkeletonLoader height="28px" width="180px" class="mb-6" />
          <div class="space-y-4 mb-6">
            <SkeletonLoader height="16px" />
            <SkeletonLoader height="16px" />
            <SkeletonLoader height="16px" width="90%" />
            <SkeletonLoader height="16px" width="95%" />
          </div>

          <!-- Features List -->
          <SkeletonLoader height="28px" width="150px" class="mb-4" />
          <div class="grid grid-cols-2 gap-3 mb-6">
            <div class="flex items-center">
              <div class="mr-2">
                <SkeletonLoader width="20px" height="20px" rounded="9999px" />
              </div>
              <SkeletonLoader height="16px" width="80%" />
            </div>
            <div class="flex items-center">
              <div class="mr-2">
                <SkeletonLoader width="20px" height="20px" rounded="9999px" />
              </div>
              <SkeletonLoader height="16px" width="70%" />
            </div>
            <div class="flex items-center">
              <div class="mr-2">
                <SkeletonLoader width="20px" height="20px" rounded="9999px" />
              </div>
              <SkeletonLoader height="16px" width="85%" />
            </div>
            <div class="flex items-center">
              <div class="mr-2">
                <SkeletonLoader width="20px" height="20px" rounded="9999px" />
              </div>
              <SkeletonLoader height="16px" width="75%" />
            </div>
          </div>

          <!-- Location -->
          <SkeletonLoader height="28px" width="150px" class="mb-4" />
          <SkeletonLoader height="200px" class="rounded-lg" />
        </div>
      </div>

      <!-- Booking Card Skeleton -->
      <div class="col-span-1 md:col-span-5">
        <div
          class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          <SkeletonLoader height="28px" width="150px" class="mb-6" />

          <div class="flex items-baseline mb-6">
            <SkeletonLoader height="32px" width="120px" />
            <SkeletonLoader height="16px" width="50px" class="ml-2" />
          </div>

          <SkeletonLoader height="48px" rounded="0.5rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from "@/components/common/SkeletonLoader.vue";

export default {
  name: "VenueDetailsSkeleton",
  components: {
    SkeletonLoader,
  },
};
</script>
