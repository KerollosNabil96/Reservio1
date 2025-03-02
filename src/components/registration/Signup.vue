<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sign Up Form -->
    <div class="max-w-md mx-auto py-12 px-4 sm:px-0">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
          Create Account
        </h2>
        <form @submit.prevent="handleSignup">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Username</label
              >
              <input
                v-model="username"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
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
              Create Account
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Already have an account?
            <router-link to="/signin" class="text-indigo-600 hover:underline">
              Sign in
            </router-link>
          </p>
        </div>

        <!-- Social Signup -->
        <div class="mt-8 border-t pt-6">
          <p class="text-sm text-gray-600 text-center mb-4">Or sign up with</p>
          <div class="mt-8 border-t pt-6">
            <button
              @click="signInWithGoogle"
              class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="w-5 h-5"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g transform="translate(3.964 3.893) scale(.57143)">
                  <path
                    d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28a5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934a8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934c0-.528-.081-1.097-.202-1.625z"
                    fill="#4285f4"
                  ></path>
                  <path
                    d="M3.737 16.985A8.904 8.904 0 0 0 13.956 21.9c4.467 0 8.529-3.249 8.529-8.934c0-.528-.081-1.097-.202-1.625H11.957v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453c-2.882 0-5.25-2.245-5.25-5.282c0-3.026 2.369-5.28 5.25-5.28c1.26 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.904 8.904 0 0 0-8.934 8.934a8.906 8.906 0 0 0 1.362 4.673l-.001-.002z"
                    fill="#34a853"
                  ></path>
                  <path
                    d="M11.957 6.018c1.26 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.904 8.904 0 0 0-8.934 8.934a8.906 8.906 0 0 0 1.362 4.673l2.876-2.287a5.278 5.278 0 0 1-1.362-3.386c0-2.037 1.368-5.282 5.25-5.282z"
                    fill="#fbbc05"
                  ></path>
                  <path
                    d="M20.283 10.356c.121.528.202 1.097.202 1.625c0 5.685-4.062 8.934-8.529 8.934a8.907 8.907 0 0 1-5.89-2.233l2.876-2.287a5.283 5.283 0 0 0 3.014 1.012c2.479 0 4.346-1.26 4.792-3.453h-4.792v-3.451h8.327l-.002.002z"
                    fill="#ea4335"
                  ></path>
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    handleSignup() {
      // Add signup logic
    },
  },
};
</script>
