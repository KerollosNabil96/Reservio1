<template>
  <!-- Responsive grid of reservation cards -->
  <div class="mb-6">
    <div
      v-if="searchApplied && !isHomePage"
      class="flex items-center justify-between mb-4"
    >
      <p class="text-gray-600 dark:text-gray-300">
        {{ filteredVenues.length }}
        {{ filteredVenues.length === 1 ? "result" : "results" }} found
      </p>
      <button
        @click="clearSearch"
        class="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
      >
        <span>Clear filters</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 ml-1"
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
    </div>

    <!-- Pagination info - showing X-Y of Z results -->
    <div
      v-if="!isHomePage && filteredVenues.length > 0"
      class="text-sm text-gray-500 dark:text-gray-400 mb-4"
    >
      {{$t("showing")}} {{ paginationStart }} - {{ paginationEnd }} {{$t("of")}}
      {{ filteredVenues.length }} {{$t("results")}}
    </div>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <VenueCardSkeleton v-for="n in 6" :key="n" />
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredVenues.length === 0" class="text-center py-8">
      <p class="text-gray-500 dark:text-gray-400 text-lg">
        No venues found matching your search criteria.
      </p>
      <button
        @click="clearSearch"
        class="mt-4 text-blue-600 hover:text-blue-800 underline"
      >
        Clear search filters
      </button>
    </div>

    <!-- Results grid with fade transition -->
    <transition-group
      v-else
      name="venue-fade"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
    >
      <VenueCard
        v-for="venue in paginatedVenues"
        :key="venue.id"
        :source="venue.pictures ? venue.pictures[0] : ''"
        :title="venue.venueName"
        :category="venue.category"
        :description="venue.shortDescription"
        :price="venue.price"
        :id="venue.id"
        :showTopRatedBadge="isHomePage"
        :location="venue.address"
      />
    </transition-group>

    <!-- Pagination controls -->
    <div
      v-if="!isHomePage && filteredVenues.length > itemsPerPage"
      class="flex justify-center items-center mt-8 space-x-2"
    >
      <!-- Previous page button -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- Page numbers -->
      <div class="flex space-x-1">
        <button
          v-for="page in displayedPageNumbers"
          :key="page"
          @click="goToPage(page)"
          :class="[
            page === '...'
              ? 'px-4 py-2 bg-transparent text-gray-500 dark:text-gray-400 cursor-default'
              : 'px-4 py-2 rounded-md transition-colors duration-200',
            currentPage === page
              ? 'bg-blue-600 dark:bg-blue-500 text-white'
              : page !== '...'
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              : '',
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next page button -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import VenueCard from "./VenueCard.vue";
import VenueCardSkeleton from "./VenueCardSkeleton.vue";

export default {
  components: {
    VenueCard,
    VenueCardSkeleton,
  },
  props: {
    isHomePage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
    };
  },
  computed: {
    filteredVenues() {
      // Get venues from store (either top rated or filtered)
      let venues = this.isHomePage
        ? store.getters.getTopRatedVenues
        : store.getters.getFilteredVenues;

      // Filter out venues with no available time slots
      return venues.filter((venue) => {
        // If venue has no timeSlots, exclude it
        if (!venue.timeSlots || Object.keys(venue.timeSlots).length === 0) {
          return false;
        }

        // Check if at least one time slot exists (exist: true)
        return Object.values(venue.timeSlots).some(
          (slot) => slot.exist !== false
        );
      });
    },

    // Rest of your computed properties remain the same
    searchApplied() {
      const filters = store.state.searchFilters;
      return (
        filters.query || filters.date || filters.category || filters.location
      );
    },
    isLoading() {
      return store.state.isLoading;
    },
    totalPages() {
      return Math.ceil(this.filteredVenues.length / this.itemsPerPage);
    },
    displayedPageNumbers() {
      // Logic to display a reasonable number of page numbers
      const totalDisplayed = 5; // Max number of page buttons to show
      const pages = [];

      if (this.totalPages <= totalDisplayed) {
        // If we have fewer pages than our display limit, show all pages
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always include first page
        pages.push(1);

        // Calculate start and end of the displayed range
        let start = Math.max(
          2,
          this.currentPage - Math.floor(totalDisplayed / 2)
        );
        let end = Math.min(this.totalPages - 1, start + totalDisplayed - 3);

        // Adjust start if end is at its maximum
        if (end === this.totalPages - 1) {
          start = Math.max(2, end - (totalDisplayed - 3));
        }

        // Add ellipsis if needed
        if (start > 2) {
          pages.push("...");
        }

        // Add page numbers in the middle
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        // Add ellipsis if needed
        if (end < this.totalPages - 1) {
          pages.push("...");
        }

        // Always include last page
        pages.push(this.totalPages);
      }

      return pages;
    },
    paginatedVenues() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredVenues.slice(start, start + this.itemsPerPage);
    },
    paginationStart() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    paginationEnd() {
      return Math.min(
        this.currentPage * this.itemsPerPage,
        this.filteredVenues.length
      );
    },
  },
  methods: {
    clearSearch() {
      store.commit("setSearchFilters", {
        query: "",
        date: null,
        category: "",
        location: "",
        sortBy: "rating",
      });
      this.currentPage = 1; // Reset to first page when clearing search
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.scrollToTop();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.scrollToTop();
      }
    },
    goToPage(page) {
      if (page !== "...") {
        this.currentPage = page;
        this.scrollToTop();
      }
    },
    scrollToTop() {
      // Smooth scroll to the top of the venue list
      window.scrollTo({
        top: this.$el.offsetTop - 100,
        behavior: "smooth",
      });
    },
  },
  watch: {
    // Reset to page 1 when filters change
    "filteredVenues.length"() {
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
/* Skeleton animation is defined in the SkeletonLoader component */

/* Venue card fade transition */
.venue-fade-enter-active,
.venue-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  will-change: opacity, transform;
  backface-visibility: hidden;
}

.venue-fade-enter-from,
.venue-fade-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

/* This is the key animation for smooth sorting */
.venue-fade-move {
  transition: transform 0.8s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  transform-origin: center center;
  position: relative;
  z-index: 1;
  will-change: transform;
  backface-visibility: hidden;
}

/* Add a subtle scale effect during movement */
.venue-fade-move:hover {
  z-index: 2;
}

/* Ensure dark mode respects our transitions */
:deep(.dark) .venue-fade-enter-active,
:deep(.dark) .venue-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0.01, 0.165, 0.99) !important;
  will-change: opacity, transform;
  backface-visibility: hidden;
}

:deep(.dark) .venue-fade-move {
  transition: transform 0.8s cubic-bezier(0.4, 0.01, 0.165, 0.99) !important;
  transform-origin: center center;
  will-change: transform;
  backface-visibility: hidden;
}
</style>
