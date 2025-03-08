<template>
  <div class="main-content">
    <div class="booking-section">
      <div class="booking-header text-xl md:text-2xl font-bold dark:text-white">
        <h1 class="text-2xl font-bold text-green-600 mb-6">Venues List</h1>
      </div>
    </div>
  </div>
  <div v-if="filteredVenues.length === 0" class="no-bookings">
    <p>No Venues To Display</p>
  </div>
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <div
      v-for="venue in filteredVenues"
      :key="venue.id"
      class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div class="relative">
        <img
          :src="venue.pictures[0]"
          :alt="venue.venueName"
          class="w-full h-52 object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
        ></div>
        <div class="absolute bottom-3 left-3">
          <span
            class="bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full text-sm"
          >
            {{ venue.price }} EGP/ {{ perWhat }}
          </span>
        </div>
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <!-- Title -->
        <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          {{ title }}
        </h3>

        <div class="flex items-center mb-2">
          <div class="text-yellow-400 flex">
            <span v-for="i in 5" :key="i" class="text-lg">
              {{ i <= Math.round(averageRating) ? "★" : "☆" }}
            </span>
          </div>
          <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {{ averageRating ? averageRating.toFixed(1) : "No ratings" }}
            <span v-if="totalReviews > 0" class="ml-1"
              >({{ totalReviews }}
              {{ totalReviews === 1 ? "review" : "reviews" }})</span
            >
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-4 dark:text-gray-300 line-clamp-2">
          {{ venue.shortDescription }}
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
            <span class="text-xs">{{ venue.address.governorate }}</span>
          </div>
          <div class="flex items-center text-gray-500 dark:text-gray-400">
            <span class="text-xs">{{ venue.selectedDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VenueCard from "../reservations/VenueCard.vue";
import store from "@/store/store";
export default {
  components: {
    VenueCard,
  },
  computed: {
    filteredVenues() {
      const userVenues = store.getters.getReservations.filter((ele) => {
        return this.$store.state.user.email == ele.owner;
      });
      return userVenues;
    },
  },
};
</script>
<style scoped>
.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
}
.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.no-bookings {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}
</style>
