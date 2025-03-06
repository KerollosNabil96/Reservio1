<template>
  <!-- Responsive grid of reservation cards -->
  <div class="mb-6">
    <div v-if="searchApplied" class="flex items-center justify-between mb-4">
      <p class="text-gray-600 dark:text-gray-300">
        {{ filteredVenues.length }}
        {{ filteredVenues.length === 1 ? "result" : "results" }} found
      </p>
      <button
        @click="clearSearch"
        class="text-blue-600 hover:text-blue-800 flex items-center"
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

    <div v-if="filteredVenues.length === 0" class="text-center py-8">
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

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <VenueCard
        v-for="venue in filteredVenues"
        :key="venue.id"
        :source="venue.pictures[0]"
        :title="venue.venueName"
        :description="venue.shortDescription"
        :price="venue.price"
        :id="venue.id"
      />
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import VenueCard from "./VenueCard.vue";

export default {
  components: {
    VenueCard,
  },
  data() {
    return {};
  },
  computed: {
    filteredVenues() {
      return store.getters.getFilteredVenues;
    },
    searchApplied() {
      const filters = store.state.searchFilters;
      return (
        filters.query || filters.date || filters.category || filters.location
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
      });
    },
  },
};
</script>
