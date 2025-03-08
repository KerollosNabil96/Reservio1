<template>
  <div
    class="max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg my-8"
  >
    <h2
      class="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6"
    >
      Account Settings
    </h2>

    <div
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-md mb-6 transform transition-all duration-300 hover:scale-[1.02]"
    >
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Profile Information
      </h3>
      <div class="mt-2 space-y-4">
        <input
          v-model="profile.fullName"
          type="text"
          placeholder="Full Name"
          class="input-field"
        />
        <input
          v-model="profile.phone"
          type="text"
          placeholder="Phone Number"
          class="input-field"
        />
        <button @click="updateProfile" class="btn">Update Profile</button>
        <div
          v-if="profileMessage"
          class="mt-4 p-2 text-center rounded-md"
          :class="profileMessageClass"
        >
          {{ profileMessage }}
        </div>
      </div>
    </div>

    <div
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-md mb-6 transform transition-all duration-300 hover:scale-[1.02]"
    >
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Change Password
      </h3>
      <div class="mt-2 space-y-4">
        <input
          v-model="password.current"
          type="password"
          placeholder="Current Password"
          class="input-field"
        />
        <input
          v-model="password.new"
          type="password"
          placeholder="New Password"
          class="input-field"
        />
        <input
          v-model="password.confirm"
          type="password"
          placeholder="Confirm New Password"
          class="input-field"
        />
        <button @click="changePassword" class="btn">Change Password</button>
        <div
          v-if="message"
          class="mt-4 p-2 text-center rounded-md"
          :class="messageClass"
        >
          {{ message }}
        </div>
      </div>
    </div>

    <div
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-[1.02]"
    >
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Notification Preferences
      </h3>
      <div class="mt-2 space-y-4">
        <label
          class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <input
            v-model="notifications.email"
            type="checkbox"
            class="checkbox"
          />
          <span class="text-gray-700 dark:text-gray-300"
            >Send notifications by email</span
          >
        </label>
        <label
          class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <input
            v-model="notifications.digests"
            type="checkbox"
            class="checkbox"
          />
          <span class="text-gray-700 dark:text-gray-300">Activity digests</span>
        </label>
        <label
          class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <input
            v-model="notifications.promotions"
            type="checkbox"
            class="checkbox"
          />
          <span class="text-gray-700 dark:text-gray-300"
            >Product tips and news</span
          >
        </label>
        <button @click="savePreferences" class="btn">Save Preferences</button>
        <div
          v-if="preferencesMessage"
          class="mt-4 p-2 text-center rounded-md"
          :class="preferencesMessageClass"
        >
          {{ preferencesMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth, ref, set, get } from "@/firebase";
import store from "@/store/store";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { update } from "firebase/database";

export default {
  data() {
    return {
      profile: {
        fullName: "",
        phone: "",
      },
      password: {
        current: "",
        new: "",
        confirm: "",
      },
      notifications: {
        email: true,
        digests: false,
        promotions: false,
      },
      preferencesMessage: "",
      preferencesMessageClass: "",
      profileMessage: "",
      profileMessageClass: "",
      message: "",
      messageClass: "",
    };
  },
  methods: {
    async updateProfile() {
      const user = auth.currentUser;

      if (!user) {
        this.profileMessage = "No user is logged in!";
        this.profileMessageClass = "text-red-500";
        return;
      }

      const newName = this.profile.fullName.trim();
      const newPhone = this.profile.phone.trim();
      const username = this.$store.state.user?.username;

      if (!username) {
        this.profileMessage = "Username not found!";
        this.profileMessageClass = "text-red-500";
        return;
      }

      if (newPhone) {
        const phoneRegex = /^(011|012|015|010)\d{8}$/;
        if (!phoneRegex.test(newPhone)) {
          this.profileMessage =
            "Phone number must be 11 digits and start with 011, 012, or 015!";
          this.profileMessageClass = "text-red-500";
          return;
        }
      }

      try {
        await update(ref(db, "users/" + store.state.user.id), {
          name: newName,
          phone: newPhone,
        });

        this.$store.commit("updateUserName", newName);
        this.$store.commit("updateUserPhone", newPhone);

        this.profileMessage = "Profile updated successfully!";
        this.profileMessageClass = "text-green-500";
      } catch (error) {
        console.error("Error updating profile:", error);
        this.profileMessage = "Error updating profile.";
        this.profileMessageClass = "text-red-500";
      }
    },
    async changePassword() {
      if (this.password.new !== this.password.confirm) {
        this.message = "Passwords do not match!";
        this.messageClass = "text-red-500";
        return;
      }

      try {
        const user = auth.currentUser;

        if (!user) {
          this.message = "No user is currently logged in!";
          this.messageClass = "text-red-500";
          return;
        }
        console.log("User UID:", user.uid);
        const credential = EmailAuthProvider.credential(
          user.email,
          this.password.current
        );

        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, this.password.new);

        this.message = "Password updated successfully!";
        this.messageClass = "text-green-500";
      } catch (error) {
        console.error("Error:", error);
        if (error.code === "auth/wrong-password") {
          this.message = "Current password is incorrect!";
          this.messageClass = "text-red-500";
        } else {
          this.message = `An error occurred: ${error.message}`;
          this.messageClass = "text-red-500";
        }
      }
    },

    async savePreferences() {
      const user = auth.currentUser;

      if (!user) {
        this.preferencesMessage = "No user is logged in!";
        this.preferencesMessageClass = "text-red-500";
        return;
      }

      try {
        await set(ref(db, "users/" + user.uid + "/preferences"), {
          email: this.notifications.email,
          digests: this.notifications.digests,
          promotions: this.notifications.promotions,
        });

        this.preferencesMessage = "Preferences saved successfully!";
        this.preferencesMessageClass = "text-green-500";
      } catch (error) {
        console.error("Error saving preferences:", error);
        this.preferencesMessage = "Error saving preferences.";
        this.preferencesMessageClass = "text-red-500";
      }
    },

    async loadPreferences() {
      const user = auth.currentUser;

      if (user) {
        const preferencesRef = ref(db, "users/" + user.uid + "/preferences");
        const snapshot = await get(preferencesRef);

        if (snapshot.exists()) {
          const preferences = snapshot.val();
          this.notifications.email = preferences.email || true;
          this.notifications.digests = preferences.digests || false;
          this.notifications.promotions = preferences.promotions || false;
        }
      }
    },
    async loadProfile() {
      const user = auth.currentUser;

      if (user) {
        const profileRef = ref(db, "users/" + user.uid);
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          const profileData = snapshot.val();
          this.profile.fullName = profileData.name || "";
          this.profile.phone = profileData.phone || "";
        }
      }
    },
  },

  created() {
    this.loadPreferences();
    this.loadProfile();
  },
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
  border-color: rgb(229 231 235);
  background-color: rgba(255, 255, 255, 0.5);
  color: rgb(17 24 39);
  transition-property: all;
  transition-duration: 200ms;
  backdrop-filter: blur(4px);
}

.dark .input-field {
  background-color: rgba(55, 65, 81, 0.5);
  border-color: rgb(75 85 99);
  color: white;
}

.input-field::placeholder {
  color: rgb(156 163 175);
}

.dark .input-field::placeholder {
  color: rgb(107 114 128);
}

.input-field:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 2px rgb(59 130 246);
}

.dark .input-field:focus {
  box-shadow: 0 0 0 2px rgb(96 165 250);
}

.btn {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  color: white;
  background-image: linear-gradient(to right, rgb(37 99 235), rgb(79 70 229));
  transition-property: all;
  transition-duration: 200ms;
  transform: translateY(0);
}

.dark .btn {
  background-image: linear-gradient(to right, rgb(59 130 246), rgb(99 102 241));
}

.btn:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-image: linear-gradient(to right, rgb(29 78 216), rgb(67 56 202));
}

.dark .btn:hover {
  background-image: linear-gradient(to right, rgb(37 99 235), rgb(79 70 229));
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246), 0 0 0 4px rgb(255 255 255);
}

.dark .btn:focus {
  box-shadow: 0 0 0 2px rgb(96 165 250), 0 0 0 4px rgb(31 41 55);
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  border: 1px solid rgb(209 213 219);
  background-color: white;
  transition-property: all;
  transition-duration: 200ms;
}

.dark .checkbox {
  border-color: rgb(75 85 99);
  background-color: rgb(55 65 81);
}

.checkbox:checked {
  background-color: rgb(37 99 235);
  border-color: rgb(37 99 235);
}

.dark .checkbox:checked {
  background-color: rgb(59 130 246);
  border-color: rgb(59 130 246);
}

.checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246);
}

.dark .checkbox:focus {
  box-shadow: 0 0 0 2px rgb(96 165 250);
}

.text-red-500 {
  background-color: rgb(254 242 242);
  color: rgb(220 38 38);
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.dark .text-red-500 {
  background-color: rgba(153, 27, 27, 0.3);
  color: rgb(248 113 113);
}

.text-green-500 {
  background-color: rgb(240 253 244);
  color: rgb(22 163 74);
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.dark .text-green-500 {
  background-color: rgba(21, 128, 61, 0.3);
  color: rgb(74 222 128);
}
</style>
