<template>
  <!-- Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-auto"
    @click="$emit('close')"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col md:flex-row max-w-4xl w-full md:w-4/5 lg:w-3/4 max-h-[90vh] md:max-h-[80vh] relative my-4 shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700"
      @click.stop
      ref="formContainer"
    >
      <button
        type="button"
        @click="$emit('close')"
        class="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
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
          class="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
        >
          <!-- Map background with logo overlay -->
          <img
            src="../../assets/pictures/signup.png"
            alt="Map"
            class="w-full h-full object-cover opacity-50 dark:opacity-30"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-5xl font-bold text-blue-600 dark:text-blue-400">
              Reservio
            </h1>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto" ref="formSection">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Create Account
        </h2>

        <form @submit.prevent="register">
          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md"
            ref="errorMessage"
          >
            {{ errorMessage }}
          </div>
          <!-- Name -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300"
              >Name</label
            >
            <input
              type="text"
              v-model="name"
              placeholder="Enter your name"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300"
              >Email</label
            >
            <input
              type="email"
              v-model="email"
              placeholder="name@gmail.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <!-- Phone -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300"
              >Phone No</label
            >
            <input
              type="tel"
              v-model="phone"
              placeholder="With Country Code"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <!-- Username -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300"
              >Username</label
            >
            <input
              type="text"
              v-model="username"
              placeholder="Username"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300"
              >Password</label
            >
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="6+ characters"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
              >
                <i
                  :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
                ></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300"
              >Confirm Password</label
            >
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="6+ characters"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
              >
                <i
                  :class="
                    showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'
                  "
                ></i>
              </button>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <p>
              By signing up you agree to
              <a href="#" class="text-blue-600 dark:text-blue-400"
                >terms and conditions</a
              >
              at reservio.
            </p>
          </div>

          <!-- Register Button with Spinner -->
          <button
            type="submit"
            class="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 relative"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Register</span>
            <div v-else class="h-6 flex items-center justify-center">
              <BaseSpinner :show="true" />
            </div>
          </button>

          <!-- Google Sign Up Button -->
          <div class="mt-4">
            <button
              type="button"
              @click="signUpWithGoogle"
              class="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
              :disabled="isLoading"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          <!-- Sign In Link -->
          <div
            class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Already have an account?
            <button
              type="button"
              @click="$emit('switch-to-signin')"
              class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
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
import {
  db,
  ref,
  set,
  onValue,
  GoogleAuthProvider,
  signInWithPopup,
} from "../../firebase";

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
      errorMessage: "",
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
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

      // Regex patterns
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const mobileRegex = /^(010|011|012|015)\d{8}$/;

      // Validate passwords match
      if (this.password !== this.confirmPassword) {
        this.errorMessage =
          "Passwords do not match. Please check and try again.";
        this.$nextTick(() => this.scrollToTop());
        return;
      }

      // Validate password strength
      if (!passwordRegex.test(this.password)) {
        this.errorMessage =
          "Password must be at least 6 characters long and contain at least one letter and one number.";
        this.$nextTick(() => this.scrollToTop());
        return;
      }

      if (!emailRegex.test(this.email)) {
        this.errorMessage = "Please enter a valid email address.";
        this.$nextTick(() => this.scrollToTop());
        return;
      }

      if (!mobileRegex.test(this.phone)) {
        this.errorMessage =
          "Invalid phone number. Please enter a valid mobile.";
        this.$nextTick(() => this.scrollToTop());
        return;
      }

      try {
        this.isLoading = true;

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
          balance: 0,
          isAdmin: false,
          username: this.username,
          password: this.password,
          venues: {},
          reservations: {},
        };

        const reference = ref(db, "users/" + userProfile.id);
        set(reference, userProfile);

        store.dispatch("updateAuthState", userProfile);

        this.$emit("close");
        this.$router.push("/");
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            this.errorMessage =
              "This email is already registered. Please use a different email or sign in instead.";
            break;
          case "auth/invalid-email":
            this.errorMessage =
              "Invalid email format. Please enter a valid email address.";
            break;
          case "auth/weak-password":
            this.errorMessage =
              "Password is too weak. Please use at least 6 characters with a mix of letters, numbers, and symbols.";
            break;
          case "auth/operation-not-allowed":
            this.errorMessage =
              "Registration is currently disabled. Please contact support.";
            break;
          case "auth/network-request-failed":
            this.errorMessage =
              "Network error. Please check your internet connection and try again.";
            break;
          default:
            this.errorMessage =
              "Registration failed. Please check your information and try again.";
        }
        this.$nextTick(() => this.scrollToTop());
      } finally {
        this.isLoading = false;
      }
    },

    async signUpWithGoogle() {
      this.errorMessage = "";
      try {
        this.isLoading = true;

        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);

        const username = user.email.split("@")[0];

        const userProfile = {
          id: user.uid,
          name: user.displayName || username,
          email: user.email,
          phone: user.phoneNumber || "",
          balance: 0,
          isAdmin: false,
          username: username,
          venues: {},
          reservations: {},
        };

        // Save to database
        const reference = ref(db, "users/" + userProfile.id);
        set(reference, userProfile);

        // Update store with user info
        store.dispatch("updateAuthState", userProfile);

        // Close the form after successful registration
        this.$emit("close");
        this.$router.push("/");
      } catch (error) {
        console.error("Google sign up error:", error);

        switch (error.code) {
          case "auth/popup-closed-by-user":
            this.errorMessage =
              "Google sign up was cancelled. Please try again.";
            break;
          case "auth/popup-blocked":
            this.errorMessage =
              "Pop-up was blocked by your browser. Please allow pop-ups for this website and try again.";
            break;
          case "auth/account-exists-with-different-credential":
            this.errorMessage =
              "An account already exists with the same email but different credentials. Please sign in using your original method.";
            break;
          case "auth/network-request-failed":
            this.errorMessage =
              "Network error. Please check your internet connection and try again.";
            break;
          default:
            this.errorMessage =
              "Google sign up failed. Please try again or use email registration.";
        }
        this.$nextTick(() => this.scrollToTop());
      } finally {
        this.isLoading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
  },
  emits: ["close", "switch-to-signin"],
};
</script>
