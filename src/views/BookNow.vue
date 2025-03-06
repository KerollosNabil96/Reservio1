<template>
  <div
    class="min-h-screen w-full bg-white text-gray-800 font-sans flex flex-col dark:bg-gray-800 dark:text-white"
  >
    <h1 class="font-bold text-3xl text-center my-4 text-blue-600">
      Reserve Your Spot
    </h1>

    <div class="w-full md:w-11/12 md:mx-auto">
      <SearchBox />

      <!-- Real-time search bar -->
      <div class="px-6 md:px-16 mt-8">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search venues by name..."
            class="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <section class="mt-8 px-6 md:px-16">
        <VenueCardList />
      </section>
    </div>
  </div>
</template>

<script>
import SearchBox from "@/components/homepage/SearchBox.vue";
import VenueCardList from "../components/reservations/VenueCardList.vue";
import store from "@/store/store";

export default {
  name: "bookNow",
  components: {
    VenueCardList,
    SearchBox,
  },
  data() {
    return {
      searchQuery: "",
      searchDebounce: null,
    };
  },
  watch: {
    searchQuery: {
      handler(newValue) {
        // Debounce the search to avoid too many updates
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => {
          store.commit("setSearchFilters", {
            ...store.state.searchFilters,
            query: newValue,
          });
        }, 300); // Wait 300ms after typing stops
      },
    },
  },
  created() {
    // Set search filters from query parameters if they exist
    const { date, category, location } = this.$route.query;
    if (date || category || location) {
      store.commit("setSearchFilters", {
        query: "",
        date: date || null,
        category: category || "",
        location: location || "",
      });
    }
  },
};
</script>

<style scoped></style>
