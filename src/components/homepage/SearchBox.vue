<template>
  <div
    class="mx-6 md:mx-16 bg-blue-50 text-gray-900 shadow-md rounded-lg p-6 md:p-8 -mt-4 relative z-10"
  >
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Pick a date -->
      <div class="flex flex-col">
        <label class="mb-1" for="date">Pick a date</label>
        <input
          id="date"
          type="date"
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <!-- Category -->
      <div class="flex flex-col">
        <label class="mb-1" for="category">Category</label>
        <select
          id="category"
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          <option>All</option>
          <option>Sports</option>
          <option>Events</option>
          <option>Meeting</option>
        </select>
      </div>

      <!-- Select Location -->
      <div class="flex flex-col">
        <label class="mb-1" for="location">Select Location</label>
        <select
          id="category"
          class="border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          <option>Maadi</option>
          <option>Giza</option>
          <option>Dokki</option>
          <option>6th October</option>
        </select>
      </div>

      <!-- Search Button -->
      <div class="flex items-end">
        <BaseButton
          class="bg-blue-600 text-white text-lg w-full px-6 py-3 hover:bg-blue-700"
        >
          Search
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    inputContainer() {
      return `grow-1 rounded-md bg-white flex justify-start align-center `;
    },
  },
};
</script>

<style lang="scss" scoped></style>
