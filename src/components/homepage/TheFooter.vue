<template>
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
            <a href="#" class="text-gray-600 hover:text-blue-600">Contact Us</a>
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
  </footer>
</template>

<script>
import BaseButton from "../base/BaseButton.vue";

export default {};
</script>
