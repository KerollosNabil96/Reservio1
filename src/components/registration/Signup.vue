<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-auto"
    @click="$emit('close')"
  >
    <!-- Form Container -->
    <div
      class="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row max-w-4xl w-full md:w-4/5 lg:w-3/4 max-h-[90vh] md:max-h-[80vh] relative my-4"
      @click.stop
      ref="formContainer"
    >
      <!-- Close Button - Moved to top right of form container -->
      <button
        type="button"
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Map/Image Section - Will appear above form on mobile -->
      <div class="md:w-1/2 h-48 md:h-auto relative">
        <div
          class="absolute inset-0 bg-gray-100 flex items-center justify-center"
        >
          <!-- Map background with logo overlay -->
          <img
            src="../../assets/pictures/signup.png"
            alt="Map"
            class="w-full h-full object-cover opacity-50"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-5xl font-bold text-blue-600">Reservio</h1>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto" ref="formSection">
        <h2 class="text-2xl font-bold mb-6">Create Account</h2>

        <form @submit.prevent="register">
          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
            ref="errorMessage"
          >
            {{ errorMessage }}
          </div>
          <!-- Name -->
          <div class="mb-4">
            <label class="block mb-1">Name</label>
            <input
              type="text"
              v-model="name"
              placeholder="Enter your name"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block mb-1">E mail</label>
            <input
              type="email"
              v-model="email"
              placeholder="name@gmail.com"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Phone -->
          <div class="mb-4">
            <label class="block mb-1">Phone No</label>
            <input
              type="tel"
              v-model="phone"
              placeholder="With Country Code"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Username -->
          <div class="mb-4">
            <label class="block mb-1">Username</label>
            <input
              type="text"
              v-model="username"
              placeholder="Username"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="block mb-1">Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="6+ characters"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="showPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label class="block mb-1">Confirm Password</label>
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="6+ characters"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    v-if="showConfirmPassword"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="mb-6 text-sm">
            <p>
              By signing up you agree to
              <a href="#" class="text-blue-600">terms and conditions</a> at
              reservio.
            </p>
          </div>

          <!-- Register Button with Spinner -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 relative"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Register</span>
            <div v-else class="h-6 flex items-center justify-center">
              <BaseSpinner :show="true" />
            </div>
          </button>

          <!-- Sign In Link -->
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <button
              type="button"
              @click="$emit('switch-to-signin')"
              class="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { registerUser } from "@/firebase";
import store from "@/store/store";
import BaseSpinner from "../base/BaseSpinner.vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { db, ref, set, onValue } from "../../firebase";

export default {
  name: "SignupForm",
  components: {
    BaseSpinner,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      errorMessage: "",
      isLoading: false,
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
  },
  beforeUnmount() {
    // Ensure scroll is restored when component is destroyed
    document.body.style.overflow = "";
  },
  methods: {
    scrollToTop() {
      // Scroll the form section to the top to show the error message
      if (this.$refs.formSection) {
        this.$refs.formSection.scrollTop = 0;
      }
    },
    async register() {
      // Reset error message
      this.errorMessage = "";

      // Validate passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match";
        this.$nextTick(() => this.scrollToTop());
        return;
      }

      try {
        this.isLoading = true;

        // Register user with Firebase
        const auth = getAuth();
        const { user } = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        const userProfile = {
          id: user.uid,
          name: this.name,
          email: this.email,
          phone: this.phone,
          isAdmin: false,
          username: this.username,
          password: this.password,
          venues: {},
          reservations: {},
        };
        // axios.post(
        //   "https://reservio-77386-default-rtdb.europe-west1.firebasedatabase.app/users.json",
        //   userProfile
        // );
        const reference = ref(db, "users/" + this.username);
        set(reference, userProfile);

        // Update store with user info
        store.dispatch("updateAuthState", userProfile);

        // Create user profile object (could be stored in Firestore in a future update)

        // Close the form after successful registration
        this.$emit("close");
        this.$router.push("/");
      } catch (error) {
        // Handle specific Firebase errors
        switch (error.code) {
          case "auth/email-already-in-use":
            this.errorMessage = "This email is already registered.";
            break;
          case "auth/invalid-email":
            this.errorMessage = "Invalid email address.";
            break;
          case "auth/weak-password":
            this.errorMessage =
              "Password is too weak. Use at least 6 characters.";
            break;
          default:
            this.errorMessage =
              error.message || "Registration failed. Please try again.";
        }
        this.$nextTick(() => this.scrollToTop());
      } finally {
        this.isLoading = false;
      }
    },
  },
  emits: ["close", "switch-to-signin"],
};
</script>
