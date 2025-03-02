<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto"
    @click="$emit('close')"
  >
    <!-- Form Container -->
    <div
      class="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row max-w-4xl w-full md:w-4/5 lg:w-3/4 max-h-[90vh] md:max-h-[80vh] relative my-4"
      @click.stop
    >
      <!-- Close Button - Moved to top right of form container -->
      <button
        type="button"
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Map/Image Section - Will appear above form on mobile -->
      <div class="md:w-1/2 h-48 md:h-auto relative">
        <div
          class="absolute inset-0 bg-gray-100 flex items-center justify-center"
        >
          <!-- Map background with logo overlay -->
          <img
            src="../../assets/pictures/signup.png"
            alt="Map"
            class="w-full h-full object-cover opacity-50"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-5xl font-bold text-blue-600">Reservio</h1>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6">Create Account</h2>

        <form @submit.prevent="register">
          <!-- Name -->
          <div class="mb-4">
            <label class="block mb-1">Name</label>
            <input
              type="text"
              v-model="name"
              placeholder="Enter your name"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block mb-1">E mail</label>
            <input
              type="email"
              v-model="email"
              placeholder="name@gmail.com"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Phone -->
          <div class="mb-4">
            <label class="block mb-1">Phone No</label>
            <input
              type="tel"
              v-model="phone"
              placeholder="With Country Code"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Username -->
          <div class="mb-4">
            <label class="block mb-1">Username</label>
            <input
              type="text"
              v-model="username"
              placeholder="Username"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="block mb-1">Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="6+ characters"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label class="block mb-1">Confirm Password</label>
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="6+ characters"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="showConfirmPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="mb-6 text-sm">
            <p>
              By signing up you agree to
              <a href="#" class="text-blue-600">terms and conditions</a> at
              reservio.
            </p>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupForm",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  beforeUnmount() {
    // Ensure scroll is restored when component is destroyed
    document.body.style.overflow = '';
  },
  methods: {
    register() {
      // Validate passwords match
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // Create user object
      const user = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        username: this.username,
        password: this.password,
      };

      console.log("Registering user:", user);
      // Here you would typically make an API call to register the user

      // Close the form after successful registration
      this.$emit("close");
    },
  },
  emits: ["close", "switch-to-login"],
};
</script>
