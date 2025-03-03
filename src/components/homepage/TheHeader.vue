<template>
  <header
    class="flex flex-col-reverse md:flex-row items-end md:justify-between py-8 px-6 md:px-16"
  >
    <!-- Text Section -->
    <div class="w-full md:w-5/12 md:pr-8 flex flex-col gap-5">
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        Reserve Spaces or Share Your Venue
      </h1>
      <p class="text-gray-600 mb-6 dark:text-gray-100">
        Book unique spaces or manage your own venues
      </p>

      <RouterLink to="/register-venue">
        <BaseButton
          class="text-white px-6 py-3 text-2xl w-full bg-blue-600 hover:bg-blue-700"
          >Share Your Venue</BaseButton
        >
      </RouterLink>
    </div>

    <!-- Illustration/Image -->
    <div class="flex justify-center grow-1 sm:justify-end mb-6 md:mb-0">
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
