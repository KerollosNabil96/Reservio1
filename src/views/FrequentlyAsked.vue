<template>
  <div
    class="faq-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative"
  >
    <!-- Floating Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="floating-circle bg-blue-200/20 dark:bg-blue-500/10 w-64 h-64 rounded-full absolute -top-20 -left-20 animate-float-slow"
      ></div>
      <div
        class="floating-circle bg-indigo-200/20 dark:bg-indigo-500/10 w-96 h-96 rounded-full absolute -bottom-32 -right-32 animate-float-medium"
      ></div>
    </div>

    <div class="container mx-auto px-4 py-12 max-w-4xl relative z-10">
      <!-- Header Section -->
      <div class="text-center mb-12 animate-fade-in">
        <h1
          class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Frequently Asked Questions
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Find answers to common questions about Reservio
        </p>
      </div>

      <div class="space-y-8">
        <!-- General Questions Section -->
        <div class="animate-slide-up">
          <h2
            class="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6 flex items-center"
          >
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            General Questions
          </h2>
          <div class="space-y-4">
            <div
              v-for="(item, index) in generalQuestions"
              :key="index"
              class="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                @click="toggleAccordion(index, 'general')"
                class="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
              >
                <span class="text-gray-800 dark:text-white font-medium">{{
                  item.question
                }}</span>
                <svg
                  class="w-5 h-5 text-blue-500 transform transition-transform duration-300"
                  :class="{
                    'rotate-180':
                      activeSection === 'general' && activeIndex === index,
                  }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-show="activeSection === 'general' && activeIndex === index"
                class="px-6 pb-4 text-gray-600 dark:text-gray-300 animate-fade-in"
              >
                <p class="leading-relaxed">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Questions Section -->
        <div class="animate-slide-up" style="animation-delay: 100ms">
          <h2
            class="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6 flex items-center"
          >
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
              />
            </svg>
            Booking Questions
          </h2>
          <div class="space-y-4">
            <div
              v-for="(item, index) in bookingQuestions"
              :key="index"
              class="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                @click="toggleAccordion(index, 'booking')"
                class="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
              >
                <span class="text-gray-800 dark:text-white font-medium">{{
                  item.question
                }}</span>
                <svg
                  class="w-5 h-5 text-blue-500 transform transition-transform duration-300"
                  :class="{
                    'rotate-180':
                      activeSection === 'booking' && activeIndex === index,
                  }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-show="activeSection === 'booking' && activeIndex === index"
                class="px-6 pb-4 text-gray-600 dark:text-gray-300 animate-fade-in"
              >
                <p class="leading-relaxed">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Questions Section -->
        <div class="animate-slide-up" style="animation-delay: 200ms">
          <h2
            class="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6 flex items-center"
          >
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Support Questions
          </h2>
          <div class="space-y-4">
            <div
              v-for="(item, index) in supportQuestions"
              :key="index"
              class="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                @click="toggleAccordion(index, 'support')"
                class="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
              >
                <span class="text-gray-800 dark:text-white font-medium">{{
                  item.question
                }}</span>
                <svg
                  class="w-5 h-5 text-blue-500 transform transition-transform duration-300"
                  :class="{
                    'rotate-180':
                      activeSection === 'support' && activeIndex === index,
                  }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-show="activeSection === 'support' && activeIndex === index"
                class="px-6 pb-4 text-gray-600 dark:text-gray-300 animate-fade-in"
              >
                <p class="leading-relaxed">{{ item.answer }}</p>
              </div>
            </div>
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
      activeIndex: null,
      activeSection: null,
      generalQuestions: [
        {
          question: "What is Reservio?",
          answer: `Reservio is a platform that simplifies the reservation process for businesses 
and customers, offering seamless booking experiences for restaurants, hotels,
events, and more.`,
        },
        {
          question: "Is Reservio free to use?",
          answer:
            "Reservio offers both free and premium plans. The free plan includes basic features, while the premium plan provides additional functionality.",
        },
      ],
      bookingQuestions: [
        {
          question: "How can I make a reservation?",
          answer:
            "To make a reservation, search for the desired service, select a date and time, and provide your details. You will receive a confirmation once the booking is complete.",
        },
        {
          question: "What payment methods are accepted?",
          answer:
            "Reservio accepts major credit cards, debit cards, and PayPal. Some service providers may offer additional payment options.",
        },
      ],
      supportQuestions: [
        {
          question: "How can I contact customer support?",
          answer:
            'You can contact our customer support team via email at support@reservio.com or through the "Contact Us" page on our website.',
        },
        {
          question: "Where can I find my booking history?",
          answer:
            'Your booking history is available in the "My Reservations" section of your account dashboard.',
        },
        {
          question: "What if I encounter an issue during booking?",
          answer:
            "If you encounter any issues during the booking process, please contact our support team immediately for assistance.",
        },
      ],
    };
  },
  methods: {
    toggleAccordion(index, section) {
      if (this.activeIndex === index && this.activeSection === section) {
        this.activeIndex = null;
        this.activeSection = null;
      } else {
        this.activeIndex = index;
        this.activeSection = section;
      }
    },
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}

.animate-float-slow {
  animation: float 6s ease-in-out infinite;
}

.animate-float-medium {
  animation: float 8s ease-in-out infinite;
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
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
