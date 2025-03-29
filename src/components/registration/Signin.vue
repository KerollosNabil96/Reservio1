<template>
  <!-- Overlay -->
  <div v-if="show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-auto"
    @click="$emit('close')">
    <!-- Form Container -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex flex-col md:flex-row max-w-4xl w-full md:w-4/5 lg:w-3/4 max-h-[90vh] md:max-h-[80vh] relative my-4 shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700"
      @click.stop>
      <!-- Close Button -->
      <button type="button" @click="$emit('close')"
        class="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Map/Image Section - Will appear above form on mobile -->
      <div class="md:w-1/2 h-48 md:h-auto relative">
        <div class="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <!-- Map background with logo overlay -->
          <img src="../../assets/pictures/signin.png" alt="Sign In"
            class="w-full h-full object-cover opacity-50 dark:opacity-30" />
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-5xl font-bold text-blue-600 dark:text-blue-400">
              Reservio
            </h1>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Sign In
        </h2>

        <form @submit.prevent="handleSubmit">
          <!-- Error Message -->
          <div v-if="errorMessage"
            class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
            {{ errorMessage }}
          </div>
          <!-- Email -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" v-model="email" placeholder="name@gmail.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              required />
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Enter your password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required />
              <button type="button" @click="togglePasswordVisibility"
                class="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="mb-6 text-right">
            <a href="#" @click.prevent="showForgotPasswordDialog = true"
              class="text-sm text-blue-600 dark:text-blue-400 hover:underline">Forgot Password?</a>
          </div>

          <!-- Forgot Password Dialog -->
          <div v-if="showForgotPasswordDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Reset Password</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Enter your email address to receive a password
                reset link.</p>
              <input type="email" v-model="resetEmail" placeholder="Enter your email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 mb-4" />
              <div class="flex justify-end space-x-2">
                <button @click="showForgotPasswordDialog = false"
                  class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-700">Cancel</button>
                <button @click="sendResetPasswordEmail"
                  class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  :disabled="isSendingResetEmail">
                  <span v-if="!isSendingResetEmail">Send</span>
                  <span v-else>Sending...</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Sign In Button with Spinner -->
          <button type="submit"
            class="w-full cursor-pointer bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 relative"
            :disabled="isLoading">
            <span v-if="!isLoading">Sign In</span>
            <div v-else class="h-6 flex items-center justify-center">
              <BaseSpinner :show="true" />
            </div>
          </button>

          <!-- Google Sign In Button -->
          <div class="mt-4">
            <button type="button" @click="signInWithGoogle"
              class="w-full cursor-pointer flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
              :disabled="isLoading">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <!-- Sign Up Link -->
          <div class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <button type="button" @click="$emit('switch-to-signup')"
              class="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import BaseSpinner from "../base/BaseSpinner.vue";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import {
  db,
  onValue,
  ref,
  set,
  GoogleAuthProvider,
  signInWithPopup,
} from "@/firebase";
import axios from "axios";
import { useToast } from "vue-toastification";

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
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      isLoading: false,
      showPassword: false,
      showForgotPasswordDialog: false,
      resetEmail: "",
      isSendingResetEmail: false,
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
      this.errorMessage = "";

      try {
        this.isLoading = true;

        const auth = getAuth();
        const { user } = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

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

        this.toast.success("Signed in successfully!");
        this.email = "";
        this.password = "";
        this.$emit("close");
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            this.toast.error("No account found with this email.");
            break;
          case "auth/wrong-password":
            this.toast.error("Incorrect password. Please try again.");
            break;
          case "auth/invalid-email":
            this.toast.error("Invalid email format.");
            break;
          case "auth/too-many-requests":
            this.toast.error("Too many failed login attempts. Please try again later.");
            break;
          case "auth/user-disabled":
            this.toast.error("This account has been disabled.");
            break;
          case "auth/network-request-failed":
            this.toast.error("Network error. Please check your connection.");
            break;
          default:
            this.toast.error("Sign in failed. Please try again.");
        }

        return;
      } finally {
        this.isLoading = false;
      }
    },

    async signInWithGoogle() {
      this.errorMessage = "";
      try {
        this.isLoading = true;

        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);

        const usersRef = ref(db, "users/");
        let userExists = false;
        let userProfile = null;

        onValue(usersRef, (snapshot) => {
          const allUsers = snapshot.val() || {};
          for (const u in allUsers) {
            const currentUser = allUsers[u];
            if (currentUser.email === user.email) {
              userExists = true;
              userProfile = currentUser;
              store.dispatch("updateAuthState", currentUser);
              return;
            }
          }
        });

        if (!userExists) {
          const username = user.email.split("@")[0];
          userProfile = {
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

          const reference = ref(db, "users/" + userProfile.id);
          set(reference, userProfile);

          store.dispatch("updateAuthState", userProfile);
        }

        this.$emit("close");
      } catch (error) {
        console.error("Google sign in error:", error);

        switch (error.code) {
          case "auth/popup-closed-by-user":
            this.toast.error("Google sign in was cancelled. Please try again.");
            break;
          case "auth/popup-blocked":
            this.toast.error("Pop-up was blocked by your browser. Please allow pop-ups for this website and try again.");
            break;
          case "auth/cancelled-popup-request":
            this.toast.error("Google sign in process was interrupted. Please try again.");
            break;
          case "auth/account-exists-with-different-credential":
            this.toast.error("An account already exists with the same email address but different sign-in credentials. Please sign in using the original method.");
            break;
          case "auth/network-request-failed":
            this.toast.error("Network error. Please check your internet connection and try again.");
            break;
          default:
            this.toast.error("Google sign in failed. Please try again or use email login.");
        }
      } finally {
        this.isLoading = false;
      }
    },

    async sendResetPasswordEmail() {
      if (!this.resetEmail) {
        this.toast.error("Please enter your email address.");
        return;
      }

      this.isSendingResetEmail = true;
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, this.resetEmail);
        this.toast.success("Password reset email sent. Please check your inbox.");
        this.showForgotPasswordDialog = false;
        this.resetEmail = "";
      } catch (error) {
        console.error("Error sending reset email:", error);
        this.toast.error("Failed to send reset email. Please try again.");
      } finally {
        this.isSendingResetEmail = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  emits: ["close", "switch-to-signup"],
};
</script>
