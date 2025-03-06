<template>
  <div>
    <div
      class="flex flex-wrap gap-4 items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-xl md:w-11/12 mx-auto text-gray-900 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <!-- Pick a date -->
      <div class="relative flex-grow min-h-[40px]">
        <input
          type="date"
          v-model="selectedDate"
          class="w-full appearance-none bg-white px-4 py-2 rounded-lg shadow cursor-pointer"
          :class="{ 'text-gray-400': !selectedDate }"
          placeholder="Pick a date"
        />
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
        </div>
        <span
          class="pointer-events-none absolute inset-y-0 left-10 flex items-center"
        >
          {{ selectedDate ? formatDate(selectedDate) : "Pick a date" }}
        </span>
      </div>

      <!-- Category -->
      <div class="relative flex-grow min-h-[40px]">
        <select
          v-model="selectedCategory"
          class="w-full appearance-none bg-white px-4 py-2 rounded-lg shadow cursor-pointer pr-10"
        >
          <option value="" disabled selected hidden>Category</option>
          <option>All</option>
          <option value="Stadium">Stadium</option>
          <option value="Educational">Educational</option>
          <option value="Medical">Medical</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <!-- Select Location -->
      <div class="relative flex-grow min-h-[40px]">
        <select
          v-model="selectedLocation"
          class="w-full appearance-none bg-white pl-10 pr-4 py-2 rounded-lg shadow cursor-pointer"
        >
          <option value="" disabled selected hidden>Select Location</option>
          <option v-for="city in cities" :value="city">{{ city }}</option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
        </div>
      </div>

      <!-- Search Button -->
      <BaseButton
        @click="validateAndSearch"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow"
      >
        Search
      </BaseButton>

      <!-- Error Dialog -->
      <ErrorDialog
        :show="showErrorDialog"
        title="Missing Information"
        message="Please fill in all required fields:"
        @close="showErrorDialog = false"
      >
        <ul class="list-disc pl-5 mb-4">
          <li v-if="!selectedDate">Select a date</li>
          <li v-if="!selectedCategory">Choose a category</li>
          <li v-if="!selectedLocation">Select a location</li>
        </ul>
      </ErrorDialog>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import ErrorDialog from "./ErrorDialog.vue";

export default {
  components: {
    ErrorDialog,
  },
  data() {
    return {
      selectedDate: null,
      selectedCategory: "",
      selectedLocation: "",
      showErrorDialog: false,
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    validateAndSearch() {
      // For advanced search (date, category, location), we need all fields
      if (
        !this.selectedDate ||
        !this.selectedCategory ||
        !this.selectedLocation
      ) {
        this.showErrorDialog = true;
        return;
      }

      // If all fields are valid, proceed with search
      this.search();
    },
    async search() {
      // Update the search store with all search parameters
      store.commit("setSearchFilters", {
        query: "",
        date: this.selectedDate,
        category: this.selectedCategory === "All" ? "" : this.selectedCategory,
        location: this.selectedLocation,
      });

      // Always navigate to the book now page with filters
      await this.$router.push({
        path: "/book-now",
        query: {
          date: this.selectedDate || undefined,
          category: this.selectedCategory || undefined,
          location: this.selectedLocation || undefined,
        },
      });
    },
  },
  computed: {
    cities() {
      const uniqueCities = [];
      for (const rev of store.getters.getReservations) {
        const currentCity = rev.address.city;
        if (!uniqueCities.includes(currentCity)) {
          uniqueCities.push(currentCity);
        }
      }
      return uniqueCities;
    },
  },
};
</script>

<style scoped>
/* Hide default date picker icon and styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

/* Hide default select styling */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Hide default date text */
input[type="date"] {
  color: transparent;
}
</style>
