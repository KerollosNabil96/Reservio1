<template>
  <div
    class="contact-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12"
  >
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header Section -->
      <div class="text-center mb-12 animate-fadeIn">
        <h1
          class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Contact Us
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          We'd love to hear from you. Send us a message and we'll respond as
          soon as possible.
        </p>
      </div>

      <!-- Contact Form -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-slideUp"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name Input -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Full Name</label
            >
            <input
              type="text"
              id="name"
              v-model="formData.name"
              :class="{ 'border-red-500': errors.name }"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              placeholder="Enter your full name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <!-- Email Input -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Email Address</label
            >
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :class="{ 'border-red-500': errors.email }"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              placeholder="Enter your email address"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Phone Input -->
          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Phone Number</label
            >
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              :class="{ 'border-red-500': errors.phone }"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              placeholder="Enter your phone number"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
              {{ errors.phone }}
            </p>
          </div>

          <!-- Message Input -->
          <div>
            <label
              for="message"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Message</label
            >
            <textarea
              id="message"
              v-model="formData.message"
              :class="{ 'border-red-500': errors.message }"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-300"
              rows="6"
              placeholder="Enter your message"
            ></textarea>
            <p v-if="errors.message" class="mt-1 text-sm text-red-500">
              {{ errors.message }}
            </p>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              <span>Send Message</span>
              <svg
                v-if="isSubmitting"
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div
          v-if="showSuccess"
          class="fixed inset-0 flex items-center justify-center px-4 z-50"
        >
          <div class="absolute inset-0 bg-black opacity-50"></div>
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative z-10 animate-fadeIn"
          >
            <div class="text-center">
              <div
                class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900"
              >
                <svg
                  class="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3
                class="mt-4 text-lg font-medium text-gray-900 dark:text-white"
              >
                Message Sent Successfully!
              </h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Thank you for contacting us. We'll get back to you soon.
              </p>
              <button
                @click="showSuccess = false"
                class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      formData: {
        name: "",
        email: "",
        phone: "",
        message: "",
      },
      errors: {},
      isSubmitting: false,
      showSuccess: false,
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.formData.name.trim()) {
        this.errors.name = "Name is required";
        isValid = false;
      }

      if (!this.formData.email.trim()) {
        this.errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
        this.errors.email = "Please enter a valid email address";
        isValid = false;
      }

      if (!this.formData.phone.trim()) {
        this.errors.phone = "Phone number is required";
        isValid = false;
      } else if (
        !/^\+?[1-9]\d{1,14}$/.test(this.formData.phone.replace(/[\s-]/g, ""))
      ) {
        this.errors.phone = "Please enter a valid phone number";
        isValid = false;
      }

      if (!this.formData.message.trim()) {
        this.errors.message = "Message is required";
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      try {
        // Here you would typically make an API call to send the message
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated API call
        this.showSuccess = true;
        this.resetForm();
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error appropriately
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        phone: "",
        message: "",
      };
      this.errors = {};
    },
  },
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 1s ease-in;
}

.animate-slideUp {
  animation: slideUp 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
