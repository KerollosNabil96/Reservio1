<template>
  <div
    class="min-h-screen w-full bg-white text-gray-800 flex flex-col dark:bg-gray-800 dark:text-white"
  >
    <!-- Hero Section -->
    <TheHeader />

    <!-- Search Box -->
    <SearchBox />

    <!-- Available Reservations Section -->
    <section class="mt-12 px-6 md:px-16">
      <h2 class="text-2xl font-bold mb-6">Available Reservations</h2>

      <!-- Custom ReservationCardList Component -->
      <!-- Pass your reservation data via props -->
      <ReservationCardList />
    </section>

    <!-- Footer -->
    <footer
      class="bg-gray-50 mt-12 py-8 px-6 md:px-16"
      :class="{ 'dark:bg-gray-900 dark:text-gray-100': dark }"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left: Brand & Slogan -->
        <div>
          <h3 class="text-xl font-bold mb-2">Reservio</h3>
          <p class="text-gray-700">
            Connecting people with great spaces. <br />
            Book. Host. Enjoy.
          </p>
        </div>

        <!-- Middle: Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-2">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-600">About Us</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-600">FAQs</a>
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-600"
                >Privacy Policy</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-600 hover:text-blue-600"
                >Contact Us</a
              >
            </li>
          </ul>
        </div>

        <!-- Right: Contact Form -->
        <div>
          <h4 class="text-lg font-semibold mb-2">Contact Us</h4>
          <form
            @submit.prevent="sendMessage"
            class="space-y-4"
            id="contact-form"
          >
            <div>
              <input
                type="text"
                placeholder="Your Name"
                class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <textarea
                rows="3"
                placeholder="Your Message"
                class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import SearchBox from "@/components/homepage/SearchBox.vue";
import TheHeader from "@/components/homepage/TheHeader.vue";
import ReservationCardList from "@/components/reservations/ReservationCardList.vue";
import store from "@/store/store";

export default {
  name: "Home",
  components: {
    ReservationCardList,
    TheHeader,
    SearchBox,
  },
  data() {
    return {
      date: null,
      category: null,
      location: null,
    };
  },
  methods: {
    sendMessage() {
      alert("Message sent!");
    },
    searchReservations() {
      const obj = {
        date: this.date,
        category: this.category,
        location: this.location,
      };
      console.log(obj);
    },
  },
  computed: {
    dark() {
      return store.state.isDarkMode;
    },
  },
  mounted() {
    console.log(store.state.isDarkMode);
  },
};
</script>
