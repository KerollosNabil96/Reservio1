<template>
  <header
    class="relative overflow-hidden py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-16 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl mb-6 sm:mb-8"
  >
    <!-- Background Elements (Decorative) -->
    <div
      class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 dark:opacity-20"
    >
      <div
        class="absolute -top-24 -left-24 w-64 h-64 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl animate-pulse-slow"
      ></div>
      <div
        class="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-3xl animate-pulse-slower"
      ></div>
    </div>

    <div
      class="flex flex-col-reverse md:flex-row items-center md:justify-between relative z-10 gap-6 md:gap-8"
    >
      <!-- Text Section -->
      <div
        class="w-full md:w-5/12 md:pr-8 flex flex-col gap-4 sm:gap-5 animate-fade-in-up text-center md:text-start"
      >
        <h1
          class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-gray-900 dark:text-white leading-tight"
        >
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >Reserve Spaces</span
          >
          or Share Your Venue
        </h1>
        <p
          class="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 dark:text-gray-300"
        >
          Find the perfect space for your next event or share your venue with
          others looking for unique locations.
        </p>

        <div
          class="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2 sm:mt-4 justify-center md:justify-start"
        >
          <RouterLink to="/register-venue" class="w-full sm:w-auto">
            <BaseButton
              class="text-white px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg rounded-lg font-medium"
              >Share Your Venue</BaseButton
            >
          </RouterLink>
          <RouterLink to="/book-now" class="w-full sm:w-auto">
            <BaseButton
              class="px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base w-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 rounded-lg font-medium"
              >Browse Venues</BaseButton
            >
          </RouterLink>
        </div>
      </div>

      <!-- Illustration/Image -->
      <div
        class="flex justify-center grow-1 sm:justify-end mb-4 sm:mb-6 md:mb-0 animate-fade-in w-full md:w-auto"
      >
        <div class="relative">
          <img
            src="../../assets/pictures/hero illustration.svg"
            alt="Hero Illustration"
            class="relative w-full max-w-xs sm:max-w-sm md:max-w-md animate-float transform hover:scale-105 transition-all duration-500 hover:rotate-2"
          />
          <!-- Decorative elements around the illustration -->
          <div
            class="absolute -top-4 -right-4 w-12 h-12 bg-blue-400 dark:bg-blue-600 rounded-full blur-xl opacity-20 animate-pulse-slow"
          ></div>
          <div
            class="absolute -bottom-4 -left-4 w-10 h-10 bg-indigo-400 dark:bg-indigo-600 rounded-full blur-xl opacity-20 animate-pulse-slower"
          ></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {};
</script>
