<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6 relative"
  >
    <!-- Background pattern for dark mode -->
    <div
      class="absolute inset-0 overflow-hidden pointer-events-none dark:opacity-10 opacity-0"
    >
      <div
        class="absolute -top-24 -left-24 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slow"
      ></div>
      <div
        class="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slower"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-float"
      ></div>
    </div>

    <div class="max-w-2xl mx-auto relative z-10">
      <div
        class="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8"
      >
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
          Register Your
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            {{ category }}
          </span>
        </h2>
        <component :is="component" :required-licenses="requiredLicenses" />

        <!-- Back Button -->
        <div class="mt-6 flex justify-start">
          <button
            @click="goBack"
            class="px-6 py-3 text-sm sm:text-base border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300 rounded-lg font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Venue Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AfterRegFormEducational from "@/components/AfterRegForm/AfterRegFormEducational.vue";
import AfterRegFormMedical from "@/components/AfterRegForm/AfterRegFormMedical.vue";
import AfterRegFormSports from "@/components/AfterRegForm/AfterRegFormSports.vue";
import store from "@/store/store";

export default {
  component: {
    AfterRegFormEducational,
    AfterRegFormMedical,
    AfterRegFormSports,
  },
  computed: {
    category() {
      const category = this.$route.query.category || "No category selected";
      console.log("Category:", category);
      return category;
    },
    requiredLicenses() {
      const licenseMap = {
        Medical: ["Medical License", "Clinic License"],
        Stadium: ["Stadium License"],
        Educational: ["Educational Center License"],
      };
      return licenseMap[store.state.myFormData.category] || [];
    },

    component() {
      switch (this.category) {
        case "Medical":
          return AfterRegFormMedical;
        case "Stadium":
          return AfterRegFormSports;
        case "Educational":
          return AfterRegFormEducational;
        default:
          return;
      }
    },
  },
  methods: {
    goBack() {
      this.$router.push("/register-venue");
    },
  },
};
</script>

<style scoped>
button:hover {
  opacity: 0.9;
}

input[type="time"],
input[type="date"] {
  color-scheme: dark;
}

/* Animation keyframes */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes pulse-slower {
  0%,
  100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.15;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}
</style>
