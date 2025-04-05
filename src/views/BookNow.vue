<template>
  <div
    class="min-h-screen w-full bg-white text-gray-800 font-sans flex flex-col dark:bg-gray-800 dark:text-white"
  >
    <h1 class="font-bold text-3xl text-center my-4 text-blue-600">
      {{ $t('bookNow.reserveYourSpot') }}
    </h1>

    <div class="w-full md:w-11/12 md:mx-auto">
      <SearchBox />
      <ErrorDialog
        :show="showErrorDialog"
        :title="$t('errorDialog.title')"
        :message="$t('errorDialog.message')"
        @close="closeErrorDialog"
      >
        <ul class="list-disc pl-5 mb-4">
          <li v-if="!selectedDate">{{ $t('errorDialog.missingDate') }}</li>
          <li v-if="!selectedCategory">{{ $t('errorDialog.missingCategory') }}</li>
          <li v-if="!selectedLocation">{{ $t('errorDialog.missingLocation') }}</li>
        </ul>
      </ErrorDialog>

      <!-- Real-time search bar -->
      <div class="px-6 md:px-16 mt-8">
        <div
          class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0"
        >
          <!-- Search input -->
          <div class="relative flex-grow">
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('searchBox.search')"
              class="w-full px-4 py-4 text-xl pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

          <!-- Sort options -->
          <div class="relative min-w-[200px]">
            <select
              v-model="sortBy"
              class="appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-4 px-4 pr-10 rounded-lg text-gray-700 dark:text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-300"
            >
              <option value="rating">{{ $t('bookNow.sort.rating') }}</option>
              <option value="nearest">{{ $t('bookNow.sort.nearest') }}</option>
              <option value="furthest">{{ $t('bookNow.sort.furthest') }}</option>
              <option value="price_asc">{{ $t('bookNow.sort.priceAsc') }}</option>
              <option value="price_desc">{{ $t('bookNow.sort.priceDesc') }}</option>
            </select>
            <div
              class="absolute inset-y-0 flex items-center px-3 text-gray-700 dark:text-gray-300"
              :class="{ 'right-0': $i18n.locale !== 'ar', 'left-0': $i18n.locale === 'ar' }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  v-if="$i18n.locale === 'ar'"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div
              class="absolute left-3 -top-2.5 px-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-gradient-to-r from-white/90 via-white/90 to-white/90 dark:from-gray-700/90 dark:via-gray-700/90 dark:to-gray-700/90 rounded-md backdrop-blur-sm shadow-sm"
            >
              {{ $t('bookNow.sortBy') }}
            </div>
          </div>
        </div>
      </div>

      <section class="mt-8 px-6 md:px-16">
        <VenueCardList :isHomePage="false" />
      </section>
    </div>
  </div>
</template>

<script>
import SearchBox from "@/components/homepage/SearchBox.vue";
import VenueCardList from "../components/reservations/VenueCardList.vue";
import store from "@/store/store";
import ErrorDialog from "@/components/homepage/ErrorDialog.vue";

export default {
  name: "bookNow",
  components: {
    VenueCardList,
    SearchBox,
    ErrorDialog,
  },
  data() {
    return {
      searchQuery: "",
      searchDebounce: null,
      sortBy: "rating", // Default sort by rating
    };
  },
  methods: {
    closeErrorDialog() {
      store.state.showErrorDialog = false;
    },
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
    sortBy: {
      handler(newValue) {
        store.commit("setSortBy", newValue);
      },
      immediate: true, // Set initial value
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
  computed: {
    showErrorDialog() {
      return store.state.showErrorDialog;
    },
  },
};
</script>

<style scoped></style>
