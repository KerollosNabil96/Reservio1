<template>
    <div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Reset Password</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">Enter your new password below.</p>
            <form @submit.prevent="resetPassword">
                <div class="mb-4">
                    <label class="block mb-1 text-gray-700 dark:text-gray-300">New Password</label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" v-model="newPassword"
                            placeholder="Enter new password"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            required />
                        <button type="button" @click="togglePasswordVisibility"
                            class="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </button>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block mb-1 text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <div class="relative">
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                            placeholder="Confirm new password"
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            required />
                        <button type="button" @click="toggleConfirmPasswordVisibility"
                            class="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </button>
                    </div>
                </div>
                <button type="submit"
                    class="cursor-pointer w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    :disabled="isResetting">
                    <span v-if="!isResetting">Reset Password</span>
                    <span v-else>Resetting...</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const toast = useToast();
        const oobCode = route.query.oobCode;

        return {
            oobCode,
            router,
            toast,
        };
    },
    data() {
        return {
            newPassword: "",
            confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
            isResetting: false,
        };
    },
    methods: {
        async resetPassword() {
            if (this.newPassword !== this.confirmPassword) {
                this.toast.error("Passwords do not match.");
                return;
            }

            this.isResetting = true;
            try {
                const auth = getAuth();
                await confirmPasswordReset(auth, this.oobCode, this.newPassword);
                this.toast.success("Password reset successful. You can now log in.");
                this.router.push("/");
            } catch (error) {
                console.error("Error resetting password:", error);
                this.toast.error("Failed to reset password. Please try again.");
            } finally {
                this.isResetting = false;
            }
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        toggleConfirmPasswordVisibility() {
            this.showConfirmPassword = !this.showConfirmPassword;
        },
    },
};
</script>
