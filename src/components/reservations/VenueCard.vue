<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
  >
    <!-- Top Image with overlay gradient and category badge -->
    <div class="relative">
      <img
        :src="source || '../../assets/pictures/football1.png'"
        :alt="title"
        class="w-full h-52 object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
      ></div>
      <div
        v-if="showTopRatedBadge"
        class="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        Top Rated
      </div>
      <div class="absolute bottom-3 left-3">
        <span
          class="bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full text-sm"
        >
          {{ price }} EGP/ {{ perWhat }}
        </span>
      </div>
    </div>

    <!-- Card Content -->
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
          <!-- High rating badge -->
          <span
            v-if="
              !showTopRatedBadge && averageRating >= 4.5 && totalReviews > 0
            "
            class="ml-2 inline-block text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 rounded-full font-medium"
          >
            Top Rated
          </span>
        </span>
      </div>

      <p class="text-sm text-gray-600 mb-4 dark:text-gray-300 line-clamp-2">
        {{ description }}
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
          <span class="text-xs">Cairo</span>
        </div>
        <RouterLink :to="`/book-now/${id}`" class="text-white">
          <BaseButton
            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md transform transition-all duration-300 hover:scale-105 shadow-md"
          >
            Book Now
          </BaseButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ref as vueRef, onMounted } from "vue";
import { db, ref, onValue } from "@/firebase";
import store from "@/store/store";

export default {
  name: "ReservationCard",
  props: {
    source: String,
    title: String,
    description: String,
    price: Number,
    id: String,
    category: String,
    showTopRatedBadge: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      averageRating: 0,
      totalReviews: 0,
    };
  },
  computed: {
    perWhat() {
      if (this.category === "Stadium") return "Hour";
      else return "Session";
    },
  },
  mounted() {
    // Get cached ratings from the store if available
    if (this.id) {
      const venue = store.getters.getVenueById(this.id);
      if (venue && venue.averageRating !== undefined) {
        this.averageRating = venue.averageRating;
        this.totalReviews = venue.totalReviews || 0;
      } else {
        // Fallback to fetching reviews if not available in store
        this.fetchRatingsFromFirebase();
      }
    }
  },
  methods: {
    fetchRatingsFromFirebase() {
      if (!this.id) return;

      const reviewsRef = ref(db, `venues/${this.id}/reviews`);
      onValue(reviewsRef, (snapshot) => {
        const reviews = snapshot.val();
        if (reviews) {
          const reviewsArray = Object.values(reviews);
          this.totalReviews = reviewsArray.length;
          const sum = reviewsArray.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          this.averageRating = sum / this.totalReviews;

          // Update the store with this rating
          store.commit("updateVenueAverageRating", {
            venueId: this.id,
            averageRating: this.averageRating,
            totalReviews: this.totalReviews,
          });
        } else {
          this.averageRating = 0;
          this.totalReviews = 0;
        }
      });
    },
  },
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
