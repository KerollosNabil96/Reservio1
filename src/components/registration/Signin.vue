<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-md mx-auto py-12 px-4 sm:px-0">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
          Sign In
        </h2>
        <form @submit.prevent="handleLogin">
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

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Don't have an account?
            <router-link to="/signup" class="text-indigo-600 hover:underline">
              Sign up
            </router-link>
          </p>
        </div>

        <!-- Social Login -->
        <div class="flex justify-center mt-5">
          <button
            class="flex items-center justify-between gap-1 hover:cursor-pointer border rounded-md py-2 px-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
              class="w-5 h-5"
            >
              <path
                fill="#fbc02d"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#e53935"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4caf50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1565c0"
                d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      // Add login logic
    },
  },
};
</script>
