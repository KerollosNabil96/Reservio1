<template>
  <header
    class="flex flex-col-reverse md:flex-row items-center py-8 px-6 md:px-16"
  >
    <!-- Text Section -->
    <div class="w-full md:w-1/2 md:pr-8">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        Reserve Spaces or Share Your Venue
      </h1>
      <p class="text-gray-600 mb-6" :class="{ 'dark:text-gray-100': dark }">
        Book unique spaces or manage your own reservations
      </p>
      <button
        class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-50"
      >
        Share Your Venue
      </button>
    </div>

    <!-- Illustration/Image -->
    <div class="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
      <!-- Replace with your illustration or hero image -->
      <img
        src="../../assets/pictures/hero illustration.svg"
        alt="Hero Illustration"
        class="w-full max-w-sm"
      />
    </div>
  </header>
</template>

<script>
export default {};
</script>
