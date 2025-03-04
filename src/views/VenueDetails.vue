<template>
  <div
    class="venue-details-container relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
  >
    <!-- Animated background elements with more subtle colors -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-24 -left-24 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slow"
      ></div>
      <div
        class="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slower"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-float"
      ></div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-8 relative z-10">
      <!-- Venue Title with animation -->
      <div class="venue-title-section animate-fade-in-down">
        <h1
          class="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
        >
          {{ currentVenue.name }}
        </h1>
        <p
          class="text-center text-gray-500 dark:text-gray-400 mb-6 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
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
          {{ currentVenue.address.city }},
          {{ currentVenue.address.governorate }}
        </p>
      </div>

      <!-- Image Gallery with enhanced animations -->
      <div class="gallery-section mb-12 animate-fade-in-up animation-delay-300">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- Main large image on left (full width on mobile) -->
          <div
            class="col-span-1 md:col-span-7 transform transition-all duration-500 hover:translate-y-[-5px]"
          >
            <div class="relative overflow-hidden rounded-xl shadow-2xl group">
              <div
                class="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              ></div>
              <img
                :src="currentVenue.pictures[0]"
                alt="Venue main view"
                class="w-full h-[300px] md:h-[400px] object-cover transition-all duration-700 group-hover:scale-105"
                @click="openImageModal(currentVenue.pictures[0])"
              />
              <div
                class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
              >
                <p class="text-sm font-medium">Click to view gallery</p>
              </div>
            </div>
          </div>

          <!-- Two stacked images on right (side by side on mobile) -->
          <div
            class="col-span-1 md:col-span-5 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4"
          >
            <div
              class="relative overflow-hidden rounded-xl shadow-2xl group transform transition-all duration-500 hover:translate-y-[-5px]"
            >
              <div
                class="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              ></div>
              <img
                :src="currentVenue.pictures[1]"
                alt="Venue view 2"
                class="w-full h-[150px] md:h-[195px] object-cover transition-all duration-700 group-hover:scale-105"
                @click="openImageModal(currentVenue.pictures[1])"
              />
              <div
                class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
              >
                <p class="text-xs font-medium">View image</p>
              </div>
            </div>

            <div
              class="relative overflow-hidden rounded-xl shadow-2xl group transform transition-all duration-500 hover:translate-y-[-5px]"
            >
              <div
                class="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              ></div>
              <img
                :src="currentVenue.pictures[2]"
                alt="Venue view 3"
                class="w-full h-[150px] md:h-[195px] object-cover transition-all duration-700 group-hover:scale-105"
                @click="openImageModal(currentVenue.pictures[2])"
              />
              <div
                class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"
              >
                <p class="text-xs font-medium">View image</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Venue Info and Booking Section with animations -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <!-- About the place (full width on mobile) -->
        <AboutVenue :current-venue="currentVenue" :full-address="fullAddress" />

        <!-- Booking Info Card (full width on mobile) -->
        <div
          class="col-span-1 md:col-span-5 animate-fade-in-up animation-delay-700"
        >
          <div
            class="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-xl relative overflow-hidden"
          >
            <!-- Decorative elements with more subtle colors -->
            <div
              class="absolute -top-10 -right-10 w-24 h-24 bg-blue-200/5 dark:bg-blue-700/5 rounded-full blur-xl"
            ></div>
            <div
              class="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-200/5 dark:bg-indigo-700/5 rounded-full blur-xl"
            ></div>

            <h2
              class="text-xl font-semibold mb-6 text-blue-900 dark:text-blue-400 relative z-10"
            >
              <span class="flex items-center">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start Booking
              </span>
            </h2>

            <div class="flex items-baseline mb-6 relative z-10">
              <span
                class="text-green-500 dark:text-green-400 font-bold text-3xl"
                >{{ currentVenue.price }}EGP</span
              >
              <span class="text-gray-500 dark:text-gray-400 text-sm ml-2"
                >/ Hour</span
              >
            </div>

            <button
              class="relative z-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] w-full text-center flex items-center justify-center"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book Now!
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <VenueReviews :current-venue="currentVenue" />

      <!-- Image Modal -->
      <div
        v-if="showImageModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
        @click="closeImageModal"
      >
        <div class="relative max-w-4xl max-h-screen p-2">
          <!-- Close button -->
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

          <!-- Left arrow navigation -->
          <button
            @click.stop="prevImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800/70 rounded-full p-2 hover:bg-gray-700 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <!-- Main image -->
          <img
            :src="selectedImage"
            class="w-[80vw] max-h-[90vh] object-contain"
            @click.stop
          />

          <!-- Right arrow navigation -->
          <button
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800/70 rounded-full p-2 hover:bg-gray-700 transition-colors"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AboutVenue from "@/components/VenueDetails/AboutVenue.vue";
import VenueReviews from "@/components/VenueDetails/VenueReviews.vue";

export default {
  data() {
    return {
      showImageModal: false,
      selectedImage: null,
      currentImageIndex: 0,
    };
  },
  components: {
    AboutVenue,
    VenueReviews,
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
      // Find the index of the clicked image
      this.currentImageIndex = this.currentVenue.pictures.findIndex(
        (pic) => pic === imageUrl
      );
      this.showImageModal = true;
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    },
    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = ""; // Restore scrolling
    },
    nextImage() {
      const totalImages = this.currentVenue.pictures.length;
      this.currentImageIndex = (this.currentImageIndex + 1) % totalImages;
      this.selectedImage = this.currentVenue.pictures[this.currentImageIndex];
    },
    prevImage() {
      const totalImages = this.currentVenue.pictures.length;
      this.currentImageIndex =
        (this.currentImageIndex - 1 + totalImages) % totalImages;
      this.selectedImage = this.currentVenue.pictures[this.currentImageIndex];
    },
  },
};
</script>
