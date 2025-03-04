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
    >
      <!-- Close Button -->
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
            src="../../assets/pictures/signin.png"
            alt="Sign In"
            class="w-full h-full object-cover opacity-50"
          />
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-5xl font-bold text-blue-600">Reservio</h1>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6">Sign In</h2>

        <form @submit.prevent="handleSubmit">
          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
          >
            {{ errorMessage }}
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

          <!-- Password -->
          <div class="mb-4">
            <label class="block mb-1">Password</label>
            <div class="relative">
              <input
                type="password"
                v-model="password"
                placeholder="Enter your password"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="mb-6 text-right">
            <a href="#" class="text-sm text-blue-600 hover:underline"
              >Forgot Password?</a
            >
          </div>

          <!-- Sign In Button with Spinner -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200 relative"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Sign In</span>
            <div v-else class="h-6 flex items-center justify-center">
              <BaseSpinner :show="true" />
            </div>
          </button>

          <!-- Sign Up Link -->
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <button
              type="button"
              @click="$emit('switch-to-signup')"
              class="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { loginUser } from "@/firebase";
import store from "@/store/store";
import BaseSpinner from "../base/BaseSpinner.vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db, onValue, ref, set } from "@/firebase";
import axios from "axios";

export default {
  name: "SigninForm",
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
      email: "",
      password: "",
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
  methods: {
    async handleSubmit() {
      // Reset error message
      this.errorMessage = "";

      try {
        this.isLoading = true;

        // Login user with Firebase
        const auth = getAuth();
        const { user } = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        // const allUsers = await axios.get(
        //   "https://reservio-77386-default-rtdb.europe-west1.firebasedatabase.app/users.json"
        // );
        let allUsers = null;
        const usersRef = ref(db, "users/");
        onValue(usersRef, (snapshot) => {
          allUsers = snapshot.val();
          for (const u in allUsers) {
            const currentUser = allUsers[u];
            if (currentUser.email === this.email) {
              store.dispatch("updateAuthState", currentUser);
              console.log(store.state.user);
              return;
            }
          }
        });

        // Close the form after successful sign in
        this.$emit("close");
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            this.errorMessage = "No account found with this email.";
            break;
          case "auth/wrong-password":
            this.errorMessage = "Incorrect password.";
            break;
          case "auth/invalid-email":
            this.errorMessage = "Invalid email address.";
            break;
          default:
            this.errorMessage =
              error.message || "Sign in failed. Please try again.";
        }

        return;
      } finally {
        this.isLoading = false;
      }
    },
  },
  emits: ["close", "switch-to-signup"],
};
</script>
