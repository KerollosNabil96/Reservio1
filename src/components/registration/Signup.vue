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
          <!-- Name -->
          <div>
            <label class="block text-gray-700 mb-1" for="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-gray-700 mb-1" for="email">E mail</label>
            <input
              type="email"
              id="email"
              placeholder="name@gmail.com"
              class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-gray-700 mb-1" for="phone">Phone No</label>
            <input
              type="tel"
              id="phone"
              placeholder="With Country Code"
              class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-gray-700 mb-1" for="username"
              >Username</label
            >
            <input
              type="text"
              id="username"
              placeholder="Username"
              class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-gray-700 mb-1" for="password"
              >Password</label
            >
            <input
              type="password"
              id="password"
              placeholder="6+ characters"
              class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-gray-700 mb-1" for="confirm-password"
              >Confirm Password</label
            >
            <input
              type="password"
              id="confirm-password"
              placeholder="6+ characters"
              class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <!-- Terms & Register Button -->
          <div>
            <p class="text-sm text-gray-600">
              By signing up you agree to
              <a href="#" class="text-blue-600">terms and conditions</a>
              at reservio.
            </p>
          </div>
          <button
            type="submit"
            class="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
        </form>

        <!-- Login Link -->
        <p class="mt-4 text-sm text-center">
          Already have an account?
          <RouterLink to="/signin" class="text-blue-600">Login</RouterLink>
        </p>
      </div>
    </div>

    <!-- Left Side: Image (below on mobile) -->
    <div
      class="w-full md:w-1/2 relative order-last md:order-first h-64 md:h-auto flex items-center justify-center p-4"
    >
      <!-- External Image -->
      <img
        src="../../assets/pictures/signup.png"
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
