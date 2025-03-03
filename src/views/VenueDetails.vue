<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Venue Title -->
    <h1
      class="text-2xl font-bold text-center text-blue-900 dark:text-blue-400 mb-2"
    >
      {{ currentVenue.name }}
    </h1>
    <p class="text-center text-gray-500 dark:text-gray-400 mb-6">
      Nasr City, Cairo
    </p>

    <!-- Image Gallery -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-8">
      <!-- Main large image on left (full width on mobile) -->
      <div class="col-span-1 md:col-span-7">
        <img
          :src="currentVenue.pictures[0]"
          alt="Venue main view"
          class="w-full h-full object-cover rounded-lg border dark:border-gray-700"
        />
      </div>

      <!-- Two stacked images on right (side by side on mobile) -->
      <div
        class="col-span-1 md:col-span-5 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-2"
      >
        <img
          :src="currentVenue.pictures[1]"
          alt="Venue view 2"
          class="w-full h-full object-cover rounded-lg border dark:border-gray-700"
        />
        <img
          :src="currentVenue.pictures[2]"
          alt="Venue view 3"
          class="w-full h-full object-cover rounded-lg border dark:border-gray-700"
        />
      </div>
    </div>

    <!-- Venue Info and Booking Section -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
      <!-- About the place (full width on mobile) -->
      <div class="col-span-1 md:col-span-7">
        <h2 class="text-lg font-semibold mb-2 dark:text-white">
          About the place
        </h2>
        <p class="text-gray-700 dark:text-gray-300 text-sm">
          Our football field offers a high-quality playing surface designed for
          both casual and competitive matches. Featuring well-maintained turf,
          excellent lighting, and a spacious layout, it provides the perfect
          environment for players of all skill levels. Whether you're looking to
          enjoy a friendly game or train seriously, our facility ensures a
          top-tier football experience with easy booking and affordable rates.
        </p>
      </div>

      <!-- Booking Info Card (full width on mobile) -->
      <div class="col-span-1 md:col-span-5">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 dark:shadow-gray-700"
        >
          <h2 class="text-lg font-semibold mb-4 dark:text-white">
            Start Booking
          </h2>
          <div class="flex items-baseline mb-4">
            <span class="text-green-500 dark:text-green-400 font-bold text-2xl"
              >{{ currentVenue.price }}EGP</span
            >
            <span class="text-gray-400 dark:text-gray-300 text-sm ml-2"
              >/ Hour</span
            >
          </div>

          <button
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors w-full text-center"
          >
            Book Now!
          </button>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-4 dark:text-white">
        Hear from Our Visitors
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First row of reviews -->
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-800"
        >
          <div class="flex items-center mb-2">
            <div
              class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mr-2"
            >
              <img
                :src="currentVenue.reviews[0].userPic"
                alt="Kareem Mohamed"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="font-medium dark:text-white">Kareem Mohamed</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Great football field with excellent turf and lighting. Easy booking
            and a great atmosphere. Highly recommended!
          </p>
        </div>

        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-800"
        >
          <div class="flex items-center mb-2">
            <div
              class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mr-2"
            >
              <img
                :src="currentVenue.reviews[0].userPic"
                alt="Hazem Abdulmoneim"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="font-medium dark:text-white">Hazem Abdulmoneim</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Great football field with excellent turf and lighting. Easy booking
            and a great atmosphere. Highly recommended!
          </p>
        </div>

        <!-- Second row of reviews -->
        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-800"
        >
          <div class="flex items-center mb-2">
            <div
              class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mr-2"
            >
              <img
                :src="currentVenue.reviews[0].userPic"
                alt="Kareem Mohamed"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="font-medium dark:text-white">Kareem Mohamed</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Great football field with excellent turf and lighting. Easy booking
            and a great atmosphere. Highly recommended!
          </p>
        </div>

        <div
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-800"
        >
          <div class="flex items-center mb-2">
            <div
              class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden mr-2"
            >
              <img
                :src="currentVenue.reviews[0].userPic"
                alt="Hazem Abdulmoneim"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="font-medium dark:text-white">Hazem Abdulmoneim</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Great football field with excellent turf and lighting. Easy booking
            and a great atmosphere. Highly recommended!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentVenue() {
      const id = this.$route.params.id;
      return this.$store.getters.getVenueById(id);
    },
  },
};
</script>
