<template>
  <footer class="bg-gray-50 mt-12 dark:bg-gray-900 dark:text-gray-100">
    <!-- Main Footer Content -->
    <div class="py-8 md:px-16 w-11/12 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left: Brand & Slogan -->
        <div class="flex flex-col gap-5">
          <h3 class="text-xl font-bold mb-2 text-blue-600">Reservio</h3>
          <p class="text-gray-700 dark:text-gray-300">
            Connecting people with great spaces. <br />
            Book. Host. Enjoy.
          </p>
          <div class="flex flex-row gap-3">
            <a href=""
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                viewBox="0 0 50 50"
              >
                <path
                  d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"
                ></path></svg
            ></a>
            <a href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                viewBox="0 0 30 30"
              >
                <path
                  d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
                ></path>
              </svg>
            </a>

            <a href="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                viewBox="0 0 48 48"
              >
                <path
                  d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"
                ></path>
              </svg>
            </a>
          </div>
        </div>

        <!-- Middle: Quick Links -->
        <div>
          <h4 class="text-lg font-semibold mb-2">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 dark:text-gray-300"
                >About Us</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 dark:text-gray-300"
                >FAQs</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 dark:text-gray-300"
                >Privacy Policy</a
              >
            </li>
            <li>
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 dark:text-gray-300"
                >Contact Us</a
              >
            </li>
          </ul>
        </div>

        <!-- Right: Contact Form -->
        <div>
          <h4 class="text-lg font-semibold mb-2">Contact Us</h4>
          <form class="space-y-4" id="contact-form">
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
            <BaseButton
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-colors"
            >
              Send Message
            </BaseButton>
          </form>
        </div>
      </div>
    </div>

    <!-- Full-Width Copyright Bar -->
    <div class="bg-blue-600 text-white dark:bg-gray-800">
      <div class="w-11/12 mx-auto py-2 text-center">
        <p class="text-sm">© 2025 Reservio. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import store from "@/store/store";

export default {
  name: "FooterComponent",
  computed: {
    dark() {
      return store.state.isDarkMode;
    },
  },
};
</script>
