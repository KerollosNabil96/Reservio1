<template>
  <!-- Container: 2-column layout on md+, stacked on mobile -->
  <div class="flex flex-col-reverse md:flex-row min-h-screen">
    <!-- Right Side: Sign Up Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
      <div class="max-w-md w-full">
        <!-- Form Header -->
        <h2 class="text-2xl md:text-3xl font-bold mb-6">Create Account</h2>

        <!-- Sign Up Form -->
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>

        <!-- Login Link -->
        <p class="mt-4 text-sm text-center">
          Already have an account?
          <a href="#" class="text-blue-600">Login</a>
        </p>
      </div>
    </div>

    <!-- Left Side: Image (below on mobile) -->
    <div
      class="w-full md:w-1/2 relative order-last md:order-first h-64 md:h-auto flex items-center justify-center p-4"
    >
      <!-- External Image -->
      <img
        src="../../assets/pictures/signin.png"
        alt="Placeholder"
        class="w-full h-full object-cover rounded-md"
      />

      <div
        class="absolute inset-0 m-4 rounded-md flex items-center justify-center bg-white/50 w-2/3 h-2/3 left-14 top-7 md:left-28 md:top-28"
      >
        <h1 class="text-3xl md:text-4xl font-bold text-blue-600">Reservio</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignUp",
  methods: {
    handleSubmit() {
      alert("Sign Up form submitted!");
    },
  },
};
</script>
