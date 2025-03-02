<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="space-y-8">
      <!-- General Questions Section -->
      <div>
        <h2 class="text-center text-blue-600 text-xl font-medium mb-4">
          General Questions
        </h2>
        <div class="space-y-2">
          <div
            v-for="(item, index) in generalQuestions"
            :key="index"
            class="bg-gray-100 rounded"
          >
            <button
              @click="toggleAccordion(index, 'general')"
              class="w-full px-4 py-3 flex justify-between items-center"
            >
              <span class="text-left">{{ item.question }}</span>
              <svg
                class="w-5 h-5"
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
              class="px-4 pb-3 text-gray-600"
            >
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Questions Section -->
      <div>
        <h2 class="text-center text-blue-600 text-xl font-medium mb-4">
          Booking Questions
        </h2>
        <div class="space-y-2">
          <div
            v-for="(item, index) in bookingQuestions"
            :key="index"
            class="bg-gray-100 rounded"
          >
            <button
              @click="toggleAccordion(index, 'booking')"
              class="w-full px-4 py-3 flex justify-between items-center"
            >
              <span class="text-left">{{ item.question }}</span>
              <svg
                class="w-5 h-5"
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
              class="px-4 pb-3 text-gray-600"
            >
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Support Questions Section -->
      <div>
        <h2 class="text-center text-blue-600 text-xl font-medium mb-4">
          Support Questions
        </h2>
        <div class="space-y-2">
          <div
            v-for="(item, index) in supportQuestions"
            :key="index"
            class="bg-gray-100 rounded"
          >
            <button
              @click="toggleAccordion(index, 'support')"
              class="w-full px-4 py-3 flex justify-between items-center"
            >
              <span class="text-left">{{ item.question }}</span>
              <svg
                class="w-5 h-5"
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
              class="px-4 pb-3 text-gray-600"
            >
              <p>{{ item.answer }}</p>
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
