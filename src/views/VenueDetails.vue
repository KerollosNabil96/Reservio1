<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Venue Title -->
    <h1
      class="text-2xl font-bold text-center text-blue-900 dark:text-blue-400 mb-2"
    >
      {{ currentVenue.name }}
    </h1>
    <p class="text-center text-gray-500 dark:text-gray-400 mb-6">
      {{ currentVenue.address.city }}, {{ currentVenue.address.governorate }}
    </p>

    <!-- Image Gallery -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 mb-8">
      <!-- Main large image on left (full width on mobile) -->
      <div class="col-span-1 md:col-span-7">
        <img
          :src="currentVenue.pictures[0]"
          alt="Venue main view"
          class="w-full h-full object-cover rounded-lg border dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal(currentVenue.pictures[0])"
        />
      </div>

      <!-- Two stacked images on right (side by side on mobile) -->
      <div
        class="col-span-1 md:col-span-5 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-2"
      >
        <img
          :src="currentVenue.pictures[1]"
          alt="Venue view 2"
          class="w-full h-full object-cover rounded-lg border dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal(currentVenue.pictures[1])"
        />
        <img
          :src="currentVenue.pictures[2]"
          alt="Venue view 3"
          class="w-full h-full object-cover rounded-lg border dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal(currentVenue.pictures[2])"
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
          {{ currentVenue.longDescription }}
        </p>
        <h2 class="mt-5 text-lg">Full address</h2>
        <h3 class="text-gray-600">
          {{ fullAddress }}
        </h3>
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
            <span class="font-medium dark:text-white">{{
              review.username
            }}</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            {{ review.message }}
          </p>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-screen p-2">
        <button
          @click="closeImageModal"
          class="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          :src="selectedImage"
          class="w-[80vw] max-h-[90vh] object-contain"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showImageModal: false,
      selectedImage: null,
    };
  },
  computed: {
    currentVenue() {
      const id = this.$route.params.id;
      return this.$store.getters.getVenueById(id);
    },
    fullAddress() {
      return `${this.currentVenue.address.street}, ${this.currentVenue.address.city}, ${this.currentVenue.address.governorate}`;
    },
  },
  methods: {
    openImageModal(imageUrl) {
      this.selectedImage = imageUrl;
      this.showImageModal = true;
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    },
    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = ""; // Restore scrolling
    },
  },
};
</script>
