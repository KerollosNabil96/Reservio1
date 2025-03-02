<template>
  <div
    class="mx-6 md:mx-16 bg-[#EAF1FF] shadow-md rounded-4xl p-6 md:p-8 -mt-4 relative z-10"
  >
    <form class="flex flex-col sm:flex-row justify-between gap-2">
      <!-- Pick a date -->
      <div class="flex flex-col grow-1">
        <input
          id="date"
          type="date"
          placeholder="test"
          v-model="date"
          required
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <div class="flex flex-col grow-1">
        <select
          id="category"
          v-model="category"
          required
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          <option>All</option>
          <option>Sports</option>
          <option>Events</option>
          <option>Meeting</option>
        </select>
      </div>

      <!-- Select Location -->
      <div class="flex flex-col grow-1">
        <input
          id="location"
          type="text"
          placeholder="Search location..."
          v-model="location"
          required
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <!-- Search Button -->
      <div class="flex items-end grow-1">
        <button
          class="bg-blue-600 text-white w-full px-6 py-2.5 hover:cursor-pointer rounded-md hover:bg-blue-700 transition-colors"
          @click.prevent="searchReservations"
        >
          Search
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {};
</script>
