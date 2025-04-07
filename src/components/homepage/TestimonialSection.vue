<template>
  <section
    class="py-12 px-6 md:px-16 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-90 rounded-xl my-12"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12 animate-fade-in-up">
        <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
        >
          {{ $t("testimonials.title") }}
        </span>
      </h2>

      <div class="relative">
        <!-- Testimonial Carousel -->
        <div class="overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(${transformValue})` }"
          >
            <div
              v-for="(testimonial, index) in testimonials"
              :key="index"
              class="w-full flex-shrink-0 px-4"
              style="min-width: 100%"
            >
              <div
                class="bg-white dark:bg-gray-800 dark:bg-opacity-80 rounded-xl shadow-lg p-8 relative animate-fade-in"
              >
                <!-- Quote Icon -->
                <div
                  class="absolute top-0 left-0 bg-blue-100 dark:bg-blue-800 rounded-full p-4 shadow-md"
                >
                  <svg
                    class="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                    />
                  </svg>
                </div>

                <div class="flex flex-col items-center text-center">
                  <p
                    class="text-gray-600 dark:text-gray-300 italic mb-6 mt-8 md:mt-6"
                  >
                    {{ $t(`testimonials.items.${index}.quote`) }}
                  </p>

                  <div class="flex items-center mt-4">
                    <div
                      class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 mr-4 flex items-center justify-center bg-blue-500 text-white font-bold text-lg"
                      :class="[$i18n.locale === 'ar' ? 'ml-4' : 'mr-4']"
                    >
                      {{ getInitials($t(`testimonials.items.${index}.name`)) }}
                    </div>
                    <div class="text-left">
                      <h4 class="font-bold text-gray-900 dark:text-white">
                        {{ $t(`testimonials.items.${index}.name`) }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ $t(`testimonials.items.${index}.role`) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <button
          @click="prevSlide"
          class="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
        >
          <svg
            class="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          @click="nextSlide"
          class="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
        >
          <svg
            class="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <!-- Dots Indicator -->
      <div class="flex justify-center mt-8 space-x-2">
        <button
          v-for="(_, index) in testimonials"
          :key="index"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="
            currentIndex === index
              ? 'bg-blue-600 dark:bg-blue-400 scale-125'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500'
          "
        ></button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      testimonials: [
        {
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
      ],
      autoplayInterval: null,
    };
  },
  computed: {
    transformValue() {
      const direction = this.$i18n.locale === "ar" ? 1 : -1;
      return `${direction * this.currentIndex * 100}%`;
    },
  },
  methods: {
    nextSlide() {
      if (this.currentIndex < this.testimonials.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Loop back to the first slide
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.testimonials.length - 1; // Loop to the last slide
      }
    },
    goToSlide(index) {
      this.currentIndex = index;
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        if (this.currentIndex < this.testimonials.length - 1) {
          this.currentIndex++;
        } else {
          this.currentIndex = 0;
        }
      }, 5000); // Change slide every 5 seconds
    },
    stopAutoplay() {
      clearInterval(this.autoplayInterval);
    },
    getInitials(name) {
      if (!name) return "";
      const parts = name.split(" ");
      const initials = parts
        .map((part) => part[0])
        .slice(0, 2)
        .join("");
      return initials.toUpperCase();
    },
  },
  mounted() {
    this.startAutoplay();
  },
  beforeUnmount() {
    this.stopAutoplay();
  },
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
